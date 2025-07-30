"use client"

import React from "react"
import { MessageCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface QAAssistantProps {
  onQuestionClick?: (question: string) => void
}

const questions = [
  "What are my LDT analytical validation requirements?",
  "What quality system documentation is needed?",
  "Who is Elizabeth Holmes and why is LDT compliance important?",
  "What are Laboratory Developed Tests (LDTs)?",
  "How do I demonstrate clinical validity?",
  "What is the FDA and what do they regulate?",
  "What happened with Theranos and LDT oversight?",
  "What's the difference between FDA and CLIA regulations?"
]

export default function QAAssistant({ onQuestionClick }: QAAssistantProps) {
  return (
    <div className="bg-card text-foreground rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-background rounded-lg">
            <MessageCircle className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">
            Regulatory Q&A Assistant
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick?.(question)}
            className={cn(
              "w-full p-4 rounded-lg text-left transition-all duration-200",
              "bg-background hover:bg-background/80 group",
              "border border-border hover:border-primary/20"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-relaxed text-foreground pr-3">
                {question}
              </p>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>

      <button
        className={cn(
          "w-full py-3 px-4 rounded-lg",
          "bg-primary text-primary-foreground font-medium",
          "hover:bg-primary/90 transition-colors duration-200"
        )}
      >
        Ask Question
      </button>
    </div>
  )
}