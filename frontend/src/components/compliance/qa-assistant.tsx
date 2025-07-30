"use client"

import React, { useState, useEffect } from "react"
import { MessageCircle, ChevronRight, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QAAssistantProps {
  onQuestionClick?: (question: string) => void
}

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
  sources?: string[]
}

export default function QAAssistant({ onQuestionClick }: QAAssistantProps) {
  const [questions, setQuestions] = useState<string[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Load sample questions from backend
  useEffect(() => {
    const loadSampleQuestions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/sample-questions')
        const data = await response.json()
        setQuestions(data.questions)
      } catch (error) {
        console.error("Error loading sample questions:", error)
        // Fallback questions
        setQuestions([
          "What are my LDT analytical validation requirements?",
          "What quality system documentation is needed?",
          "Who is Elizabeth Holmes and why is LDT compliance important?",
          "What are Laboratory Developed Tests (LDTs)?",
          "How do I demonstrate clinical validity?",
          "What is the FDA and what do they regulate?",
          "What happened with Theranos and LDT oversight?",
          "What's the difference between FDA and CLIA regulations?"
        ])
      }
    }

    loadSampleQuestions()
  }, [])

  const handleQuestionClick = async (question: string) => {
    onQuestionClick?.(question)
    await askQuestion(question)
  }

  const askQuestion = async (question: string) => {
    if (!question.trim()) return

    const userMessage: ChatMessage = {
      type: 'user',
      content: question
    }

    setChatMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      })

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      const assistantMessage: ChatMessage = {
        type: 'assistant',
        content: data.answer,
        sources: data.sources
      }

      setChatMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error asking question:", error)
      
      const errorMessage: ChatMessage = {
        type: 'assistant',
        content: `I apologize, but I'm having trouble connecting to the knowledge base. Error: ${error.message}. Please check that the backend server is running and try again.`
      }
      
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const question = inputValue.trim()
    setInputValue("")
    await askQuestion(question)
  }

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-700/50 rounded-lg">
            <MessageCircle className="h-5 w-5 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Regulatory Q&A Assistant
          </h2>
        </div>
      </div>

      {/* Sample Questions */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-300">Quick Questions:</p>
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => handleQuestionClick(question)}
            disabled={isLoading}
            className={cn(
              "w-full p-4 rounded-lg text-left transition-all duration-200",
              "bg-slate-700/40 hover:bg-slate-700/60 group",
              "border border-slate-600/50 hover:border-cyan-400/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-relaxed text-slate-200 pr-3">
                {question}
              </p>
              <ChevronRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      {chatMessages.length > 0 && (
        <div className="max-h-96 overflow-y-auto space-y-4 bg-slate-900/50 rounded-lg p-4">
          {chatMessages.map((message, index) => (
            <div key={index} className={cn("flex", message.type === 'user' ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] rounded-lg p-3 space-y-2",
                message.type === 'user' 
                  ? "bg-cyan-500 text-white" 
                  : "bg-slate-700/60 text-slate-200"
              )}>
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && <Bot className="w-4 h-4 mt-0.5 text-cyan-400" />}
                  <div className="text-sm leading-relaxed">{message.content}</div>
                  {message.type === 'user' && <User className="w-4 h-4 mt-0.5" />}
                </div>
                
                {message.sources && message.sources.length > 0 && (
                  <div className="border-t border-slate-600/50 pt-2 mt-2">
                    <p className="text-xs text-slate-400 font-medium mb-1">Sources:</p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {message.sources.map((source, idx) => (
                        <li key={idx}>• {source}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/60 rounded-lg p-3 text-slate-200">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about FDA or CLIA requirements..."
          disabled={isLoading}
          className={cn(
            "flex-1 px-4 py-3 rounded-lg",
            "bg-slate-700/40 border border-slate-600/50",
            "text-white placeholder-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        />
        <Button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={cn(
            "px-6 py-3 rounded-lg font-medium transition-all duration-200",
            "bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600",
            "text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  )
}