import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { storage } from '@/lib/storage';
import { seedMockData } from '@/lib/data-utils';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const initializeStore = useAppStore(state => state.initializeStore);

  useEffect(() => {
    // Initialize the store with data from localStorage
    initializeStore();

    // If no data exists, seed with mock data for development
    const conversations = storage.conversations.getAll();
    const clients = storage.clients.getAll();
    
    if (conversations.length === 0 && clients.length === 0) {
      console.log('No existing data found. Seeding with mock data...');
      const mockData = seedMockData();
      
      // Save mock data to storage
      storage.conversations.save(mockData.conversations);
      storage.clients.save(mockData.clients);
      
      // Reload the store with the seeded data
      initializeStore();
      
      console.log('Mock data seeded successfully!');
    }
  }, [initializeStore]);

  return <>{children}</>;
} 