Note: this is an alternative to using the skill_predictor_function.py file where the main function is found locally.

You can connect your notebook to it by making an HTTP request. You'll use a Python library called requests within your notebook to send a request to the API's URL and retrieve the data.

1. Install the requests Library
First, you need to install the requests library in your notebook environment. Run the following command in a notebook cell:

Python

!pip install requests
The exclamation mark ! at the beginning tells the notebook to run the command in the underlying shell.

2. Connect to the Flask API
After the library is installed, you can write the Python code to make a GET request to your API.

In a new notebook cell, use the following code, replacing the URL with the correct address and port where your Flask app is running (e.g., http://127.0.0.1:5000/hello).

Python

import requests

# The URL of your running Flask API endpoint
api_url = "http://127.0.0.1:5000/"

try:
    # Make a GET request to the API
    response = requests.get(api_url)

    # Check for a successful response (status code 200)
    if response.status_code == 200:
        print("Successfully connected to the Flask API! 🎉")
        
        # Parse the JSON data from the response
        data = response.json()
        print("Response from API:", data)
    else:
        print(f"Failed to connect. Status code: {response.status_code}")
        print("Response content:", response.text)

except requests.exceptions.ConnectionError as e:
    print(f"Error: Could not connect to the API. Is your Flask app running at {api_url}?")
    print(e)