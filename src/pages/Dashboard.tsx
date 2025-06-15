import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { EmailSummary } from '@/components/features/EmailSummary';
import { DraftResponse } from '@/components/features/DraftResponse';
import { HealthScore } from '@/components/features/HealthScore';
import { RecentConversations } from '@/components/features/RecentConversations';
import { ActionItems } from '@/components/features/ActionItems';
import { SettingsPage } from '@/pages/SettingsPage';
import { ClientsPage } from '@/pages/ClientsPage';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (activeTab === 'settings') {
    return <SettingsPage onBack={() => setActiveTab('dashboard')} />;
  }

  if (activeTab === 'clients') {
    return <ClientsPage onBack={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 w-full overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="w-full h-full space-y-4 sm:space-y-6">
            {/* Responsive grid with better breakpoints */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <EmailSummary />
                <div className="block lg:hidden">
                  <HealthScore />
                </div>
                <DraftResponse />
              </div>
              <div className="hidden lg:block">
                <HealthScore />
              </div>
            </div>
            
            <div className="w-full space-y-4 sm:space-y-6">
              <ActionItems />
              <RecentConversations />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}