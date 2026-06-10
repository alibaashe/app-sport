import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, MonitorPlay, CalendarDays, Settings, Search, Menu, HelpCircle, FileText } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/channels', icon: MonitorPlay, label: 'Live TV' },
  { path: '/matches', icon: CalendarDays, label: 'Matches' },
  { path: '/playlist', icon: FileText, label: 'Playlist' },
  { path: '/api-data', icon: Settings, label: 'Sportmonks' },
  { path: '/support', icon: HelpCircle, label: 'Support' },
];

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#12141D] border-b border-[#242731] sticky top-0 z-50 shrink-0">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 -ml-2 text-slate-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter italic">YACINE <span className="text-red-500">TV</span></h1>
        </div>
        <button className="p-2 -mr-2 text-slate-300 hover:text-white">
          <Search className="w-6 h-6" />
        </button>
      </header>

      {/* Desktop Sidebar (and Mobile Drawer if open) */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#0F1119] border-r border-[#242731] flex flex-col transition-transform duration-300 ease-in-out z-50 md:translate-x-0 hidden md:flex shrink-0",
        isSidebarOpen ? "translate-x-0 !flex" : "-translate-x-full"
      )}>
        <div className="h-20 hidden md:flex items-center gap-3 border-b border-[#242731] px-8 shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
             <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
          </div>
          <h1 className="text-xl font-black tracking-tighter italic">YACINE <span className="text-red-500">TV</span></h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-16 md:mt-0 overflow-y-auto">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 pl-2">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                  isActive ? "bg-red-600 text-white font-semibold shadow-[0_4px_12px_rgba(220,38,38,0.2)]" : "text-gray-400 hover:bg-[#1C1F2A] hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#242731]">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-[#1C1F2A] hover:text-white w-full transition-colors">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:overflow-hidden relative">
        {/* Desktop Header for Main Area - Matches the Immersive UI Header slightly adjusted since Logo is in sidebar */}
        <header className="hidden md:flex h-20 bg-[#12141D] border-b border-[#242731] items-center justify-between px-8 shrink-0">
           <div className="flex items-center bg-[#1C1F2A] px-4 py-2 rounded-full border border-[#2D313E] w-96">
             <Search className="w-5 h-5 text-gray-400" />
             <input type="text" placeholder="Search channels, teams, or leagues..." className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full text-gray-300" />
           </div>
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Server: Online</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 border-2 border-[#333745]"></div>
           </div>
        </header>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className="flex-1 md:overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#12141D] border-t border-[#242731] flex items-center justify-around pb-safe z-40">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 p-3 flex-1 transition-colors relative",
                isActive ? "text-red-500" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {isActive && <span className="absolute -bottom-2 left-1/2 -content-[''] w-1 h-1 bg-red-500 rounded-full inline-block -translate-x-[50%]" />}
              </div>
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
