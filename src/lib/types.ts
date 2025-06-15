// Core Data Types for ClientFlow AI

export type Priority = 'low' | 'medium' | 'high';
export type Sentiment = 'positive' | 'neutral' | 'negative';
export type HealthStatus = 'excellent' | 'good' | 'at-risk' | 'critical';
export type Trend = 'up' | 'down' | 'stable';

// Conversation Management
export interface Conversation {
  id: string;
  clientId: string;
  client: string; // Client name for display
  subject: string;
  preview: string;
  fullContent?: string; // Full email content
  timestamp: string;
  createdAt: Date;
  updatedAt: Date;
  priority: Priority;
  sentiment: Sentiment;
  unread: boolean;
  tags?: string[];
  attachments?: string[];
}

// Client Management
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  contactInfo: {
    phone?: string;
    address?: string;
    website?: string;
  };
  healthScore: {
    score: number; // 0-100
    trend: Trend;
    status: HealthStatus;
    lastActivity: string;
    issues: number;
    lastUpdated: Date;
  };
  contractInfo: {
    startDate?: Date;
    endDate?: Date;
    value?: number;
    renewalDate?: Date;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Email Summary
export interface EmailSummary {
  id: string;
  conversationId: string;
  originalEmail: string;
  tldr: string[];
  actions: ActionItem[];
  sentiment: Sentiment;
  createdAt: Date;
  createdBy?: string; // User who created the summary
}

// Action Items
export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  conversationId?: string;
  clientId?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Response Templates
export interface ResponseTemplate {
  id: string;
  name: string;
  category: string;
  subject?: string;
  content: string;
  variables?: string[]; // Template variables like {{clientName}}
  tags?: string[];
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// User Settings
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    desktop: boolean;
    sound: boolean;
  };
  preferences: {
    defaultPriority: Priority;
    autoSave: boolean;
    compactView: boolean;
  };
  apiKeys: {
    openai?: string;
  };
  updatedAt: Date;
}

// Application State
export interface AppState {
  conversations: Conversation[];
  clients: Client[];
  summaries: EmailSummary[];
  actionItems: ActionItem[];
  responseTemplates: ResponseTemplate[];
  settings: UserSettings;
  ui: {
    sidebarOpen: boolean;
    activeTab: string;
    selectedConversation?: string;
    selectedClient?: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface ConversationForm {
  client: string;
  subject: string;
  content: string;
  priority: Priority;
  tags?: string[];
}

export interface ClientForm {
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
}

export interface ActionItemForm {
  title: string;
  description?: string;
  dueDate?: string; // ISO string for forms
  priority: Priority;
  assignedTo?: string;
}

// Filter & Search Types
export interface ConversationFilters {
  client?: string;
  priority?: Priority;
  sentiment?: Sentiment;
  unread?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface ClientFilters {
  healthStatus?: HealthStatus;
  trend?: Trend;
  riskLevel?: 'low' | 'medium' | 'high';
}

// Analytics Types
export interface DashboardStats {
  totalConversations: number;
  unreadCount: number;
  activeClients: number;
  atRiskClients: number;
  avgHealthScore: number;
  pendingActions: number;
  completedActions: number;
  responseTime: {
    avg: number; // in hours
    trend: Trend;
  };
} 