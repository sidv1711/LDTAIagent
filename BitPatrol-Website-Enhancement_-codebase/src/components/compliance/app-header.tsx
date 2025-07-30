"use client"

import { Shield, Check } from "lucide-react"

export default function AppHeader() {
  const badges = [
    { label: "FDA Guidance Updated", icon: Check, color: "text-green-400" },
    { label: "SOC2 Certified", icon: Check, color: "text-blue-400" },
  ]

  return (
    <header className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full blur-md opacity-20" />
              <div className="relative w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Compliance Copilot
              </h1>
              <p className="text-sm text-slate-400 hidden lg:block">
                AI-powered LDT compliance analysis
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex flex-wrap items-center gap-3">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50"
              >
                <badge.icon className={`h-3.5 w-3.5 ${badge.color}`} />
                <span className="text-xs font-medium text-white">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}