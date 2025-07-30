"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import AppHeader from "@/components/compliance/app-header"
import DocumentUpload from "@/components/compliance/document-upload"
import KnowledgeBaseStatus from "@/components/compliance/knowledge-base-status"
import QAAssistant from "@/components/compliance/qa-assistant"
import AppFooter from "@/components/compliance/app-footer"

interface ComplianceAnalysis {
  filename: string
  score: number
  missing_sections: Record<string, string>
  present_sections: string[]
  executive_summary: string
  ai_analysis: string
  report_markdown: string
}

export default function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [analysisResult, setAnalysisResult] = useState<ComplianceAnalysis | null>(null)
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false)
  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
    console.log("Files uploaded:", files.map((f) => f.name))
  }

  const handleGenerateReport = (analysis: ComplianceAnalysis) => {
    console.log("Report generated:", analysis)
    setAnalysisResult(analysis)
  }

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question)
    console.log("Question clicked:", question)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <AppHeader />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-8 md:py-16 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            AI-Powered
            <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}LDT Compliance
            </span>
            <br />
            in Minutes, Not Months
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Upload your LDT submission and get instant FDA & CLIA compliance analysis with AI-powered gap identification and remediation guidance
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content - Left */}
          <div className="lg:col-span-2 space-y-8">
            <DocumentUpload 
              onFileUpload={handleFileUpload} 
              onGenerateReport={handleGenerateReport} 
            />

            {/* Analysis Results Display */}
            {analysisResult && (
              <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Compliance Analysis Results</h2>
                
                {/* Score Display */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-400 mb-2">{analysisResult.score.toFixed(0)}%</div>
                    <p className="text-slate-300">Overall Score</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-400 mb-2">{Object.keys(analysisResult.missing_sections).length}</div>
                    <p className="text-slate-300">Missing Sections</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">{analysisResult.present_sections.length}</div>
                    <p className="text-slate-300">Present Sections</p>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Executive Summary</h3>
                  <div className="bg-slate-700/40 rounded-lg p-4">
                    <pre className="text-slate-200 text-sm whitespace-pre-wrap font-sans">
                      {analysisResult.executive_summary}
                    </pre>
                  </div>
                </div>

                {/* Missing Sections */}
                {Object.keys(analysisResult.missing_sections).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Missing Sections</h3>
                    <div className="space-y-3">
                      {Object.entries(analysisResult.missing_sections).map(([section, description], index) => (
                        <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <h4 className="font-semibold text-red-400 mb-2">{section}</h4>
                          <p className="text-slate-300 text-sm">{description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Present Sections */}
                {analysisResult.present_sections.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">Present Sections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {analysisResult.present_sections.map((section, index) => (
                        <div key={index} className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                          <p className="text-emerald-400 font-medium text-sm">✓ {section}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* LLM Reasoning - Collapsible */}
                <div>
                  <button
                    onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                    className="flex items-center justify-between w-full text-left p-4 bg-slate-700/20 hover:bg-slate-700/40 rounded-lg border border-slate-600/50 transition-all duration-200 mb-3"
                  >
                    <h3 className="text-xl font-semibold text-white">LLM Reasoning</h3>
                    {showDetailedAnalysis ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>
                  
                  {showDetailedAnalysis && (
                    <div className="bg-slate-700/40 rounded-lg p-4 max-h-96 overflow-y-auto border border-slate-600/30">
                      <pre className="text-slate-200 text-sm whitespace-pre-wrap font-sans">
                        {analysisResult.ai_analysis}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right */}
          <div className="space-y-8">
            <KnowledgeBaseStatus />
            <QAAssistant onQuestionClick={handleQuestionClick} />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 md:mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">{"<"} 60s</div>
              <p className="text-slate-300 text-sm">Gap Analysis Time</p>
            </div>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">500+</div>
              <p className="text-slate-300 text-sm">LDTs Analyzed</p>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  )
}