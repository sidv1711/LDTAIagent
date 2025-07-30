#!/usr/bin/env python3
"""
Test script to demonstrate NVIDIA API logging functionality
"""
import os
import logging
from agent.nemotron_llm import nemotron, nemotron_fallback

# Set up logging to also display on console
logging.basicConfig(
    level=logging.INFO, 
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def test_api_scenarios():
    """Test different API scenarios to show logging"""
    
    print("=" * 60)
    print("🧪 TESTING NVIDIA API LOGGING FUNCTIONALITY")
    print("=" * 60)
    
    test_prompt = "What are FDA requirements for LDT analytical validation?"
    
    # Test 1: No API key scenario
    print("\n📋 TEST 1: No API Key Scenario")
    print("-" * 40)
    
    # Temporarily remove API key if it exists
    original_key = os.environ.get('NVIDIA_API_KEY')
    if 'NVIDIA_API_KEY' in os.environ:
        del os.environ['NVIDIA_API_KEY']
    
    try:
        response = nemotron(test_prompt)
        print(f"Response preview: {response[:100]}...")
    except ValueError as e:
        logger.info(f"Expected error when no API key: {e}")
        response = nemotron_fallback(test_prompt)
        print(f"Fallback response preview: {response[:100]}...")
    
    # Test 2: With API key scenario (if available)
    print("\n\n📋 TEST 2: API Key Present Scenario")
    print("-" * 40)
    
    if original_key:
        os.environ['NVIDIA_API_KEY'] = original_key
        print("🔑 API key restored for testing...")
        try:
            response = nemotron(test_prompt)
            print(f"Response preview: {response[:100]}...")
        except Exception as e:
            logger.info(f"API call failed (expected if invalid key): {e}")
    else:
        print("🚫 No API key available to test - showing fallback only")
        os.environ['NVIDIA_API_KEY'] = "test_key_for_logging"
        try:
            response = nemotron(test_prompt)
            print(f"Response preview: {response[:100]}...")
        except Exception as e:
            logger.info(f"API call failed with test key: {e}")
        finally:
            if 'NVIDIA_API_KEY' in os.environ:
                del os.environ['NVIDIA_API_KEY']
    
    print("\n" + "=" * 60)
    print("✅ LOGGING TEST COMPLETED")
    print("=" * 60)
    print("\n📊 Key Logging Features Added:")
    print("   🚀 API call initiation tracking")
    print("   📝 Prompt length and parameter logging")
    print("   🌐 HTTP request and response status")
    print("   ✅ Success/failure tracking")
    print("   🔄 Fallback usage detection")
    print("   ⚠️  Error handling and warnings")

if __name__ == "__main__":
    test_api_scenarios()