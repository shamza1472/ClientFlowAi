import type { 
  Conversation, 
  Client, 
  EmailSummary, 
  ActionItem, 
  ResponseTemplate, 
  UserSettings,
  AppState 
} from './types';
import { 
  validateConversation, 
  validateClient, 
  validateActionItem, 
  validateUserSettings 
} from './validations';

// Storage keys
const STORAGE_KEYS = {
  CONVERSATIONS: 'clientflow_conversations',
  CLIENTS: 'clientflow_clients',
  SUMMARIES: 'clientflow_summaries',
  ACTION_ITEMS: 'clientflow_action_items',
  RESPONSE_TEMPLATES: 'clientflow_response_templates',
  SETTINGS: 'clientflow_settings',
  UI_STATE: 'clientflow_ui_state',
} as const;

// Storage utility functions
class Storage {
  private static isClient = typeof window !== 'undefined';

  private static safeStringify(data: any): string {
    try {
      return JSON.stringify(data, (key, value) => {
        // Handle Date objects
        if (value instanceof Date) {
          return { __type: 'Date', value: value.toISOString() };
        }
        return value;
      });
    } catch (error) {
      console.error('Error stringifying data:', error);
      return '{}';
    }
  }

  private static safeParse<T>(data: string): T | null {
    try {
      return JSON.parse(data, (key, value) => {
        // Restore Date objects
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });
    } catch (error) {
      console.error('Error parsing stored data:', error);
      return null;
    }
  }

  static get<T>(key: string): T | null {
    if (!this.isClient) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      return this.safeParse<T>(item);
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error);
      return null;
    }
  }

  static set<T>(key: string, data: T): boolean {
    if (!this.isClient) return false;
    
    try {
      const serialized = this.safeStringify(data);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error);
      return false;
    }
  }

  static remove(key: string): boolean {
    if (!this.isClient) return false;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isClient) return false;
    
    try {
      // Only clear our app's keys
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

// Conversation storage
export const conversationStorage = {
  getAll(): Conversation[] {
    const conversations = Storage.get<Conversation[]>(STORAGE_KEYS.CONVERSATIONS);
    if (!conversations) return [];
    
    // Validate each conversation
    return conversations.filter(conv => {
      const result = validateConversation(conv);
      if (!result.success) {
        console.warn('Invalid conversation data:', result.error);
        return false;
      }
      return true;
    });
  },

  save(conversations: Conversation[]): boolean {
    return Storage.set(STORAGE_KEYS.CONVERSATIONS, conversations);
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
    const clients = Storage.get<Client[]>(STORAGE_KEYS.CLIENTS);
    if (!clients) return [];
    
    return clients.filter(client => {
      const result = validateClient(client);
      if (!result.success) {
        console.warn('Invalid client data:', result.error);
        return false;
      }
      return true;
    });
  },

  save(clients: Client[]): boolean {
    return Storage.set(STORAGE_KEYS.CLIENTS, clients);
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
    const items = Storage.get<ActionItem[]>(STORAGE_KEYS.ACTION_ITEMS);
    if (!items) return [];
    
    return items.filter(item => {
      const result = validateActionItem(item);
      if (!result.success) {
        console.warn('Invalid action item data:', result.error);
        return false;
      }
      return true;
    });
  },

  save(items: ActionItem[]): boolean {
    return Storage.set(STORAGE_KEYS.ACTION_ITEMS, items);
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
    const settings = Storage.get<UserSettings>(STORAGE_KEYS.SETTINGS);
    if (!settings) return null;
    
    const result = validateUserSettings(settings);
    if (!result.success) {
      console.warn('Invalid settings data:', result.error);
      return null;
    }
    
    return settings;
  },

  save(settings: UserSettings): boolean {
    return Storage.set(STORAGE_KEYS.SETTINGS, settings);
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
    return Storage.get<{
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
    return Storage.set(STORAGE_KEYS.UI_STATE, uiState);
  }
};

// Summary and Template storage (simpler implementations)
export const summaryStorage = {
  getAll(): EmailSummary[] {
    return Storage.get<EmailSummary[]>(STORAGE_KEYS.SUMMARIES) || [];
  },
  save(summaries: EmailSummary[]): boolean {
    return Storage.set(STORAGE_KEYS.SUMMARIES, summaries);
  }
};

export const templateStorage = {
  getAll(): ResponseTemplate[] {
    return Storage.get<ResponseTemplate[]>(STORAGE_KEYS.RESPONSE_TEMPLATES) || [];
  },
  save(templates: ResponseTemplate[]): boolean {
    return Storage.set(STORAGE_KEYS.RESPONSE_TEMPLATES, templates);
  }
};

// Migration utility for future schema changes
export const migration = {
  getCurrentVersion(): number {
    return Storage.get<number>('clientflow_version') || 1;
  },

  setVersion(version: number): boolean {
    return Storage.set('clientflow_version', version);
  },

  migrate(): void {
    const currentVersion = this.getCurrentVersion();
    
    // Future migrations would go here
    if (currentVersion < 2) {
      // Migration logic for version 2
    }
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
  migration,
  clear: Storage.clear,
}; 