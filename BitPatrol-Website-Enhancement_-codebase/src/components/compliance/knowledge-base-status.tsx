"use client"

export default function KnowledgeBaseStatus() {
  const knowledgeItems = [
    { name: "FDA LDT Guidance", status: "CURRENT" },
    { name: "CUA Regulations", status: "CURRENT" },
    { name: "ISO 13485", status: "CURRENT" }
  ]

  return (
    <div className="bg-[#1e293b] rounded-lg shadow-lg border border-[#334155] p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 bg-pink-500 rounded-full" />
        <h3 className="text-white font-medium text-sm">
          Knowledge Base Status
        </h3>
      </div>
      
      <div className="space-y-3">
        {knowledgeItems.map((item) => (
          <div 
            key={item.name}
            className="flex items-center justify-between py-2"
          >
            <span className="text-white text-sm font-normal">
              {item.name}
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-medium px-2 py-1 rounded">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}