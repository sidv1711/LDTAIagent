"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamically import components that are designed as client components
const AppHeader = dynamic(() => import("@/components/compliance/app-header"))
const DocumentUpload = dynamic(() => import("@/components/compliance/document-upload"))
const KnowledgeBaseStatus = dynamic(() => import("@/components/compliance/knowledge-base-status"))
const QAAssistant = dynamic(() => import("@/components/compliance/qa-assistant"))
const AppFooter = dynamic(() => import("@/components/compliance/app-footer"))

export default function HomePage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files])
    console.log("Files uploaded:", files.map((f) => f.name))
  }

  const handleGenerateReport = () => {
    console.log("Generating report for files:", uploadedFiles.map((f) => f.name))
    // Logic to generate report
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