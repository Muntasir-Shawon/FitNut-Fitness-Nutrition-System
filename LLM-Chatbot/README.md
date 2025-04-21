# Fitness and Nutrition Assistant

A comprehensive fitness and nutrition system powered by LangChain and OpenRouter AI. The system includes a chatbot that can provide personalized fitness advice, nutrition recommendations, and workout plans.

## Features
- AI-powered fitness and nutrition chatbot using OpenRouter
- Personalized workout recommendations
- Nutrition advice and meal planning
- BMI calculation and health metrics
- Progress tracking
- Debugging utilities for troubleshooting

## Setup
1. Clone this repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root directory and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```
4. Run the application:
   ```
   streamlit run app.py
   ```

## Usage
1. Launch the application using the command above
2. Input your fitness goals and preferences in the sidebar
3. Interact with the chatbot for personalized advice
4. Use the "Quick Actions" buttons to generate meal plans and workout routines
5. Track your progress and get recommendations

## Components
- `app.py`: Main Streamlit application with UI
- `openrouter_llm.py`: OpenRouter LLM integration with LangChain
- `utils.py`: Utility functions for calculations
- `debug_utils.py`: Debugging utilities

## Debugging
The application includes comprehensive debugging utilities:
- Function call logging with timing information
- LLM request and response logging
- Error tracking with context
- User interaction logging
- Health metric calculation logging

Logs are stored in `fitness_chatbot.log` for troubleshooting.

## Note
Make sure to obtain an OpenRouter API key from [OpenRouter](https://openrouter.ai/) to use this application. 