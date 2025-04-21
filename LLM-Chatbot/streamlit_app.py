import streamlit as st
from app import (
    initialize_llm, create_conversation_chain, get_ai_response,
    calculate_bmi, calculate_bmr, calculate_tdee, calculate_macros,
    get_bmi_category, generate_workout_split
)

# Set page configuration
st.set_page_config(
    page_title="Fitness & Nutrition Assistant",
    page_icon="💪",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better UI
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #4CAF50;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #2196F3;
        margin-top: 1rem;
    }
    .info-box {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .metric-card {
        background-color: #e6f7ff;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-bottom: 1rem;
    }
    .metric-value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #4CAF50;
    }
    .chat-message {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
    }
    .user-message {
        background-color: #e6f7ff;
    }
    .assistant-message {
        background-color: #f0f2f6;
    }
</style>
""", unsafe_allow_html=True)

def main():
    st.markdown('<h1 class="main-header">🏃‍♂️ Fitness & Nutrition Assistant</h1>', unsafe_allow_html=True)
    
    # Initialize session state
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    if "llm" not in st.session_state:
        with st.spinner("🤖 Initializing AI model... This may take a moment."):
            try:
                st.session_state.llm = initialize_llm()
                if st.session_state.llm:
                    st.session_state.conversation = create_conversation_chain(st.session_state.llm)
                    st.success("✅ AI model initialized successfully!")
                else:
                    st.error("❌ Failed to initialize AI model. Please try refreshing the page.")
                    return
            except Exception as e:
                st.error(f"❌ Error initializing AI model: {str(e)}")
                return
    
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
        st.markdown(f"Protein: {macros['protein']}g")
        st.markdown(f"Carbs: {macros['carbs']}g")
        st.markdown(f"Fat: {macros['fat']}g")
    
    # Main chat interface
    st.markdown('<h2 class="sub-header">Chat with Your Fitness Assistant</h2>', unsafe_allow_html=True)
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me anything about fitness and nutrition..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Get AI response
        with st.chat_message("assistant"):
            with st.spinner("🤔 Thinking..."):
                try:
                    response = get_ai_response(st.session_state.conversation, prompt)
                    if response and not response.startswith("I apologize"):
                        st.markdown(response)
                        st.session_state.messages.append({"role": "assistant", "content": response})
                    else:
                        st.error("I'm having trouble generating a response. Please try again.")
                except Exception as e:
                    st.error("I'm having trouble processing your request. Please try again.")

if __name__ == "__main__":
    main() 