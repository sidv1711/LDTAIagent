// Global variables
let currentFile = null;
let analysisResults = null;
let chatHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    console.log('AI-Powered LDT Compliance initialized');
    
    // Load any saved data
    loadSavedData();
    
    // Initialize drag and drop
    setupDragAndDrop();
}

function setupEventListeners() {
    // File input change
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    
    // Chat input
    document.getElementById('chatInput').addEventListener('keypress', handleChatKeyPress);
    
    // Modal close on outside click
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
}

// File handling functions
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        handleFile(file);
    }
}

function handleFile(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/json', 'application/xml'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a PDF, DOCX, JSON, XML, or TXT file.', 'error');
        return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB.', 'error');
        return;
    }
    
    currentFile = file;
    displayFileInfo(file);
    showNotification('File uploaded successfully!', 'success');
}

function displayFileInfo(file) {
    // Update upload area to show file info
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <div class="upload-content">
            <i class="fas fa-file-alt upload-icon" style="color: #00ff88;"></i>
            <h3>${file.name}</h3>
            <p>File uploaded successfully</p>
            <button class="btn-secondary" onclick="removeFile()">
                <i class="fas fa-times"></i>
                Remove File
            </button>
        </div>
    `;
    
    // Enable analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze Document';
    analyzeBtn.onclick = analyzeDocument;
}

function removeFile() {
    currentFile = null;
    
    // Reset upload area
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.innerHTML = `
        <div class="upload-content">
            <i class="fas fa-arrow-up upload-icon"></i>
            <h3>Drag & drop files</h3>
            <p>or click to browse</p>
            <button class="btn-primary btn-browse" onclick="document.getElementById('fileInput').click()">
                Browse Files
            </button>
        </div>
    `;
    
    // Reset file input
    document.getElementById('fileInput').value = '';
    
    // Disable analyze button
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Please upload files first';
    analyzeBtn.onclick = null;
    
    // Hide results if they exist
    document.getElementById('resultsSection').style.display = 'none';
}

// Analysis functions
async function analyzeDocument() {
    if (!currentFile) {
        showNotification('Please upload a file first.', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const startTime = Date.now();
        
        // Simulate API call to backend
        const results = await simulateAnalysis(currentFile);
        
        const processingTime = Math.round((Date.now() - startTime) / 1000);
        
        // Display results
        displayResults(results);
        
        showNotification('Analysis completed successfully!', 'success');
        
    } catch (error) {
        console.error('Analysis error:', error);
        showNotification('Analysis failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function simulateAnalysis(file) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock analysis results
    const mockResults = {
        overallScore: Math.floor(Math.random() * 40) + 60, // 60-100%
        missingSections: [
            {
                name: 'Analytical Validity',
                description: 'LoD, LoB, precision, linearity data',
                severity: 'high',
                compliant: false
            },
            {
                name: 'Clinical Validity',
                description: 'clinical study & stats',
                severity: 'high',
                compliant: false
            },
            {
                name: 'Risk Assessment',
                description: 'provide FMEA / hazard analysis',
                severity: 'medium',
                compliant: false
            }
        ],
        recommendations: [
            'Include detailed analytical performance data with LoD and LoB calculations',
            'Add clinical validation study results with sensitivity and specificity metrics',
            'Provide comprehensive risk assessment using FMEA methodology',
            'Ensure quality system documentation references 21 CFR 820 or ISO 13485'
        ],
        compliantSections: [
            {
                name: 'Intended Use',
                description: 'population, analyte, condition',
                compliant: true
            },
            {
                name: 'Quality System',
                description: 'reference 21 CFR 820 or ISO 13485',
                compliant: true
            }
        ]
    };
    
    return mockResults;
}

function displayResults(results) {
    analysisResults = results;
    
    // Update compliance score
    const scoreCircle = document.querySelector('.score-circle');
    const scoreNumber = document.getElementById('overallScore');
    const scoreLabel = document.querySelector('.score-label');
    
    scoreNumber.textContent = results.overallScore + '%';
    scoreLabel.textContent = results.overallScore >= 80 ? 'Compliant' : 'Needs Improvement';
    
    // Update score circle gradient
    const percentage = results.overallScore;
    const color = percentage >= 80 ? '#00ff88' : percentage >= 60 ? '#ffaa00' : '#ff4444';
    scoreCircle.style.background = `conic-gradient(${color} 0deg, ${color} ${percentage * 3.6}deg, #333 ${percentage * 3.6}deg)`;
    
    // Display missing sections
    const missingSectionsContainer = document.getElementById('missingSections');
    missingSectionsContainer.innerHTML = '';
    
    results.missingSections.forEach(section => {
        const sectionElement = createSectionElement(section, false);
        missingSectionsContainer.appendChild(sectionElement);
    });
    
    // Display compliant sections
    results.compliantSections.forEach(section => {
        const sectionElement = createSectionElement(section, true);
        missingSectionsContainer.appendChild(sectionElement);
    });
    
    // Display recommendations
    const recommendationsContainer = document.getElementById('recommendations');
    recommendationsContainer.innerHTML = '';
    
    results.recommendations.forEach(recommendation => {
        const recommendationElement = createRecommendationElement(recommendation);
        recommendationsContainer.appendChild(recommendationElement);
    });
    
    // Show results section
    document.getElementById('resultsSection').style.display = 'block';
    
    // Scroll to results
    document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
}

function createSectionElement(section, compliant) {
    const element = document.createElement('div');
    element.className = `section-item ${compliant ? 'compliant' : ''}`;
    
    const severityIcon = compliant ? 'check-circle' : 
                        section.severity === 'high' ? 'exclamation-triangle' : 'info-circle';
    const severityColor = compliant ? '#00ff88' : 
                         section.severity === 'high' ? '#ff4444' : '#ffaa00';
    
    element.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
            <i class="fas fa-${severityIcon}" style="color: ${severityColor};"></i>
            <h4>${section.name}</h4>
        </div>
        <p>${section.description}</p>
    `;
    
    return element;
}

function createRecommendationElement(recommendation) {
    const element = document.createElement('div');
    element.className = 'recommendation-item';
    element.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.5rem;">
            <i class="fas fa-lightbulb" style="color: #ffaa00; margin-top: 0.2rem;"></i>
            <p>${recommendation}</p>
        </div>
    `;
    
    return element;
}

// Q&A Functions
function askQuestion(question) {
    // Show chat section
    const chatSection = document.getElementById('chatSection');
    chatSection.style.display = 'block';
    
    // Add user question
    addChatMessage(question, 'user');
    
    // Generate response
    setTimeout(() => {
        const response = generateBotResponse(question);
        addChatMessage(response, 'bot');
    }, 1000);
}

function showCustomQuestion() {
    document.getElementById('questionModal').style.display = 'flex';
}

function hideCustomQuestion() {
    document.getElementById('questionModal').style.display = 'none';
}

function submitCustomQuestion() {
    const question = document.getElementById('customQuestion').value.trim();
    if (!question) return;
    
    hideCustomQuestion();
    document.getElementById('customQuestion').value = '';
    
    askQuestion(question);
}

function hideChat() {
    document.getElementById('chatSection').style.display = 'none';
}

// Chat functions
function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    addChatMessage(message, 'user');
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
        const response = generateBotResponse(message);
        addChatMessage(response, 'bot');
    }, 1000);
}

function addChatMessage(content, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'bot' ? 'robot' : 'user';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-${avatar}"></i>
        </div>
        <div class="message-content">
            <p>${content}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Save to history
    chatHistory.push({ content, sender, timestamp: new Date() });
}

function generateBotResponse(message) {
    const responses = {
        'hello': 'Hello! How can I help you with LDT compliance today?',
        'help': 'I can help you with FDA/CLIA compliance requirements, document analysis, and regulatory guidance. What specific questions do you have?',
        'compliance': 'LDT compliance involves meeting FDA and CLIA requirements including analytical validity, clinical validity, quality systems, and proper documentation. Would you like me to explain any specific aspect?',
        'fda': 'FDA requirements for LDTs include analytical and clinical validation, quality system documentation, risk assessment, and proper labeling. The proposed rule from 2023 outlines these requirements in detail.',
        'clia': 'CLIA requirements focus on laboratory quality standards, personnel qualifications, proficiency testing, and quality control procedures. These apply to all laboratory testing, including LDTs.',
        'validation': 'Analytical validation should include LoD, LoB, precision, linearity, and accuracy studies. Clinical validation requires sensitivity, specificity, and clinical utility data.',
        'quality': 'Quality systems should follow 21 CFR 820 or ISO 13485 standards, including document control, change management, and corrective/preventive actions.',
        'elizabeth holmes': 'Elizabeth Holmes was the founder of Theranos, a company that claimed to revolutionize blood testing but was found to have committed massive fraud. This case highlighted the importance of proper validation and compliance in laboratory testing, leading to increased scrutiny of LDTs and the need for robust regulatory oversight.',
        'ldt': 'Laboratory Developed Tests (LDTs) are diagnostic tests that are designed, manufactured, and used within a single laboratory. They are not commercially distributed and are typically developed to meet specific clinical needs that cannot be addressed by commercially available tests.',
        'analytical validation': 'Analytical validation for LDTs should include: Limit of Detection (LoD), Limit of Blank (LoB), precision (repeatability and reproducibility), linearity, accuracy, and specificity. These studies should be performed using appropriate sample matrices and should follow CLSI guidelines.',
        'difference between fda and clia': 'FDA regulates the safety and effectiveness of medical devices, including in vitro diagnostic tests, while CLIA regulates laboratory quality standards and personnel qualifications. FDA focuses on the test itself, while CLIA focuses on the laboratory performing the test. Both regulations apply to LDTs.'
    };
    
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }
    
    return 'I understand you\'re asking about LDT compliance. Could you please be more specific about which aspect you\'d like me to explain? I can help with FDA requirements, CLIA standards, validation studies, quality systems, and more.';
}

// Export functions
function exportResults(format) {
    if (!analysisResults) {
        showNotification('No analysis results to export.', 'warning');
        return;
    }
    
    if (format === 'pdf') {
        exportToPDF();
    } else if (format === 'json') {
        exportToJSON();
    }
}

function exportToPDF() {
    // Simulate PDF export
    showNotification('PDF export feature coming soon!', 'info');
}

function exportToJSON() {
    const data = {
        timestamp: new Date().toISOString(),
        fileName: currentFile?.name,
        results: analysisResults,
        chatHistory: chatHistory
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ldt-analysis-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Results exported to JSON successfully!', 'success');
}

// UI utility functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        background: ${type === 'success' ? '#00ff88' : type === 'error' ? '#ff4444' : type === 'warning' ? '#ffaa00' : '#333'};
        color: ${type === 'success' ? '#000000' : '#ffffff'};
    `;
    
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Data persistence
function loadSavedData() {
    try {
        const saved = localStorage.getItem('ldtCopilotData');
        if (saved) {
            const data = JSON.parse(saved);
            if (data.chatHistory) {
                chatHistory = data.chatHistory;
            }
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function saveData() {
    try {
        const data = {
            chatHistory: chatHistory
        };
        localStorage.setItem('ldtCopilotData', JSON.stringify(data));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Auto-save data periodically
setInterval(saveData, 30000); // Save every 30 seconds

// Export functions for global access
window.handleFileUpload = handleFileUpload;
window.removeFile = removeFile;
window.analyzeDocument = analyzeDocument;
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;
window.exportResults = exportResults;
window.askQuestion = askQuestion;
window.showCustomQuestion = showCustomQuestion;
window.hideCustomQuestion = hideCustomQuestion;
window.submitCustomQuestion = submitCustomQuestion;
window.hideChat = hideChat; 