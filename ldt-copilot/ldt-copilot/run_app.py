#!/usr/bin/env python3
"""
LDT Compliance Copilot - Application Runner
"""
import os
import sys
import subprocess
from pathlib import Path

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'streamlit', 'faiss', 'langchain', 'jinja2'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("💡 Install with: pip install -r requirements-ldt.txt")
        return False
    
    return True

def check_knowledge_base():
    """Check if knowledge base exists"""
    kb_path = Path("stores/fda_clia")
    if not kb_path.exists():
        print("⚠️  Knowledge base not found")
        print("💡 Run: python scripts/build_vector_store.py")
        print("📁 Add PDF documents to corpus/ folder first")
        return False
    
    print("✅ Knowledge base found")
    return True

def check_environment():
    """Check environment setup"""
    issues = []
    
    # Check for NVIDIA API key
    if not os.getenv('NVIDIA_API_KEY'):
        issues.append("NVIDIA_API_KEY environment variable not set (will use fallback)")
    else:
        print("✅ NVIDIA API key configured")
    
    # Check corpus folder
    corpus_path = Path("corpus")
    if not corpus_path.exists():
        issues.append("corpus/ folder not found")
    elif not list(corpus_path.glob("*.pdf")):
        issues.append("No PDF files in corpus/ folder")
    else:
        pdf_count = len(list(corpus_path.glob("*.pdf")))
        print(f"✅ Found {pdf_count} PDF files in corpus/")
    
    if issues:
        print("⚠️  Environment issues:")
        for issue in issues:
            print(f"   - {issue}")
    
    return len(issues) == 0

def main():
    """Main application runner"""
    print("🔬 LDT Compliance Copilot")
    print("=" * 40)
    
    # Check dependencies
    if not check_dependencies():
        sys.exit(1)
    
    print("✅ Dependencies installed")
    
    # Check knowledge base
    kb_exists = check_knowledge_base()
    
    # Check environment
    env_ok = check_environment()
    
    if not kb_exists:
        print("\n🚀 Quick start:")
        print("1. Add PDF documents to corpus/ folder")
        print("2. Run: python scripts/build_vector_store.py")
        print("3. Run: python run_app.py")
        print("\nContinuing with demo mode...")
    
    print("\n🚀 Starting Streamlit application...")
    print("📱 Open your browser to: http://localhost:8501")
    print("⏹️  Press Ctrl+C to stop")
    
    try:
        subprocess.run([
            sys.executable, "-m", "streamlit", "run", "app.py",
            "--server.port", "8501",
            "--server.address", "0.0.0.0"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Application stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running Streamlit: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()