from fitness_bot import FitnessBot

def main():
    try:
        bot = FitnessBot()
        bot.start_chat()
    except Exception as e:
        print(f"Error: {e}")
        print("Please make sure your API key is correct and you have an active internet connection.")

if __name__ == "__main__":
    main() 