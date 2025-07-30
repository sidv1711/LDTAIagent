"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { toast } from "@/components/ui/use-toast";

// Type definitions
export interface LDTAnalysis {
  id: string;
  title: string;
  content: string;
  findings: Array<{
    id: string;
    type: "risk" | "opportunity" | "compliance";
    severity: "low" | "medium" | "high" | "critical";
    description: string;
    recommendation: string;
  }>;
  timestamp: string;
}

export interface Conversation {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Session {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  analysis: LDTAnalysis[];
  conversations: Conversation[];
  documents: Array<{
    id: string;
    name: string;
    content: string;
    uploadTime: string;
  }>;
  metadata: {
    context: string;
    industry: string;
    region: string;
    framework: string;
    autoSaveEnabled: boolean;
  };
}

interface SessionState {
  sessions: Session[];
  currentSession: Session | null;
  isLoading: boolean;
  error: string | null;
  isAutosaving: boolean;
  lastSaved: string | null;
}

type SessionAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SESSIONS"; payload: Session[] }
  | { type: "SET_CURRENT_SESSION"; payload: Session | null }
  | { type: "CREATE_SESSION"; payload: Session }
  | { type: "UPDATE_SESSION"; payload: Session }
  | { type: "DELETE_SESSION"; payload: string }
  | { type: "SET_AUTO_SAVING"; payload: boolean }
  | { type: "SET_LAST_SAVED" }
  | { type: "UPDATE_ANALYSIS"; payload: LDTAnalysis[] }
  | { type: "ADD_ANALYSIS"; payload: LDTAnalysis }
  | { type: "UPDATE_CONVERSATIONS"; payload: Conversation[] }
  | { type: "ADD_CONVERSATION"; payload: Conversation }
  | { type: "ADD_DOCUMENT"; payload: Session["documents"][0] }
  | { type: "UPDATE_METADATA"; payload: Partial<Session["metadata"]> };

interface SessionContextType extends SessionState {
  createSession: (name: string, metadata?: Partial<Session["metadata"]>) => Session;
  switchSession: (id: string) => void;
  updateSessionName: (id: string, name: string) => void;
  deleteSession: (id: string) => void;
  updateAnalysis: (analysis: LDTAnalysis[]) => void;
  addAnalysis: (analysis: LDTAnalysis) => void;
  updateConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  addDocument: (document: Session["documents"][0]) => void;
  updateMetadata: (metadata: Partial<Session["metadata"]>) => void;
  forceSave: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const initialState: SessionState = {
  sessions: [],
  currentSession: null,
  isLoading: true,
  error: null,
  isAutosaving: false,
  lastSaved: null,
};

function generateId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function reducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SESSIONS":
      return { ...state, sessions: action.payload };
    case "SET_CURRENT_SESSION":
      return { ...state, currentSession: action.payload };
    case "CREATE_SESSION": {
      const sessions = [...state.sessions, action.payload];
      return { ...state, sessions, currentSession: action.payload };
    }
    case "UPDATE_SESSION": {
      const sessions = state.sessions.map((s) =>
        s.id === action.payload.id ? action.payload : s
      );
      const currentSession =
        state.currentSession?.id === action.payload.id
          ? action.payload
          : state.currentSession;
      return { ...state, sessions, currentSession };
    }
    case "DELETE_SESSION": {
      const sessions = state.sessions.filter((s) => s.id !== action.payload);
      const currentSession =
        state.currentSession?.id === action.payload
          ? null
          : state.currentSession;
      return { ...state, sessions, currentSession };
    }
    case "SET_AUTO_SAVING":
      return { ...state, isAutosaving: action.payload };
    case "SET_LAST_SAVED":
      return { ...state, lastSaved: new Date().toISOString(), isAutosaving: false };
    case "UPDATE_ANALYSIS":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          analysis: action.payload,
          updatedAt: new Date().toISOString(),
        },
      };
    case "ADD_ANALYSIS":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          analysis: [...state.currentSession.analysis, action.payload],
          updatedAt: new Date().toISOString(),
        },
      };
    case "UPDATE_CONVERSATIONS":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          conversations: action.payload,
          updatedAt: new Date().toISOString(),
        },
      };
    case "ADD_CONVERSATION":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          conversations: [...state.currentSession.conversations, action.payload],
          updatedAt: new Date().toISOString(),
        },
      };
    case "ADD_DOCUMENT":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          documents: [...state.currentSession.documents, action.payload],
          updatedAt: new Date().toISOString(),
        },
      };
    case "UPDATE_METADATA":
      if (!state.currentSession) return state;
      return {
        ...state,
        currentSession: {
          ...state.currentSession,
          metadata: { ...state.currentSession.metadata, ...action.payload },
          updatedAt: new Date().toISOString(),
        },
      };
    default:
      return state;
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const loadSessions = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const stored = localStorage.getItem("ldt-sessions");
        const sessions = stored ? JSON.parse(stored) : [];
        dispatch({ type: "SET_SESSIONS", payload: sessions });

        // Set last active session
        const lastActive = localStorage.getItem("ldt-last-session");
        if (lastActive && sessions.find((s: Session) => s.id === lastActive)) {
          const session = sessions.find((s: Session) => s.id === lastActive);
          dispatch({ type: "SET_CURRENT_SESSION", payload: session });
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load sessions" });
        toast({
          title: "Error",
          description: "Failed to load sessions from storage",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    loadSessions();
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem("ldt-sessions", JSON.stringify(state.sessions));
      localStorage.setItem("ldt-last-session", state.currentSession?.id || "");
    }
  }, [state.sessions, state.currentSession, state.isLoading]);

  // Auto-save current session
  useEffect(() => {
    if (!state.currentSession || !state.currentSession.metadata.autoSaveEnabled) {
      return;
    }

    const timeoutId = setTimeout(async () => {
      dispatch({ type: "SET_AUTO_SAVING", payload: true });
      try {
        // Update the session in sessions array
        const updatedSessions = state.sessions.map((s) =>
          s.id === state.currentSession!.id ? state.currentSession! : s
        );
        dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
        dispatch({ type: "SET_LAST_SAVED" });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to auto-save session" });
      } finally {
        dispatch({ type: "SET_AUTO_SAVING", payload: false });
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [state.currentSession, state.sessions]);

  const createSession = useCallback(
    (name: string, metadata: Partial<Session["metadata"]> = {}) => {
      const newSession: Session = {
        id: generateId(),
        name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: [],
        conversations: [],
        documents: [],
        metadata: {
          context: "",
          industry: "",
          region: "",
          framework: "",
          autoSaveEnabled: true,
          ...metadata,
        },
      };
      dispatch({ type: "CREATE_SESSION", payload: newSession });
      return newSession;
    },
    []
  );

  const switchSession = useCallback((id: string) => {
    const session = state.sessions.find((s) => s.id === id);
    if (session) {
      dispatch({ type: "SET_CURRENT_SESSION", payload: session });
    }
  }, [state.sessions]);

  const updateSessionName = useCallback((id: string, name: string) => {
    const session = state.sessions.find((s) => s.id === id);
    if (session) {
      const updatedSession = { ...session, name, updatedAt: new Date().toISOString() };
      dispatch({ type: "UPDATE_SESSION", payload: updatedSession });
    }
  }, [state.sessions]);

  const deleteSession = useCallback((id: string) => {
    dispatch({ type: "DELETE_SESSION", payload: id });
    toast({
      title: "Session deleted",
      description: "The session has been permanently removed",
    });
  }, []);

  const updateAnalysis = useCallback((analysis: LDTAnalysis[]) => {
    if (state.currentSession) {
      dispatch({ type: "UPDATE_ANALYSIS", payload: analysis });
    }
  }, [state.currentSession]);

  const addAnalysis = useCallback((analysis: LDTAnalysis) => {
    if (state.currentSession) {
      dispatch({ type: "ADD_ANALYSIS", payload: analysis });
    }
  }, [state.currentSession]);

  const updateConversations = useCallback((conversations: Conversation[]) => {
    if (state.currentSession) {
      dispatch({ type: "UPDATE_CONVERSATIONS", payload: conversations });
    }
  }, [state.currentSession]);

  const addConversation = useCallback((conversation: Conversation) => {
    if (state.currentSession) {
      dispatch({ type: "ADD_CONVERSATION", payload: conversation });
    }
  }, [state.currentSession]);

  const addDocument = useCallback((document: Session["documents"][0]) => {
    if (state.currentSession) {
      dispatch({ type: "ADD_DOCUMENT", payload: document });
    }
  }, [state.currentSession]);

  const updateMetadata = useCallback(
    (metadata: Partial<Session["metadata"]>) => {
      dispatch({ type: "UPDATE_METADATA", payload: metadata });
    },
    []
  );

  const forceSave = useCallback(async () => {
    if (!state.currentSession) return;

    dispatch({ type: "SET_AUTO_SAVING", payload: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const updatedSessions = state.sessions.map((s) =>
        s.id === state.currentSession!.id ? state.currentSession! : s
      );
      dispatch({ type: "SET_SESSIONS", payload: updatedSessions });
      dispatch({ type: "SET_LAST_SAVED" });
      
      toast({
        title: "Session saved",
        description: "Your changes have been saved successfully",
      });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to save session" });
    } finally {
      dispatch({ type: "SET_AUTO_SAVING", payload: false });
    }
  }, [state.currentSession, state.sessions]);

  return (
    <SessionContext.Provider
      value={{
        ...state,
        createSession,
        switchSession,
        updateSessionName,
        deleteSession,
        updateAnalysis,
        addAnalysis,
        updateConversations,
        addConversation,
        addDocument,
        updateMetadata,
        forceSave,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}