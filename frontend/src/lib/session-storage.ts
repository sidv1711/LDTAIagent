import { v4 as uuidv4 } from 'uuid';

export interface SessionFile {
  name: string;
  size: number;
  type: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  question: string;
  answer: string;
  timestamp: number;
}

export interface Session {
  id: string;
  title: string;
  uploadDate: string;
  files: SessionFile[];
  analysis: {
    summary: string;
    gaps: string[];
    recommendations: string[];
    risks: string[];
    timestamp: number;
  };
  conversation: Conversation[];
  reportGenerated: boolean;
  reportData?: any;
  lastActivity: number;
}

export class SessionStorage {
  private static readonly STORAGE_KEY = 'ldt_sessions';
  private static readonly MAX_SESSIONS = 50;

  private static ensureLocalStorage(): boolean {
    return typeof window !== 'undefined' && window.localStorage !== null;
  }

  static getAllSessions(): Session[] {
    if (!SessionStorage.ensureLocalStorage()) return [];
    
    try {
      const data = localStorage.getItem(SessionStorage.STORAGE_KEY);
      const sessions = data ? JSON.parse(data) : [];
      return Array.isArray(sessions) ? sessions : [];
    } catch (error) {
      console.error('Failed to load sessions:', error);
      return [];
    }
  }

  static createSession(files: File[], title?: string): Session {
    const session: Session = {
      id: uuidv4(),
      title: title || `Analysis ${new Date().toLocaleDateString()}`,
      uploadDate: new Date().toISOString(),
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        timestamp: Date.now()
      })),
      analysis: {
        summary: '',
        gaps: [],
        recommendations: [],
        risks: [],
        timestamp: Date.now()
      },
      conversation: [],
      reportGenerated: false,
      lastActivity: Date.now()
    };

    const sessions = SessionStorage.getAllSessions();
    sessions.unshift(session);
    
    // Keep only the latest MAX_SESSIONS
    const limitedSessions = sessions.slice(0, SessionStorage.MAX_SESSIONS);
    
    try {
      localStorage.setItem(SessionStorage.STORAGE_KEY, JSON.stringify(limitedSessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }

    return session;
  }

  static updateSession(id: string, updates: Partial<Session>): boolean {
    const sessions = SessionStorage.getAllSessions();
    const index = sessions.findIndex(s => s.id === id);
    
    if (index === -1) return false;
    
    sessions[index] = {
      ...sessions[index],
      ...updates,
      lastActivity: Date.now()
    };

    try {
      localStorage.setItem(SessionStorage.STORAGE_KEY, JSON.stringify(sessions));
      return true;
    } catch (error) {
      console.error('Failed to update session:', error);
      return false;
    }
  }

  static deleteSession(id: string): boolean {
    const sessions = SessionStorage.getAllSessions();
    const filtered = sessions.filter(s => s.id !== id);
    
    try {
      localStorage.setItem(SessionStorage.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete session:', error);
      return false;
    }
  }

  static getSession(id: string): Session | null {
    const sessions = SessionStorage.getAllSessions();
    return sessions.find(s => s.id === id) || null;
  }

  static addConversation(sessionId: string, question: string, answer: string): boolean {
    const session = SessionStorage.getSession(sessionId);
    if (!session) return false;

    const conversation: Conversation = {
      id: uuidv4(),
      question,
      answer,
      timestamp: Date.now()
    };

    const updatedSession = {
      ...session,
      conversation: [...session.conversation, conversation],
      lastActivity: Date.now()
    };

    return SessionStorage.updateSession(sessionId, updatedSession);
  }

  static updateAnalysis(sessionId: string, analysis: Session['analysis']): boolean {
    const session = SessionStorage.getSession(sessionId);
    if (!session) return false;

    return SessionStorage.updateSession(sessionId, { analysis });
  }

  static generateReport(sessionId: string, reportData: any): boolean {
    const session = SessionStorage.getSession(sessionId);
    if (!session) return false;

    return SessionStorage.updateSession(sessionId, {
      reportGenerated: true,
      reportData,
      analysis: {
        ...session.analysis,
        timestamp: Date.now()
      }
    });
  }

  static searchSessions(query: string): Session[] {
    const sessions = SessionStorage.getAllSessions();
    const lowerQuery = query.toLowerCase();
    
    return sessions.filter(session =>
      session.title.toLowerCase().includes(lowerQuery) ||
      session.files.some(file => file.name.toLowerCase().includes(lowerQuery)) ||
      session.analysis.summary.toLowerCase().includes(lowerQuery)
    );
  }

  static exportSessions(): string {
    const sessions = SessionStorage.getAllSessions();
    return JSON.stringify(sessions, null, 2);
  }

  static importSessions(data: string): boolean {
    try {
      const sessions = JSON.parse(data);
      if (Array.isArray(sessions)) {
        localStorage.setItem(SessionStorage.STORAGE_KEY, JSON.stringify(sessions));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import sessions:', error);
      return false;
    }
  }

  static clearAllSessions(): void {
    if (SessionStorage.ensureLocalStorage()) {
      localStorage.removeItem(SessionStorage.STORAGE_KEY);
    }
  }
}

export default SessionStorage;