import os
from typing import Any, Dict, List, Optional
from langchain.llms.base import LLM
from langchain.callbacks.manager import CallbackManagerForLLMRun
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from openai import OpenAI
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class OpenRouterLLM(LLM, BaseModel):
    """OpenRouter LLM integration with LangChain."""
    
    model_name: str = Field(default="anthropic/claude-3-opus-20240229")
    temperature: float = Field(default=0.7)
    max_tokens: Optional[int] = Field(default=1000)
    top_p: float = Field(default=1.0)
    frequency_penalty: float = Field(default=0.0)
    presence_penalty: float = Field(default=0.0)
    api_key: str = Field(default="")
    api_base: str = Field(default="https://openrouter.ai/api/v1")
    max_context_length: int = Field(default=10000)
    client: Any = Field(default=None)
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY not found in environment variables. Please set it in your .env file.")
        
        try:
            self.client = OpenAI(
                base_url=self.api_base,
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": "https://github.com/yourusername/fitness-chatbot",
                    "X-Title": "Fitness & Nutrition Assistant"
                }
            )
            # Test the connection
            self.client.chat.completions.create(
                model=self.model_name,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5
            )
            logger.info("OpenRouter LLM initialized successfully")
        except Exception as e:
            error_msg = str(e)
            if "404" in error_msg and "data policy" in error_msg:
                logger.error("Please enable prompt training in your OpenRouter settings: https://openrouter.ai/settings/privacy")
            else:
                logger.error(f"Failed to initialize OpenRouter client: {error_msg}")
            raise
    
    @property
    def _llm_type(self) -> str:
        return "openrouter"
    
    @property
    def _identifying_params(self) -> Dict[str, Any]:
        """Get the identifying parameters."""
        return {
            "model_name": self.model_name,
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "top_p": self.top_p,
            "frequency_penalty": self.frequency_penalty,
            "presence_penalty": self.presence_penalty,
            "max_context_length": self.max_context_length,
        }
    
    def _validate_context_length(self, prompt: str) -> None:
        """Validate that the prompt doesn't exceed context length limits."""
        prompt_length = len(prompt)
        if prompt_length > self.max_context_length:
            raise ValueError(
                f"Prompt length ({prompt_length}) exceeds maximum context length "
                f"({self.max_context_length}). Please reduce the prompt length."
            )
    
    def _call(
        self,
        prompt: str,
        stop: Optional[List[str]] = None,
        run_manager: Optional[CallbackManagerForLLMRun] = None,
        **kwargs: Any,
    ) -> str:
        """Call the OpenRouter API using OpenAI SDK."""
        try:
            # Prepare the messages array
            messages = [
                {"role": "system", "content": "You are a helpful fitness and nutrition assistant. Please respond in English only."},
                {"role": "user", "content": prompt}
            ]
            
            # Make the API call
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=self.top_p,
                frequency_penalty=self.frequency_penalty,
                presence_penalty=self.presence_penalty,
                stop=stop,
                **kwargs
            )
            
            # Extract and validate the response
            if not completion.choices:
                logger.error("No response choices returned from the API")
                return "I apologize, but I couldn't generate a response at the moment. Please try again."
            
            response = completion.choices[0].message.content
            if not response or len(response.strip()) == 0:
                logger.error("Empty response received from the API")
                return "I apologize, but I received an empty response. Please try again."
            
            logger.info(f"Successfully generated response with {len(response)} characters")
            return response.strip()
            
        except Exception as e:
            error_msg = f"Error calling OpenRouter API: {str(e)}"
            logger.error(error_msg)
            return "I apologize, but I encountered an error. Please try again in a moment or contact support if the issue persists." 