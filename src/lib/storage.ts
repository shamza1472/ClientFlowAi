import { 
  Client, 
  Conversation, 
  ActionItem,
  EmailSummary,
  ResponseTemplate,
  UserSettings
} from './types';

// Storage keys
const STORAGE_KEYS = {
  CONVERSATIONS: 'clientflow_conversations',
  CLIENTS: 'clientflow_clients',
  ACTION_ITEMS: 'clientflow_action_items',
  SUMMARIES: 'clientflow_summaries',
  RESPONSE_TEMPLATES: 'clientflow_response_templates',
  SETTINGS: 'clientflow_settings',
  UI_STATE: 'clientflow_ui_state',
} as const;

// Helper functions for localStorage operations
const storageHelpers = {
  // Get data from localStorage
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      return JSON.parse(item, (_key, value) => {
        // Handle Date objects
        if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
          return new Date(value);
        }
        return value;
      });
    } catch (error) {
      console.error(`Error reading from localStorage:`, error);
      return null;
    }
  },

  // Set data to localStorage
  set: <T>(key: string, data: T): boolean => {
    try {
      const serialized = JSON.stringify(data, (_key, value) => {
        // Handle Date objects
        if (value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage:`, error);
      return false;
    }
  },

  // Remove data from localStorage
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage:`, error);
      return false;
    }
  },

  // Clear all app data
  clear: (): boolean => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error(`Error clearing localStorage:`, error);
      return false;
    }
  }
};

// Conversation storage
export const conversationStorage = {
  getAll(): Conversation[] {
    return storageHelpers.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS) || [];
  },

  save(conversations: Conversation[]): boolean {
    return storageHelpers.set(STORAGE_KEYS.CONVERSATIONS, conversations);
  },

  add(conversation: Conversation): boolean {
    const conversations = this.getAll();
    conversations.push(conversation);
    return this.save(conversations);
  },

  update(id: string, updates: Partial<Conversation>): boolean {
    const conversations = this.getAll();
    const index = conversations.findIndex(conv => conv.id === id);
    
    if (index === -1) return false;
    
    conversations[index] = { 
      ...conversations[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    return this.save(conversations);
  },

  delete(id: string): boolean {
    const conversations = this.getAll();
    const filtered = conversations.filter(conv => conv.id !== id);
    return this.save(filtered);
  },

  getById(id: string): Conversation | null {
    const conversations = this.getAll();
    return conversations.find(conv => conv.id === id) || null;
  }
};

// Client storage
export const clientStorage = {
  getAll(): Client[] {
    return storageHelpers.get<Client[]>(STORAGE_KEYS.CLIENTS) || [];
  },

  save(clients: Client[]): boolean {
    return storageHelpers.set(STORAGE_KEYS.CLIENTS, clients);
  },

  add(client: Client): boolean {
    const clients = this.getAll();
    clients.push(client);
    return this.save(clients);
  },

  update(id: string, updates: Partial<Client>): boolean {
    const clients = this.getAll();
    const index = clients.findIndex(client => client.id === id);
    
    if (index === -1) return false;
    
    clients[index] = { 
      ...clients[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    
    return this.save(clients);
  },

  delete(id: string): boolean {
    const clients = this.getAll();
    const filtered = clients.filter(client => client.id !== id);
    return this.save(filtered);
  },

  getById(id: string): Client | null {
    const clients = this.getAll();
    return clients.find(client => client.id === id) || null;
  }
};

// Action Items storage
export const actionItemStorage = {
  getAll(): ActionItem[] {
    return storageHelpers.get<ActionItem[]>(STORAGE_KEYS.ACTION_ITEMS) || [];
  },

  save(items: ActionItem[]): boolean {
    return storageHelpers.set(STORAGE_KEYS.ACTION_ITEMS, items);
  },

  add(item: ActionItem): boolean {
    const items = this.getAll();
    items.push(item);
    return this.save(items);
  },

  update(id: string, updates: Partial<ActionItem>): boolean {
    const items = this.getAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return false;
    
    items[index] = { ...items[index], ...updates };
    
    return this.save(items);
  },

  delete(id: string): boolean {
    const items = this.getAll();
    const filtered = items.filter(item => item.id !== id);
    return this.save(filtered);
  }
};

// Settings storage
export const settingsStorage = {
  get(): UserSettings | null {
    return storageHelpers.get<UserSettings>(STORAGE_KEYS.SETTINGS);
  },

  save(settings: UserSettings): boolean {
    return storageHelpers.set(STORAGE_KEYS.SETTINGS, settings);
  },

  getDefault(): UserSettings {
    return {
      theme: 'dark',
      notifications: {
        email: true,
        desktop: true,
        sound: false,
      },
      preferences: {
        defaultPriority: 'medium',
        autoSave: true,
        compactView: false,
      },
      apiKeys: {},
      updatedAt: new Date(),
    };
  }
};

// UI State storage
export const uiStateStorage = {
  get() {
    return storageHelpers.get<{
      sidebarOpen: boolean;
      activeTab: string;
      selectedConversation?: string;
      selectedClient?: string;
    }>(STORAGE_KEYS.UI_STATE);
  },

  save(uiState: {
    sidebarOpen: boolean;
    activeTab: string;
    selectedConversation?: string;
    selectedClient?: string;
  }): boolean {
    return storageHelpers.set(STORAGE_KEYS.UI_STATE, uiState);
  }
};

// Summary and Template storage
export const summaryStorage = {
  getAll(): EmailSummary[] {
    return storageHelpers.get<EmailSummary[]>(STORAGE_KEYS.SUMMARIES) || [];
  },
  save(summaries: EmailSummary[]): boolean {
    return storageHelpers.set(STORAGE_KEYS.SUMMARIES, summaries);
  }
};

export const templateStorage = {
  getAll(): ResponseTemplate[] {
    return storageHelpers.get<ResponseTemplate[]>(STORAGE_KEYS.RESPONSE_TEMPLATES) || [];
  },
  save(templates: ResponseTemplate[]): boolean {
    return storageHelpers.set(STORAGE_KEYS.RESPONSE_TEMPLATES, templates);
  }
};

// Export the main storage interface
export const storage = {
  conversations: conversationStorage,
  clients: clientStorage,
  actionItems: actionItemStorage,
  settings: settingsStorage,
  summaries: summaryStorage,
  templates: templateStorage,
  uiState: uiStateStorage,
  clear: storageHelpers.clear,
}; 