import openai

openai.api_key = "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"

messages=[
            {"role": "system", "content": "You are a leagal assistant"},
        ]

while True:
    message = input("User : ")
    if message:
        messages.append(
            {"role": "user", "content": message},
        )
        chat = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", messages=messages
        )
    
    reply = chat.choices[0].message.content
    print(f"ChatGPT: {reply}")
    messages.append({"role": "assistant", "content": reply})