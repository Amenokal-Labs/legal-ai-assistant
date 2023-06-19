import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def main(question = "hey"):

    messages=[
                {"role": "system", "content": "You are a leagal assistant"},
            ]

    while True:
        message = question
        # message = input("user: ")
        if message:
            messages.append(
                {"role": "user", "content": message},
            )
            chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
        
        #print(f"ChatGPT: {reply}")
        reply = chat.choices[0].message.content
        messages.append({"role": "assistant", "content": reply})

        return reply

if __name__ == "__main__":
    main()        