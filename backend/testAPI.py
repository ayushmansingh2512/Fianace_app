import google.generativeai as genai

# Paste your actual API key inside the quotes below
# (Make sure it perfectly matches the one in your FastAPI .env file!)
API_KEY = "AIzaSyA_on1h2oW9hWIgbU2vk0KgQ1wZXqKXV7s"

genai.configure(api_key=API_KEY)

# Using the legacy SDK model initialization
model = genai.GenerativeModel('gemini-2.5-flash')

print("Sending request to Gemini 2.5 Flash...")

try:
    response = model.generate_content("how you doing gemini?")
    print("\n✅ Success! Here is the response:\n")
    print(response.text)
except Exception as e:
    print(f"\n❌ An error occurred:\n{e}")