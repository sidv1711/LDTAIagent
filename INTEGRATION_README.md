# LDT Compliance Copilot - Next.js Integration

This document explains how the Next.js frontend has been wired to the existing Python backend.

## Architecture Overview

```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐
│   Next.js       │ ◄─────────────────► │   FastAPI       │
│   Frontend      │                     │   Backend       │
│   (Port 3000)   │                     │   (Port 8000)   │
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │   Python Agent │
                                        │   - NVIDIA API  │
                                        │   - FAISS KB    │
                                        │   - PDF Gen     │
                                        └─────────────────┘
```

## New Files Created

### Backend API Server
- `api_server.py` - FastAPI server that exposes the Python functionality as REST APIs
- Updated `requirements.txt` - Added FastAPI dependencies

### Frontend Components
- `frontend/src/components/compliance/document-upload.tsx` - File upload with backend integration
- `frontend/src/components/compliance/qa-assistant.tsx` - Q&A chat with backend integration  
- `frontend/src/components/compliance/knowledge-base-status.tsx` - Real-time status from backend
- `frontend/src/app/page.tsx` - Updated main page using new components

### Utilities
- `start_servers.py` - Development script to start both servers simultaneously

## API Endpoints

The FastAPI backend exposes these endpoints:

### Analysis
- `POST /api/analyze` - Upload and analyze document
- `POST /api/generate-pdf` - Generate PDF report from analysis

### Q&A Assistant  
- `POST /api/qa` - Ask compliance questions
- `GET /api/sample-questions` - Get sample questions

### Status
- `GET /api/status` - System status (API keys, knowledge base)
- `GET /api/knowledge-base-status` - Knowledge base items
- `GET /health` - Health check

## Key Integration Features

### 1. File Upload & Analysis
- Drag & drop file upload in Next.js
- Real-time progress indicators
- Backend validation for file types and sizes
- Comprehensive analysis results display

### 2. PDF Generation
- Click-to-download PDF reports
- Professional formatting maintained
- Streaming file download

### 3. Q&A Assistant
- Interactive chat interface
- Real-time responses from NVIDIA API
- Source attribution from knowledge base
- Sample question suggestions

### 4. Real-time Status
- API connectivity monitoring
- Knowledge base readiness
- Automatic status refresh

## Running the Application

### Prerequisites
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies  
cd frontend
npm install
```

### Environment Setup
Create `.env` file with:
```
NVIDIA_API_KEY=your_nvidia_api_key_here
```

### Start Development Servers

**Option 1: Automated startup**
```bash
python start_servers.py
```

**Option 2: Manual startup**
```bash
# Terminal 1 - Backend
python -m uvicorn api_server:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend  
cd orchid
npm run dev
```

### Access Points
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8000  
- **API Documentation**: http://localhost:8000/docs

## Migration from Streamlit

The Streamlit app (`app.py`) is still functional and can run alongside the new stack:

```bash
streamlit run app.py
```

The Next.js frontend provides:
- ✅ Modern, responsive UI
- ✅ Better performance
- ✅ Real-time interactions
- ✅ Professional design
- ✅ Mobile-friendly interface

## Technical Implementation

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Error Handling
- Comprehensive error handling for API failures
- Graceful fallbacks for missing services
- User-friendly error messages

### State Management
- React state for file uploads and analysis results
- Real-time status updates
- Persistent chat history

### File Processing
- FormData for file uploads
- Streaming responses for large files
- Progress indicators during processing

## Future Enhancements

1. **Authentication**: Add user login and session management
2. **File Management**: Persistent file storage and history
3. **Batch Processing**: Multiple file analysis
4. **Export Options**: Additional report formats
5. **Real-time Notifications**: WebSocket integration
6. **Caching**: Redis for improved performance

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running on port 8000
2. **API Key Issues**: Check NVIDIA_API_KEY in environment
3. **Port Conflicts**: Make sure ports 3000 and 8000 are free
4. **Dependencies**: Run `npm install` in frontend directory

### Debug Mode
```bash
# Backend with debug logging
python -m uvicorn api_server:app --reload --log-level debug

# Frontend with verbose output
cd frontend && npm run dev -- --verbose
```

## Integration Complete ✅

The Next.js frontend is now fully wired to the Python backend with all major features:
- ✅ Document upload and analysis
- ✅ PDF report generation  
- ✅ Q&A assistant with knowledge base
- ✅ Real-time system status
- ✅ Professional UI/UX
- ✅ Error handling and validation