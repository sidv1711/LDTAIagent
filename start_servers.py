#!/usr/bin/env python3
"""
Startup script for LDT Compliance Copilot
Starts both the FastAPI backend and Next.js frontend
"""
import os
import sys
import subprocess
import time
import signal
from pathlib import Path

def start_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting FastAPI backend server...")
    backend_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "api_server:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload"
    ], cwd=Path(__file__).parent)
    return backend_process

def start_frontend():
    """Start the Next.js frontend server"""
    print("🌐 Starting Next.js frontend server...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    # Check if node_modules exists, if not install dependencies
    if not (frontend_dir / "node_modules").exists():
        print("📦 Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
    
    frontend_process = subprocess.Popen([
        "npm", "run", "dev"
    ], cwd=frontend_dir)
    return frontend_process

def main():
    """Main startup function"""
    print("🔬 LDT Compliance Copilot - Starting Development Servers")
    print("📡 Backend: FastAPI + Python Agent")
    print("🌐 Frontend: Next.js + React")  
    print("=" * 60)
    
    # Check for NVIDIA API key
    if not os.getenv('NVIDIA_API_KEY'):
        print("⚠️  WARNING: NVIDIA_API_KEY not found in environment variables")
        print("   AI analysis features will not work without this key")
        print("   Get your key from: https://build.nvidia.com/nvidia/nemotron-4-340b-instruct")
        print()
    else:
        print("✅ NVIDIA_API_KEY found - AI features enabled")
        print()
    
    backend_process = None
    frontend_process = None
    
    try:
        # Start backend
        backend_process = start_backend()
        time.sleep(3)  # Give backend time to start
        
        # Start frontend
        frontend_process = start_frontend()
        time.sleep(2)  # Give frontend time to start
        
        print("\n✅ Servers started successfully!")
        print("📋 Backend API: http://localhost:8000")
        print("🌐 Frontend App: http://localhost:3000")
        print("📖 API Docs: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop both servers")
        
        # Wait for processes
        while True:
            time.sleep(1)
            
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("❌ Backend process terminated unexpectedly")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process terminated unexpectedly")
                break
                
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
    finally:
        # Clean up processes
        if backend_process:
            backend_process.terminate()
            try:
                backend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                backend_process.kill()
                
        if frontend_process:
            frontend_process.terminate()
            try:
                frontend_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                frontend_process.kill()
        
        print("✅ Servers stopped")

if __name__ == "__main__":
    main()