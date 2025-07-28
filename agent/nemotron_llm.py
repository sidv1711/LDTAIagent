"""
NVIDIA Nemotron 3.3 LLM wrapper for LDT compliance queries
"""
import os
import requests
from typing import Optional
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# NVIDIA API configuration
API_ENDPOINT = "https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/nemotron-3_3"
HEADERS = {
    "Authorization": f"Bearer {os.getenv('NVIDIA_API_KEY')}",
    "Content-Type": "application/json"
}

def nemotron(prompt: str, max_tokens: int = 1024, temperature: float = 0.7) -> str:
    """
    Send prompt to NVIDIA Nemotron 3.3 and return response
    
    Args:
        prompt: The input prompt for the model
        max_tokens: Maximum tokens to generate (default: 1024)
        temperature: Sampling temperature (default: 0.7)
    
    Returns:
        Generated text response
    """
    if not os.getenv('NVIDIA_API_KEY'):
        raise ValueError(
            "NVIDIA_API_KEY environment variable not set. "
            "Please set your NVIDIA API key to use Nemotron."
        )
    
    payload = {
        "inputs": [{"text": prompt}],
        "parameters": {
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": 0.9,
            "stream": False
        }
    }
    
    try:
        response = requests.post(
            API_ENDPOINT,
            json=payload,
            headers=HEADERS,
            timeout=30
        )
        response.raise_for_status()
        
        result = response.json()
        
        # Extract the generated text from the response
        if "choices" in result and len(result["choices"]) > 0:
            return result["choices"][0].get("message", {}).get("content", "")
        elif "outputs" in result and len(result["outputs"]) > 0:
            return result["outputs"][0].get("text", "")
        else:
            return "No response generated"
            
    except requests.exceptions.RequestException as e:
        return f"Error calling Nemotron API: {e}"
    except Exception as e:
        return f"Unexpected error: {e}"

def nemotron_fallback(prompt: str) -> str:
    """
    Fallback function when NVIDIA API is not available
    Returns a structured response for demonstration purposes
    """
    return f"""
Based on FDA and CLIA regulatory requirements, the following guidance applies:

**Regulatory Framework:**
- Laboratory Developed Tests (LDTs) must comply with FDA oversight
- Clinical Laboratory Improvement Amendments (CLIA) validation requirements apply
- Quality System regulations (21 CFR 820) must be followed

**Key Requirements:**
- Intended use must be clearly defined
- Analytical validity (LoD, LoB, precision, linearity) must be established
- Clinical validity through appropriate studies
- Risk assessment and hazard analysis required

**Recommendation:**
Please consult the specific regulatory documents for detailed requirements.

*Note: This is a fallback response. Please configure NVIDIA_API_KEY for full functionality.*
"""

# Test function
def test_nemotron():
    """Test the Nemotron connection"""
    test_prompt = "What are the key requirements for LDT validation under FDA regulations?"
    
    if os.getenv('NVIDIA_API_KEY'):
        print("Testing Nemotron API connection...")
        response = nemotron(test_prompt)
        print(f"✅ Response received: {response[:100]}...")
    else:
        print("⚠️  NVIDIA_API_KEY not set, using fallback")
        response = nemotron_fallback(test_prompt)
        print(f"✅ Fallback response: {response[:100]}...")

if __name__ == "__main__":
    test_nemotron()