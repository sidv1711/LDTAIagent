#!/usr/bin/env python3
"""
Integration test for LDT Compliance Copilot
Tests the FastAPI backend endpoints
"""
import requests
import json
import os
from pathlib import Path

def test_health():
    """Test health endpoint"""
    try:
        response = requests.get("http://localhost:8000/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_status():
    """Test status endpoint"""
    try:
        response = requests.get("http://localhost:8000/api/status")
        data = response.json()
        print(f"✅ Status check: {response.status_code}")
        print(f"   NVIDIA API: {'✅' if data['nvidia_api_connected'] else '❌'}")
        print(f"   Knowledge Base: {'✅' if data['knowledge_base_ready'] else '❌'}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Status check failed: {e}")
        return False

def test_sample_questions():
    """Test sample questions endpoint"""
    try:
        response = requests.get("http://localhost:8000/api/sample-questions")
        data = response.json()
        print(f"✅ Sample questions: {response.status_code} - {len(data['questions'])} questions loaded")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Sample questions failed: {e}")
        return False

def test_knowledge_base_status():
    """Test knowledge base status endpoint"""
    try:
        response = requests.get("http://localhost:8000/api/knowledge-base-status")
        data = response.json()
        print(f"✅ Knowledge base status: {response.status_code} - {len(data['items'])} items")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Knowledge base status failed: {e}")
        return False

def test_qa_endpoint():
    """Test Q&A endpoint with a sample question"""
    try:
        question_data = {"question": "What are Laboratory Developed Tests?"}
        response = requests.post(
            "http://localhost:8000/api/qa",
            headers={"Content-Type": "application/json"},
            data=json.dumps(question_data)
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Q&A endpoint: {response.status_code}")
            print(f"   Answer length: {len(data['answer'])} characters")
            print(f"   Sources: {len(data.get('sources', []))} sources")
            return True
        else:
            print(f"❌ Q&A endpoint failed: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Q&A endpoint failed: {e}")
        return False

def create_test_file():
    """Create a simple test file for upload testing"""
    test_content = """
    Laboratory Developed Test Submission
    
    Test Name: Sample Biomarker Analysis
    
    1. Intended Use
    This test is intended for the quantitative measurement of biomarker X in human serum samples.
    
    2. Test Description
    The test uses enzyme-linked immunosorbent assay (ELISA) methodology.
    
    3. Precision Studies
    Precision studies were conducted using control samples.
    Within-run CV: 5.2%
    Between-run CV: 7.8%
    
    4. Reference Range
    Normal range: 10-50 ng/mL
    """
    
    test_file = Path("test_ldt_submission.txt")
    test_file.write_text(test_content)
    return test_file

def test_file_analysis():
    """Test file upload and analysis endpoint"""
    try:
        # Create test file
        test_file = create_test_file()
        
        with open(test_file, 'rb') as f:
            files = {'file': ('test_ldt_submission.txt', f, 'text/plain')}
            response = requests.post(
                "http://localhost:8000/api/analyze",
                files=files
            )
        
        # Clean up test file
        test_file.unlink()
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ File analysis: {response.status_code}")
            print(f"   Compliance score: {data['score']}%")
            print(f"   Missing sections: {len(data['missing_sections'])}")
            print(f"   Present sections: {len(data['present_sections'])}")
            return True
        else:
            print(f"❌ File analysis failed: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ File analysis failed: {e}")
        return False

def main():
    """Run all integration tests"""
    print("🧪 LDT Compliance Copilot - Integration Tests")
    print("=" * 50)
    
    print("\n📡 Testing Backend Endpoints...")
    
    tests = [
        ("Health Check", test_health),
        ("Status Endpoint", test_status),
        ("Sample Questions", test_sample_questions),
        ("Knowledge Base Status", test_knowledge_base_status),
        ("Q&A Endpoint", test_qa_endpoint),
        ("File Analysis", test_file_analysis),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n🔍 Testing {test_name}...")
        if test_func():
            passed += 1
        else:
            print(f"   ⚠️  {test_name} test failed")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All integration tests passed! Backend is ready.")
        print("\n🚀 Next steps:")
        print("1. Start the servers: python start_servers.py")
        print("2. Open frontend: http://localhost:3000")
        print("3. Test the full application workflow")
    else:
        print("⚠️  Some tests failed. Check the backend setup.")
        print("\n🔧 Troubleshooting:")
        print("1. Ensure NVIDIA_API_KEY is set in .env")
        print("2. Check that all dependencies are installed")
        print("3. Verify the backend server is running on port 8000")

if __name__ == "__main__":
    main()