import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/sidebar/Sidebar';
import { Menu, X, Bell, Search, User, ChevronDown, Settings } from 'lucide-react';
import { cn } from '@/utils';
import { useState } from 'react';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Slimmer */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm">
        <div className="px-4 lg:px-5 h-14 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Desktop Sidebar Toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">FM</span>
              </div>
              <h1 className="text-base font-semibold text-gray-900 hidden lg:block">
                FundFlow Pro
              </h1>
            </div>
          </div>

          {/* Center Section - Search Bar */}
          <div className="flex-1 max-w-xl mx-3 hidden lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search funds, investors, reports..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="hidden lg:flex p-2 rounded-md hover:bg-gray-100 transition-colors">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <div className="relative">
                <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-gray-900">John Manager</p>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex pt-14">
        {/* Desktop Sidebar - Slimmer */}
        <aside
          className={cn(
            'hidden lg:block transition-all duration-200 ease-in-out bg-white border-r border-gray-200',
            'h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto',
            isSidebarOpen ? 'w-56' : 'w-16'
          )}
        >
          <Sidebar 
            isCollapsed={!isSidebarOpen} 
            onClose={closeMobileSidebar}
          />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <>
            <div 
              className="lg:hidden fixed inset-0 bg-black/40 z-40"
              onClick={closeMobileSidebar}
            />
            <div className="lg:hidden fixed left-0 top-0 bottom-0 w-64 z-50 shadow-xl">
              <Sidebar 
                isCollapsed={false} 
                isMobile={true}
                onClose={closeMobileSidebar}
              />
            </div>
          </>
        )}

        {/* Main Content - Reduced Margin */}
        <main
          className={cn(
            'flex-1 transition-all duration-200 min-h-[calc(100vh-3.5rem)]',
            'bg-gradient-to-br from-gray-50 to-white',
            isSidebarOpen ? 'lg:ml' : 'lg:ml-16'
          )}
        >
          <div className="p-4 lg:p-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;