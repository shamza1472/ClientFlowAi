import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Conversation, 
  Client, 
  EmailSummary, 
  ActionItem, 
  ResponseTemplate, 
  UserSettings, 
  ConversationFilters,
  ClientFilters,
  DashboardStats
} from './types';
import { storage } from './storage';

// Define the store state interface
interface AppStore {
  // Data
  conversations: Conversation[];
  clients: Client[];
  summaries: EmailSummary[];
  actionItems: ActionItem[];
  responseTemplates: ResponseTemplate[];
  settings: UserSettings;
  
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  selectedConversation: string | null;
  selectedClient: string | null;
  
  // Filters
  conversationFilters: ConversationFilters;
  clientFilters: ClientFilters;
  
  // Loading states
  loading: {
    conversations: boolean;
    clients: boolean;
    actionItems: boolean;
  };
  
  // Actions - Conversations
  loadConversations: () => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  markConversationRead: (id: string) => void;
  markConversationUnread: (id: string) => void;
  
  // Actions - Clients
  loadClients: () => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  updateClientHealth: (id: string, healthUpdates: Partial<Client['healthScore']>) => void;
  
  // Actions - Action Items
  loadActionItems: () => void;
  addActionItem: (item: ActionItem) => void;
  updateActionItem: (id: string, updates: Partial<ActionItem>) => void;
  deleteActionItem: (id: string) => void;
  completeActionItem: (id: string) => void;
  
  // Actions - Summaries
  addSummary: (summary: EmailSummary) => void;
  getSummaryByConversation: (conversationId: string) => EmailSummary | null;
  
  // Actions - Templates
  loadResponseTemplates: () => void;
  addResponseTemplate: (template: ResponseTemplate) => void;
  updateResponseTemplate: (id: string, updates: Partial<ResponseTemplate>) => void;
  deleteResponseTemplate: (id: string) => void;
  incrementTemplateUsage: (id: string) => void;
  
  // Actions - Settings
  loadSettings: () => void;
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  // Actions - UI
  setSidebarOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedConversation: (id: string | null) => void;
  setSelectedClient: (id: string | null) => void;
  
  // Actions - Filters
  setConversationFilters: (filters: Partial<ConversationFilters>) => void;
  setClientFilters: (filters: Partial<ClientFilters>) => void;
  clearFilters: () => void;
  
  // Computed values
  getFilteredConversations: () => Conversation[];
  getFilteredClients: () => Client[];
  getUnreadCount: () => number;
  getAtRiskClients: () => Client[];
  getDashboardStats: () => DashboardStats;
  
  // Utility actions
  initializeStore: () => void;
  clearAllData: () => void;
}

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      conversations: [],
      clients: [],
      summaries: [],
      actionItems: [],
      responseTemplates: [],
      settings: storage.settings.getDefault(),
      
      // UI State
      sidebarOpen: false,
      activeTab: 'dashboard',
      selectedConversation: null,
      selectedClient: null,
      
      // Filters
      conversationFilters: {},
      clientFilters: {},
      
      // Loading states
      loading: {
        conversations: false,
        clients: false,
        actionItems: false,
      },
      
      // Conversation actions
      loadConversations: () => {
        set({ loading: { ...get().loading, conversations: true } });
        try {
          const conversations = storage.conversations.getAll();
          set({ conversations, loading: { ...get().loading, conversations: false } });
        } catch (error) {
          console.error('Error loading conversations:', error);
          set({ loading: { ...get().loading, conversations: false } });
        }
      },
      
      addConversation: (conversation) => {
        const conversations = [...get().conversations, conversation];
        set({ conversations });
        storage.conversations.save(conversations);
      },
      
      updateConversation: (id, updates) => {
        const conversations = get().conversations.map(conv =>
          conv.id === id ? { ...conv, ...updates, updatedAt: new Date() } : conv
        );
        set({ conversations });
        storage.conversations.save(conversations);
      },
      
      deleteConversation: (id) => {
        const conversations = get().conversations.filter(conv => conv.id !== id);
        set({ conversations });
        storage.conversations.save(conversations);
        
        // Clear selection if deleted conversation was selected
        if (get().selectedConversation === id) {
          set({ selectedConversation: null });
        }
      },
      
      markConversationRead: (id) => {
        get().updateConversation(id, { unread: false });
      },
      
      markConversationUnread: (id) => {
        get().updateConversation(id, { unread: true });
      },
      
      // Client actions
      loadClients: () => {
        set({ loading: { ...get().loading, clients: true } });
        try {
          const clients = storage.clients.getAll();
          set({ clients, loading: { ...get().loading, clients: false } });
        } catch (error) {
          console.error('Error loading clients:', error);
          set({ loading: { ...get().loading, clients: false } });
        }
      },
      
      addClient: (client) => {
        const clients = [...get().clients, client];
        set({ clients });
        storage.clients.save(clients);
      },
      
      updateClient: (id, updates) => {
        const clients = get().clients.map(client =>
          client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client
        );
        set({ clients });
        storage.clients.save(clients);
      },
      
      deleteClient: (id) => {
        const clients = get().clients.filter(client => client.id !== id);
        set({ clients });
        storage.clients.save(clients);
        
        if (get().selectedClient === id) {
          set({ selectedClient: null });
        }
      },
      
      updateClientHealth: (id, healthUpdates) => {
        const clients = get().clients.map(client =>
          client.id === id 
            ? { 
                ...client, 
                healthScore: { ...client.healthScore, ...healthUpdates, lastUpdated: new Date() },
                updatedAt: new Date()
              } 
            : client
        );
        set({ clients });
        storage.clients.save(clients);
      },
      
      // Action Items actions
      loadActionItems: () => {
        set({ loading: { ...get().loading, actionItems: true } });
        try {
          const actionItems = storage.actionItems.getAll();
          set({ actionItems, loading: { ...get().loading, actionItems: false } });
        } catch (error) {
          console.error('Error loading action items:', error);
          set({ loading: { ...get().loading, actionItems: false } });
        }
      },
      
      addActionItem: (item) => {
        const actionItems = [...get().actionItems, item];
        set({ actionItems });
        storage.actionItems.save(actionItems);
      },
      
      updateActionItem: (id, updates) => {
        const actionItems = get().actionItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        );
        set({ actionItems });
        storage.actionItems.save(actionItems);
      },
      
      deleteActionItem: (id) => {
        const actionItems = get().actionItems.filter(item => item.id !== id);
        set({ actionItems });
        storage.actionItems.save(actionItems);
      },
      
      completeActionItem: (id) => {
        get().updateActionItem(id, { 
          status: 'completed', 
          completedAt: new Date() 
        });
      },
      
      // Summary actions
      addSummary: (summary) => {
        const summaries = [...get().summaries, summary];
        set({ summaries });
        storage.summaries.save(summaries);
      },
      
      getSummaryByConversation: (conversationId) => {
        return get().summaries.find(s => s.conversationId === conversationId) || null;
      },
      
      // Template actions
      loadResponseTemplates: () => {
        const templates = storage.templates.getAll();
        set({ responseTemplates: templates });
      },
      
      addResponseTemplate: (template) => {
        const templates = [...get().responseTemplates, template];
        set({ responseTemplates: templates });
        storage.templates.save(templates);
      },
      
      updateResponseTemplate: (id, updates) => {
        const templates = get().responseTemplates.map(template =>
          template.id === id ? { ...template, ...updates, updatedAt: new Date() } : template
        );
        set({ responseTemplates: templates });
        storage.templates.save(templates);
      },
      
      deleteResponseTemplate: (id) => {
        const templates = get().responseTemplates.filter(template => template.id !== id);
        set({ responseTemplates: templates });
        storage.templates.save(templates);
      },
      
      incrementTemplateUsage: (id) => {
        const templates = get().responseTemplates.map(template =>
          template.id === id 
            ? { ...template, usageCount: template.usageCount + 1, updatedAt: new Date() }
            : template
        );
        set({ responseTemplates: templates });
        storage.templates.save(templates);
      },
      
      // Settings actions
      loadSettings: () => {
        const settings = storage.settings.get() || storage.settings.getDefault();
        set({ settings });
      },
      
      updateSettings: (updates) => {
        const settings = { ...get().settings, ...updates, updatedAt: new Date() };
        set({ settings });
        storage.settings.save(settings);
      },
      
      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedConversation: (id) => set({ selectedConversation: id }),
      setSelectedClient: (id) => set({ selectedClient: id }),
      
      // Filter actions
      setConversationFilters: (filters) => {
        set({ conversationFilters: { ...get().conversationFilters, ...filters } });
      },
      
      setClientFilters: (filters) => {
        set({ clientFilters: { ...get().clientFilters, ...filters } });
      },
      
      clearFilters: () => {
        set({ conversationFilters: {}, clientFilters: {} });
      },
      
      // Computed values
      getFilteredConversations: () => {
        const { conversations, conversationFilters } = get();
        let filtered = [...conversations];
        
        if (conversationFilters.client) {
          filtered = filtered.filter(conv => 
            conv.client.toLowerCase().includes(conversationFilters.client!.toLowerCase())
          );
        }
        
        if (conversationFilters.priority) {
          filtered = filtered.filter(conv => conv.priority === conversationFilters.priority);
        }
        
        if (conversationFilters.sentiment) {
          filtered = filtered.filter(conv => conv.sentiment === conversationFilters.sentiment);
        }
        
        if (conversationFilters.unread !== undefined) {
          filtered = filtered.filter(conv => conv.unread === conversationFilters.unread);
        }
        
        if (conversationFilters.tags?.length) {
          filtered = filtered.filter(conv => 
            conv.tags?.some(tag => conversationFilters.tags!.includes(tag))
          );
        }
        
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },
      
      getFilteredClients: () => {
        const { clients, clientFilters } = get();
        let filtered = [...clients];
        
        if (clientFilters.healthStatus) {
          filtered = filtered.filter(client => client.healthScore.status === clientFilters.healthStatus);
        }
        
        if (clientFilters.trend) {
          filtered = filtered.filter(client => client.healthScore.trend === clientFilters.trend);
        }
        
        if (clientFilters.riskLevel) {
          const riskMap = { low: 80, medium: 60, high: 0 };
          const threshold = riskMap[clientFilters.riskLevel];
          filtered = filtered.filter(client => client.healthScore.score >= threshold);
        }
        
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      },
      
      getUnreadCount: () => {
        return get().conversations.filter(conv => conv.unread).length;
      },
      
      getAtRiskClients: () => {
        return get().clients.filter(client => 
          client.healthScore.status === 'at-risk' || client.healthScore.status === 'critical'
        );
      },
      
      getDashboardStats: () => {
        const { conversations, clients, actionItems } = get();
        const atRiskClients = get().getAtRiskClients();
        const avgHealthScore = clients.length > 0 
          ? clients.reduce((sum, client) => sum + client.healthScore.score, 0) / clients.length 
          : 0;
        
        return {
          totalConversations: conversations.length,
          unreadCount: get().getUnreadCount(),
          activeClients: clients.length,
          atRiskClients: atRiskClients.length,
          avgHealthScore: Math.round(avgHealthScore),
          pendingActions: actionItems.filter(item => item.status === 'pending').length,
          completedActions: actionItems.filter(item => item.status === 'completed').length,
          responseTime: {
            avg: 24, // Placeholder - would calculate from actual data
            trend: 'stable' as const,
          },
        };
      },
      
      // Utility actions
      initializeStore: () => {
        get().loadConversations();
        get().loadClients();
        get().loadActionItems();
        get().loadResponseTemplates();
        get().loadSettings();
        
        // Load UI state
        const uiState = storage.uiState.get();
        if (uiState) {
          set({
            sidebarOpen: uiState.sidebarOpen,
            activeTab: uiState.activeTab,
            selectedConversation: uiState.selectedConversation || null,
            selectedClient: uiState.selectedClient || null,
          });
        }
      },
      
      clearAllData: () => {
        storage.clear();
        set({
          conversations: [],
          clients: [],
          summaries: [],
          actionItems: [],
          responseTemplates: [],
          settings: storage.settings.getDefault(),
          selectedConversation: null,
          selectedClient: null,
          conversationFilters: {},
          clientFilters: {},
        });
      },
    }),
    {
      name: 'clientflow-store',
    }
  )
);

// Utility hooks for common operations
export const useConversations = () => {
  const store = useAppStore();
  return {
    conversations: store.getFilteredConversations(),
    loading: store.loading.conversations,
    unreadCount: store.getUnreadCount(),
    addConversation: store.addConversation,
    updateConversation: store.updateConversation,
    deleteConversation: store.deleteConversation,
    markRead: store.markConversationRead,
    markUnread: store.markConversationUnread,
    setFilters: store.setConversationFilters,
    filters: store.conversationFilters,
  };
};

export const useClients = () => {
  const store = useAppStore();
  return {
    clients: store.getFilteredClients(),
    loading: store.loading.clients,
    atRiskClients: store.getAtRiskClients(),
    addClient: store.addClient,
    updateClient: store.updateClient,
    deleteClient: store.deleteClient,
    updateHealth: store.updateClientHealth,
    setFilters: store.setClientFilters,
    filters: store.clientFilters,
  };
};

export const useActionItems = () => {
  const store = useAppStore();
  return {
    actionItems: store.actionItems,
    loading: store.loading.actionItems,
    addActionItem: store.addActionItem,
    updateActionItem: store.updateActionItem,
    deleteActionItem: store.deleteActionItem,
    completeActionItem: store.completeActionItem,
  };
};

export const useDashboard = () => {
  const store = useAppStore();
  return {
    stats: store.getDashboardStats(),
    conversations: store.getFilteredConversations().slice(0, 5), // Recent 5
    atRiskClients: store.getAtRiskClients().slice(0, 3), // Top 3 at risk
  };
}; 