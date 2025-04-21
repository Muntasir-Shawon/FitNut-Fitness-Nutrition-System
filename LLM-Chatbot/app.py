import os
import time
import streamlit as st
from dotenv import load_dotenv
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from openrouter_llm import OpenRouterLLM
from utils import (
    calculate_bmi, calculate_bmr, calculate_tdee, 
    calculate_macros, get_bmi_category, generate_workout_split
)
from debug_utils import (
    log_function_call, log_llm_request, log_error, 
    log_user_interaction, log_bmi_calculation, log_macro_calculation
)
import logging

# Load environment variables
load_dotenv()

# Verify API key is set
if not os.getenv("OPENROUTER_API_KEY"):
    raise ValueError("OPENROUTER_API_KEY not found in environment variables. Please set it in your .env file.")

logger = logging.getLogger(__name__)

@log_function_call
def initialize_llm():
    """Initialize the OpenRouter LLM."""
    try:
        llm = OpenRouterLLM(
            model_name="deepseek/deepseek-chat-v3-0324:free",  # Updated model
            temperature=0.7,
            max_tokens=2000,  # Increased for better responses
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )
        return llm
    except Exception as e:
        log_error(e, "initialize_llm")
        return None

@log_function_call
def create_conversation_chain(llm):
    """Create a conversation chain with the LLM."""
    # Create a more robust prompt template
    template = """You are a helpful and knowledgeable fitness and nutrition assistant. Your role is to provide accurate, practical, and actionable advice about fitness, nutrition, and health.

Current conversation:
{history}

Human: {input}

Assistant: I will provide a helpful and informative response about fitness and nutrition. """

    PROMPT = PromptTemplate(
        input_variables=["history", "input"], 
        template=template
    )
    
    # Create the conversation chain with memory
    memory = ConversationBufferMemory(
        return_messages=True,
        memory_key="history",
        input_key="input"
    )
    
    conversation = ConversationChain(
        llm=llm,
        prompt=PROMPT,
        memory=memory,
        verbose=True
    )
    
    return conversation

@log_function_call
def get_ai_response(conversation, context_prompt):
    """Get response from the AI model."""
    start_time = time.time()
    try:
        # Get the response
        response = conversation.predict(input=context_prompt)
        end_time = time.time()
        
        # Log the request and response
        log_llm_request(context_prompt, response, "OpenRouter", end_time - start_time)
        
        # Validate the response
        if not response:
            logger.error("Empty response received from the model")
            return "I apologize, but I didn't receive a response. Please try again."
            
        if len(response.strip()) == 0:
            logger.error("Response is empty after stripping whitespace")
            return "I apologize, but I received an empty response. Please try again."
            
        if response.startswith("I apologize"):
            logger.error("Model returned an apology message")
            return "I'm having trouble generating a response. Please try rephrasing your question."
        
        return response.strip()
        
    except Exception as e:
        logger.error(f"Error in get_ai_response: {str(e)}")
        log_error(e, "get_ai_response")
        return "I apologize, but I encountered an error while processing your request. Please try again."

@log_function_call
def generate_meal_plan(goal, activity_level, dietary_restrictions):
    """Generate a meal plan based on user's goal and preferences."""
    prompt = f"""Generate a 7-day meal plan for someone with the following profile:
    - Fitness Goal: {goal}
    - Activity Level: {activity_level}
    - Dietary Restrictions: {dietary_restrictions}
    
    Include breakfast, lunch, dinner, and snacks. For each meal, provide:
    1. Ingredients and portions
    2. Approximate calories and macronutrients
    3. Preparation instructions
    4. Nutritional benefits
    
    Format the response as a structured meal plan with clear sections for each day."""
    
    return prompt

@log_function_call
def generate_workout_plan(goal, days_per_week, fitness_level):
    """Generate a workout plan based on user's goal and preferences."""
    prompt = f"""Generate a {days_per_week}-day workout plan for someone with the following profile:
    - Fitness Goal: {goal}
    - Fitness Level: {fitness_level}
    
    For each workout day, provide:
    1. List of exercises with sets, reps, and rest periods
    2. Proper form instructions
    3. Target muscle groups
    4. Progression recommendations
    
    Format the response as a structured workout plan with clear sections for each day."""
    
    return prompt

# Main application
def main():
    st.markdown('<h1 class="main-header">🏃‍♂️ Fitness & Nutrition Assistant</h1>', unsafe_allow_html=True)
    
    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    if "llm" not in st.session_state:
        with st.spinner("Initializing AI model..."):
            st.session_state.llm = initialize_llm()
            if st.session_state.llm:
                st.session_state.conversation = create_conversation_chain(st.session_state.llm)
    
    # Sidebar for user profile
    with st.sidebar:
        st.markdown('<h2 class="sub-header">Your Profile</h2>', unsafe_allow_html=True)
        
        # Personal information
        st.subheader("Personal Information")
        weight = st.number_input("Weight (kg)", min_value=30, max_value=200, value=70)
        height = st.number_input("Height (cm)", min_value=100, max_value=250, value=170)
        age = st.number_input("Age", min_value=15, max_value=100, value=30)
        gender = st.radio("Gender", ["Male", "Female"])
        
        # Fitness goals
        st.subheader("Fitness Goals")
        fitness_goal = st.selectbox(
            "Fitness Goal",
            ["Weight Loss", "Muscle Gain", "General Fitness", "Athletic Performance"]
        )
        activity_level = st.selectbox(
            "Activity Level",
            ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extremely Active"]
        )
        fitness_level = st.selectbox(
            "Fitness Level",
            ["Beginner", "Intermediate", "Advanced"]
        )
        
        # Dietary preferences
        st.subheader("Dietary Preferences")
        dietary_restrictions = st.multiselect(
            "Dietary Restrictions",
            ["None", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo"]
        )
        
        # Calculate health metrics
        bmi = calculate_bmi(weight, height)
        bmi_category = get_bmi_category(bmi)
        bmr = calculate_bmr(weight, height, age, gender)
        tdee = calculate_tdee(bmr, activity_level.lower())
        macros = calculate_macros(tdee, fitness_goal)
        
        # Log calculations
        log_bmi_calculation(weight, height, bmi, bmi_category)
        log_macro_calculation(tdee, fitness_goal, macros)
        
        # Display health metrics
        st.markdown('<h3 class="sub-header">Health Metrics</h3>', unsafe_allow_html=True)
        
        col1, col2 = st.columns(2)
        with col1:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown("BMI")
            st.markdown(f'<div class="metric-value">{bmi:.1f}</div>', unsafe_allow_html=True)
            st.markdown(bmi_category)
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown("Daily Calories")
            st.markdown(f'<div class="metric-value">{macros["calories"]}</div>', unsafe_allow_html=True)
            st.markdown("Recommended")
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Macronutrient breakdown
        st.markdown('<h3 class="sub-header">Macronutrients</h3>', unsafe_allow_html=True)
        
        col1, col2, col3 = st.columns(3)
        with col1:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown("Protein")
            st.markdown(f'<div class="metric-value">{macros["protein"]}g</div>', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col2:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown("Carbs")
            st.markdown(f'<div class="metric-value">{macros["carbs"]}g</div>', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
        
        with col3:
            st.markdown('<div class="metric-card">', unsafe_allow_html=True)
            st.markdown("Fat")
            st.markdown(f'<div class="metric-value">{macros["fat"]}g</div>', unsafe_allow_html=True)
            st.markdown('</div>', unsafe_allow_html=True)
        
        # Generate plans
        st.markdown('<h3 class="sub-header">Generate Plans</h3>', unsafe_allow_html=True)
        
        if st.button("Generate Meal Plan"):
            prompt = generate_meal_plan(fitness_goal, activity_level, dietary_restrictions)
            response = get_ai_response(st.session_state.conversation, prompt)
            st.session_state.messages.append({"role": "assistant", "content": response})
        
        if st.button("Generate Workout Plan"):
            prompt = generate_workout_plan(fitness_goal, 5, fitness_level)
            response = get_ai_response(st.session_state.conversation, prompt)
            st.session_state.messages.append({"role": "assistant", "content": response})
    
    # Main chat interface
    st.markdown('<h2 class="sub-header">Chat with Your Fitness Coach</h2>', unsafe_allow_html=True)
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me anything about fitness or nutrition"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        with st.chat_message("assistant"):
            response = get_ai_response(st.session_state.conversation, prompt)
            st.markdown(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main() 