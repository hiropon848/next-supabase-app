import os
import sys
import json
import requests
from dotenv import load_dotenv

# Load env
env_path = os.path.join(os.getcwd(), ".agent/config.env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found.")
    sys.exit(1)

query = " ".join(sys.argv[1:])
if not query:
    print("Usage: python .agent/tools/research_gemini.py <query>")
    sys.exit(1)

print(f"Searching Gemini (via REST) for: {query}...")

url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={api_key}"
headers = {"Content-Type": "application/json"}
payload = {
    "contents": [{
        "parts": [{"text": query}]
    }],
    "tools": [{
        "google_search": {}
    }]
}

try:
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()
    
    # Parse response
    candidates = data.get("candidates", [])
    if not candidates:
        print("No response candidates.")
        sys.exit(0)
        
    candidate = candidates[0]
    content = candidate.get("content", {})
    parts = content.get("parts", [])
    text = "".join([p.get("text", "") for p in parts])
    
    print("\n### Answer")
    print(text)
    
    # Parse grounding metadata
    grounding_metadata = candidate.get("groundingMetadata", {})
    search_entry_point = grounding_metadata.get("searchEntryPoint", {})
    rendered_content = search_entry_point.get("renderedContent")
    
    if rendered_content:
        print("\n### Sources")
        print(rendered_content)
    else:
        chunks = grounding_metadata.get("groundingChunks", [])
        if chunks:
            print("\n### Grounding Details")
            for chunk in chunks:
                web = chunk.get("web", {})
                if web:
                    title = web.get("title", "Unknown")
                    uri = web.get("uri", "#")
                    print(f"- [{title}]({uri})")

except Exception as e:
    print(f"Error calling Gemini API: {e}")
    if 'response' in locals():
        print(f"Response: {response.text}")
    sys.exit(1)
