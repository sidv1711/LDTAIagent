"use client"

import { useState } from "react"
import { Upload, FileText, CheckCircle, TrendingUp, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ComplianceAnalysis {
  filename: string
  score: number
  missing_sections: Record<string, string>
  present_sections: string[]
  executive_summary: string
  ai_analysis: string
  report_markdown: string
}

interface DocumentUploadProps {
  onFileUpload?: (files: File[]) => void
  onGenerateReport?: (analysis: ComplianceAnalysis) => void
  acceptedFormats?: string[]
  maxFileSize?: number
}

export default function DocumentUpload({
  onFileUpload,
  onGenerateReport,
  acceptedFormats = [".pdf", ".docx", ".json", ".xml", ".txt"],
  maxFileSize = 10 * 1024 * 1024, // 10MB
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<ComplianceAnalysis | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const validFiles = files.filter(file => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
      const isValidFormat = acceptedFormats.some(format => format.toLowerCase() === extension)
      const isValidSize = file.size <= maxFileSize
      return isValidFormat && isValidSize
    })

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles])
      onFileUpload?.(validFiles)
      
      // Simulate processing
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 2000)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    const validFiles = files.filter(file => {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`
      const isValidFormat = acceptedFormats.some(format => format.toLowerCase() === extension)
      const isValidSize = file.size <= maxFileSize
      return isValidFormat && isValidSize
    })

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles])
      onFileUpload?.(validFiles)
      
      // Simulate processing
      setIsProcessing(true)
      setTimeout(() => setIsProcessing(false), 2000)
    }
  }

  const handleGenerateReport = async () => {
    if (uploadedFiles.length === 0) return;
    
    console.log("Generating report for files:", uploadedFiles.map((f) => f.name))
    
    const file = uploadedFiles[0]; // Process first file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setIsProcessing(true);
      
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }
      
      const analysis: ComplianceAnalysis = await response.json();
      console.log("Analysis complete:", analysis);
      
      // Store the result and call the callback
      setAnalysisResult(analysis);
      onGenerateReport?.(analysis);
      
    } catch (error) {
      console.error("Error generating report:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  const downloadPDF = async (analysis: ComplianceAnalysis) => {
    try {
      const response = await fetch('http://localhost:8000/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysis),
      });
      
      if (!response.ok) {
        throw new Error('PDF generation failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LDT_Compliance_Report_${analysis.filename.split('.')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(`Error downloading PDF: ${error.message}`);
    }
  }

  const Analytics = () => (
    <div className="grid grid-cols-3 gap-4">
      {[
        { icon: TrendingUp, label: "Accuracy", value: "99.7%", color: "text-green-400" },
        { icon: Clock, label: "Speed", value: "< 60s", color: "text-blue-400" },
        { icon: CheckCircle, label: "Validation", value: "FDA/CLIA", color: "text-purple-400" },
      ].map((item, index) => (
        <div key={index} className="text-center">
          <item.icon className={`w-5 h-5 ${item.color} mx-auto mb-1`} />
          <p className="text-xs text-slate-400">{item.label}</p>
          <p className="text-sm font-semibold text-white">{item.value}</p>
        </div>
      ))}
    </div>
  )

  return (
    <div className="w-full">
      <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 hover:border-slate-600/50 transition-all duration-300">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full blur-2xl" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Upload LDT Submission
            </h2>
            
            <p className="text-slate-300 max-w-md mx-auto leading-relaxed">
              Get instant FDA compliance analysis with AI-powered gap identification and remediation guidance
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-12 transition-all duration-300",
              isDragging
                ? "border-cyan-400 bg-cyan-400/5 scale-[1.02]"
                : "border-slate-600 hover:border-cyan-500/50",
              "hover:bg-slate-800/20"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <Upload className="w-12 h-12 text-cyan-400 animate-pulse" />
              
              <div className="text-center space-y-2">
                <p className="text-white font-medium text-lg">Drag & drop files</p>
                <p className="text-slate-400">or click to browse</p>
              </div>
              
              <input
                type="file"
                multiple
                accept={acceptedFormats.join(",")}
                onChange={handleFileInput}
                className="hidden"
                id="file-input"
              />
              
              <Button
                onClick={() => document.getElementById("file-input")?.click()}
                disabled={isProcessing}
                className={cn(
                  "min-w-[180px] rounded-lg font-medium transition-all duration-200",
                  "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600",
                  "text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                )}
              >
                {isProcessing ? "Processing..." : "Browse Files"}
              </Button>
              
              <p className="text-xs text-slate-400 text-center">
                {acceptedFormats.join(", ")} • Max {(maxFileSize / 1024 / 1024).toFixed(0)}MB
              </p>
            </div>
          </div>

          {/* Features */}
          <Analytics />

          {/* Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-slate-300 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Uploaded Files ({uploadedFiles.length})
              </h3>
              
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-slate-700/40 rounded-lg border border-slate-600/50"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span className="text-sm text-slate-200">{file.name}</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate Report Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={uploadedFiles.length === 0 || isProcessing}
            className={cn(
              "w-full h-12 rounded-lg font-semibold text-lg transition-all duration-300",
              uploadedFiles.length > 0 ?
                "bg-gradient-to-r from-cyan-500 via-emerald-500 to-purple-500 hover:via-cyan-600 hover:to-emerald-600 \
                 text-white shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transform"
                : "bg-slate-700/50 text-slate-400 cursor-not-allowed"
            )}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <TrendingUp className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </span>
            ) : (
              uploadedFiles.length > 0 ? 
                "Generate Compliance Report" : 
                "Please upload files first"
            )}
          </Button>

          {uploadedFiles.length > 0 && !analysisResult && (
            <p className="text-xs text-center text-slate-400 mt-4">
              Advanced AI analysis powered by NVIDIA Nemotron and regulatory expertise
            </p>
          )}
          
          {/* Analysis Results Preview */}
          {analysisResult && (
            <div className="mt-8 p-6 bg-slate-700/40 rounded-xl border border-slate-600/50">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                Analysis Complete
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{analysisResult.score.toFixed(0)}%</div>
                  <p className="text-xs text-slate-400">Compliance Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{Object.keys(analysisResult.missing_sections).length}</div>
                  <p className="text-xs text-slate-400">Missing Sections</p>
                </div>
              </div>
              
              <Button
                onClick={() => downloadPDF(analysisResult)}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}