import logging
import time
import functools
import traceback
from typing import Callable, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("fitness_chatbot.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("fitness_chatbot")

def log_function_call(func: Callable) -> Callable:
    """Decorator to log function calls with timing information."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        logger.info(f"Calling {func.__name__} with args: {args}, kwargs: {kwargs}")
        try:
            result = func(*args, **kwargs)
            end_time = time.time()
            logger.info(f"{func.__name__} completed in {end_time - start_time:.2f} seconds")
            return result
        except Exception as e:
            logger.error(f"Error in {func.__name__}: {str(e)}")
            logger.error(traceback.format_exc())
            raise
    return wrapper

def log_llm_request(prompt: str, response: str, model: str, duration: float) -> None:
    """Log LLM request and response details."""
    logger.info(f"LLM Request to {model}:")
    logger.info(f"Prompt: {prompt[:200]}...")
    logger.info(f"Response: {response[:200]}...")
    logger.info(f"Duration: {duration:.2f} seconds")

def log_error(error: Exception, context: str = "") -> None:
    """Log error with context."""
    logger.error(f"Error in {context}: {str(error)}")
    logger.error(traceback.format_exc())

def log_user_interaction(user_input: str, system_response: str) -> None:
    """Log user interaction with the chatbot."""
    logger.info(f"User: {user_input}")
    logger.info(f"System: {system_response[:200]}...")

def log_bmi_calculation(weight: float, height: float, bmi: float, category: str) -> None:
    """Log BMI calculation details."""
    logger.info(f"BMI Calculation - Weight: {weight}kg, Height: {height}cm")
    logger.info(f"BMI: {bmi:.2f}, Category: {category}")

def log_macro_calculation(tdee: float, goal: str, macros: dict) -> None:
    """Log macronutrient calculation details."""
    logger.info(f"Macro Calculation - TDEE: {tdee:.0f}, Goal: {goal}")
    logger.info(f"Macros: {macros}") 