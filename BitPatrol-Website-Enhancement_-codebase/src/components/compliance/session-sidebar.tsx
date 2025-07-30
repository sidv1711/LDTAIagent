"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Trash2, Clock, FileText, Bot, X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "/lib/utils";
import SessionStorage, { Session } from "/lib/session-storage";

interface SessionSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSessionId: string | null;
  onSessionSelect: (session: Session) => void;
  onNewSession: () => void;
}

export default function SessionSidebar({
  isOpen,
  onToggle,
  activeSessionId,
  onSessionSelect,
  onNewSession,
}: SessionSidebarProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Session[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = SessionStorage.getAllSessions();
    setSessions(allSessions);
    setSearchResults(allSessions);
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = SessionStorage.searchSessions(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults(sessions);
    }
  }, [searchQuery, sessions]);

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this session? This cannot be undone.")) {
      SessionStorage.deleteSession(sessionId);
      loadSessions();
      
      if (activeSessionId === sessionId) {
        onNewSession();
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return "Today" + date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: days > 365 ? 'numeric' : undefined
      });
    }
  };

  const getSessionStatus = (session: Session) => {
    if (session.reportGenerated) {
      return { label: "Analysis Complete", color: "text-emerald-400", bgColor: "bg-emerald-400/10" };
    } else if (session.files.length > 0) {
      return { label: "Files Uploaded", color: "text-blue-400", bgColor: "bg-blue-400/10" };
    } else {
      return { label: "Empty", color: "text-slate-400", bgColor: "bg-slate-400/10" };
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={onToggle}
        className={cn(
          "fixed top-20 z-50 bg-slate-800 border border-slate-600 rounded-r-lg p-2 hover:bg-slate-700 transition-colors",
          "transition-all duration-300",
          isOpen ? "left-[280px]" : "left-0"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <ChevronsLeft className="w-4 h-4" /> : <ChevronsRight className="w-4 h-4" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-[280px] bg-slate-900 border-r border-slate-700 z-40"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h2 className="text-sm font-semibold text-white">LDT Sessions</h2>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* New Session Button */}
            <div className="p-4 border-b border-slate-700">
              <button
                onClick={onNewSession}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                New Session
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Sessions List */}
            <div className="flex-1 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bot className="w-12 h-12 text-slate-400 mb-4" />
                  <p className="text-sm text-slate-400 mb-2">No sessions found</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSearchResults(sessions);
                    }}
                    className="text-sm text-cyan-400 hover:text-cyan-300"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="space-y-px">
                  {searchResults.map((session) => {
                    const status = getSessionStatus(session);
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "p-3 border-l-2 border-slate-700 hover:bg-slate-800 cursor-pointer relative group",
                          activeSessionId === session.id && "border-cyan-500 bg-slate-800"
                        )}
                        onClick={() => onSessionSelect(session)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white truncate">
                              {session.title}
                            </h3>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(session.uploadDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className={cn(
                                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
                                status.bgColor,
                                status.color
                              )}>
                                <span>{status.label}</span>
                              </div>
                              <span className="text-xs text-slate-400">
                                {session.files.length} {session.files.length === 1 ? 'file' : 'files'}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                          <FileText className="w-3 h-3" />
                          <span className="truncate">
                            {session.files.map(f => f.name).join(", ")}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="p-3 border-t border-slate-700 text-xs text-slate-400">
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
              {searchQuery && ` (${searchResults.length} matching)`}
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}