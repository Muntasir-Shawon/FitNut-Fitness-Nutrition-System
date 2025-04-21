from langchain_community.llms import GooglePalm
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
import os
from dotenv import load_dotenv

class FitnessBot:
    def __init__(self):
        # Load environment variables
        load_dotenv()
        
        # Set up the API key
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("Please set your GOOGLE_API_KEY in the .env file")
        os.environ["GOOGLE_API_KEY"] = self.api_key

        # Initialize the components
        self._setup_bot()

    def _setup_bot(self):
        """Set up the chatbot components"""
        # Initialize the LLM
        self.llm = GooglePalm(temperature=0.7)

        # Define the prompt template
        template = """You are FitBot, an expert AI assistant specializing in fitness, nutrition, and health. 
        Provide accurate, scientific, and practical advice while maintaining a motivating and friendly tone.
        
        Rules:
        1. Give specific, actionable advice
        2. Always prioritize safety
        3. Include scientific reasoning when relevant
        4. Recommend consulting healthcare professionals for medical issues
        
        Current conversation:
        {history}
        
        Human: {input}
        AI Assistant:"""

        prompt = PromptTemplate(input_variables=["history", "input"], template=template)

        # Set up conversation memory
        self.memory = ConversationBufferMemory()

        # Create the conversation chain
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=prompt,
            verbose=False
        )

    def get_response(self, user_input):
        """Get response from the chatbot"""
        try:
            response = self.conversation.predict(input=user_input)
            return response
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"

    def start_chat(self):
        """Start the interactive chat session"""
        print("\n🏋️‍♂️ Welcome to FitBot! Your AI Fitness & Nutrition Assistant 🥗")
        print("----------------------------------------")
        print("You can ask me about:")
        print("- Workout routines and exercise techniques")
        print("- Nutrition advice and meal planning")
        print("- Health and wellness tips")
        print("- Fitness goals and progress tracking")
        print("\nType 'quit' to exit")
        print("----------------------------------------")

        while True:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("\nThanks for using FitBot! Stay healthy! 💪")
                break
            
            if not user_input:
                print("Please type something!")
                continue
                
            response = self.get_response(user_input)
            print("\nFitBot:", response)