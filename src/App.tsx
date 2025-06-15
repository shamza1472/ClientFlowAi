import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Dashboard } from '@/pages/Dashboard';
import { LoginPage } from '@/pages/LoginPage';
import { StoreProvider } from '@/components/providers/StoreProvider';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <StoreProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {isAuthenticated ? (
            <Dashboard />
          ) : (
            <LoginPage onLogin={() => setIsAuthenticated(true)} />
          )}
          <Toaster />
        </div>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;