from openrouter_llm import OpenRouterLLM

def test_openrouter():
    # Initialize the LLM with specific model and parameters
    llm = OpenRouterLLM(
        model_name="deepseek/deepseek-v3-base:free",
        max_tokens=200,  # Limit response length
        temperature=0.7  # Control randomness
    )
    
    # Test prompt
    prompt = "Explain the meaning of life in one paragraph."
    
    try:
        # Get response
        response = llm._call(prompt)
        print("Response:", response)
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_openrouter() 