import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Search, Bell, X } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="w-full h-16 border-b border-slate-700 bg-slate-800/30 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Desktop Search */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 w-64 xl:w-80 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Mobile Search Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            {showMobileSearch ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <div className="flex items-center gap-2 ml-2 sm:ml-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-slate-300 text-sm hidden sm:block">John Doe</span>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="lg:hidden border-t border-slate-700 p-3 bg-slate-800/50 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 w-full bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
}