#!/usr/bin/env python3
"""
Simple HTTP server for the LDT Compliance Copilot Frontend
"""
import http.server
import os
import socketserver
import sys
from pathlib import Path


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="frontend", **kwargs)

    def end_headers(self):
        # Add CORS headers for development
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()


def main():
    # Change to frontend directory
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        print("💡 Make sure you're in the project root directory")
        sys.exit(1)

    os.chdir(frontend_dir)

    PORT = 3000

    print("🚀 Starting LDT Compliance Copilot Frontend Server")
    print("=" * 50)
    print(f"📁 Serving from: {frontend_dir.absolute()}")
    print(f"🌐 URL: http://localhost:{PORT}")
    print(f"🌐 Network URL: http://0.0.0.0:{PORT}")
    print("⏹️  Press Ctrl+C to stop")
    print("=" * 50)

    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Server started successfully on port {PORT}")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Port {PORT} is already in use")
            print(f"💡 Try a different port or stop the existing server")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
