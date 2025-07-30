"use client"

import { useState, useEffect } from "react"

interface KnowledgeItem {
  name: string
  status: string
}

interface SystemStatus {
  nvidia_api_connected: boolean
  knowledge_base_ready: boolean
  fda_guidance_updated: boolean
  clia_regulations_current: boolean
}

export default function KnowledgeBaseStatus() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    // Set initial time only on client side
    setCurrentTime(new Date().toLocaleTimeString())
    
    const loadStatus = async () => {
      try {
        // Load knowledge base items
        const kbResponse = await fetch('http://localhost:8000/api/knowledge-base-status')
        const kbData = await kbResponse.json()
        setKnowledgeItems(kbData.items)

        // Load system status
        const statusResponse = await fetch('http://localhost:8000/api/status')
        const statusData = await statusResponse.json()
        setSystemStatus(statusData)
        
        // Update time when status loads
        setCurrentTime(new Date().toLocaleTimeString())
        
      } catch (error) {
        console.error("Error loading status:", error)
        // Fallback data
        setKnowledgeItems([
          { name: "FDA LDT Guidance", status: "CURRENT" },
          { name: "CLIA Regulations", status: "CURRENT" },
          { name: "ISO 13485", status: "CURRENT" }
        ])
        setSystemStatus({
          nvidia_api_connected: false,
          knowledge_base_ready: false,
          fda_guidance_updated: true,
          clia_regulations_current: true
        })
        
        // Update time even for fallback
        setCurrentTime(new Date().toLocaleTimeString())
      }
    }

    loadStatus()
    
    // Refresh status every 30 seconds
    const interval = setInterval(loadStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 bg-cyan-400 rounded-full" />
        <h3 className="text-white font-medium text-lg">
          System Status
        </h3>
      </div>
      
      {/* System Status */}
      {systemStatus && (
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-200 text-sm font-normal">
              NVIDIA API
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              systemStatus.nvidia_api_connected 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {systemStatus.nvidia_api_connected ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-200 text-sm font-normal">
              Knowledge Base
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              systemStatus.knowledge_base_ready 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'bg-orange-500/20 text-orange-400'
            }`}>
              {systemStatus.knowledge_base_ready ? 'READY' : 'LOADING'}
            </span>
          </div>
        </div>
      )}
      
      {/* Knowledge Base Items */}
      <div className="border-t border-slate-700/50 pt-4">
        <h4 className="text-slate-300 text-sm font-medium mb-3">Knowledge Base</h4>
        <div className="space-y-3">
          {knowledgeItems.map((item) => (
            <div 
              key={item.name}
              className="flex items-center justify-between py-2"
            >
              <span className="text-slate-200 text-sm font-normal">
                {item.name}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-1 rounded">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="text-xs text-slate-400 text-center">
          Last updated: {currentTime || "Loading..."}
        </div>
      </div>
    </div>
  )
}