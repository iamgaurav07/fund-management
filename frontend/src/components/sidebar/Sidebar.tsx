import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PieChart, 
  TrendingUp, 
  Users, 
  FileText, 
  Settings,
  BarChart3,
  Shield,
  LogOut,
  ChevronRight,
  Calendar,
  Zap,
} from 'lucide-react';
import { cn } from '@/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface SidebarProps {
  isCollapsed: boolean;
  isMobile?: boolean;
  onClose?: () => void;
}

// Define NavItem component OUTSIDE of Sidebar
interface NavItemProps {
  item: {
    title: string;
    icon: React.ReactNode;
    path: string;
    badge: string | null;
    badgeColor?: string;
  };
  isCollapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

const NavItem = ({ item, isCollapsed, isMobile, onClose }: NavItemProps) => (
  <NavLink
    to={item.path}
    onClick={isMobile ? onClose : undefined}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-150 group',
        'hover:bg-primary-50 hover:text-primary-700',
        isActive
          ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-2 border-primary-600'
          : 'text-gray-700',
        isCollapsed && !isMobile && 'justify-center px-2'
      )
    }
  >
    <div className="relative flex-shrink-0">
      <div className={cn(
        'p-1.5 rounded-md transition-colors',
        'group-hover:bg-primary-100 group-hover:text-primary-700',
        'group-[.active]:bg-primary-100 group-[.active]:text-primary-700'
      )}>
        {item.icon}
      </div>
      {item.badge && (
        <span className={cn(
          'absolute -top-1 -right-1 text-[10px] font-semibold px-1 py-0.5 rounded-full',
          item.badgeColor || 'bg-primary-100 text-primary-800'
        )}>
          {item.badge}
        </span>
      )}
    </div>
    {(!isCollapsed || isMobile) && (
      <>
        <span className="flex-1 text-sm font-medium">{item.title}</span>
        <ChevronRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </>
    )}
  </NavLink>
);

// Define SectionHeader component OUTSIDE of Sidebar
interface SectionHeaderProps {
  title: string;
  isCollapsed: boolean;
  isMobile: boolean;
}

const SectionHeader = ({ title, isCollapsed, isMobile }: SectionHeaderProps) => {
  if (isCollapsed && !isMobile) return null;
  return (
    <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
      {title}
    </h3>
  );
};

const Sidebar = ({ isCollapsed, isMobile = false, onClose }: SidebarProps) => {

  const { fundId: persistedFundId } = useSelector((state: RootState) => state.persistedSlice);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Home className="w-4 h-4" />,
      path: '/dashboard',
      badge: null,
    },
    {
      title: 'Investments',
      icon: <PieChart className="w-4 h-4" />,
      path: `/funds/${persistedFundId}/investments`,
      badge: '1',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      title: 'Transactions',
      icon: <TrendingUp className="w-4 h-4" />,
      path: `/funds/${persistedFundId}/transactions`,
      badge: null,
    },
    {
      title: 'Investors',
      icon: <Users className="w-4 h-4" />,
      path: '/investors',
      badge: '42',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      title: 'Reports',
      icon: <FileText className="w-4 h-4" />,
      path: '/reports',
      badge: null,
    },
  ];

  const fundManagementItems = [
    {
      title: 'Analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      path: '/analytics',
      badge: null,
    },
    {
      title: 'Compliance',
      icon: <Shield className="w-4 h-4" />,
      path: '/compliance',
      badge: '2',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  const utilityItems = [
    {
      title: 'Calendar',
      icon: <Calendar className="w-4 h-4" />,
      path: '/calendar',
      badge: '3',
      badgeColor: 'bg-orange-100 text-orange-800',
    },
    {
      title: 'Settings',
      icon: <Settings className="w-4 h-4" />,
      path: '/settings',
      badge: null,
    },
  ];

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Sidebar Header - Slimmer */}
      {(!isCollapsed || isMobile) ? (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">FM</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">FundFlow Pro</h2>
              <p className="text-[11px] text-gray-500">Enterprise</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-primary-500/5 to-primary-600/5 rounded-md p-2 border border-primary-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-medium text-primary-700">AUM</p>
              <span className="text-[10px] font-bold text-emerald-600">↑12.5%</span>
            </div>
            <p className="text-sm font-bold text-gray-900">$124.8M</p>
          </div>
        </div>
      ) : (
        <div className="p-3 border-b border-gray-100 flex justify-center">
          <div className="w-7 h-7 bg-gradient-to-br from-primary-600 to-primary-700 rounded-md flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">FM</span>
          </div>
        </div>
      )}

      {/* Scrollable Content - Tighter spacing */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Main Navigation */}
        <div>
          <SectionHeader 
            title="Navigation" 
            isCollapsed={isCollapsed} 
            isMobile={isMobile} 
          />
          <div className="space-y-0.5">
            {menuItems.map((item) => (
              <NavItem 
                key={item.path} 
                item={item}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                onClose={onClose}
              />
            ))}
          </div>
        </div>

        {/* Fund Management */}
        <div>
          <SectionHeader 
            title="Management" 
            isCollapsed={isCollapsed} 
            isMobile={isMobile} 
          />
          <div className="space-y-0.5">
            {fundManagementItems.map((item) => (
              <NavItem 
                key={item.path} 
                item={item}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                onClose={onClose}
              />
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <SectionHeader 
            title="Utilities" 
            isCollapsed={isCollapsed} 
            isMobile={isMobile} 
          />
          <div className="space-y-0.5">
            {utilityItems.map((item) => (
              <NavItem 
                key={item.path} 
                item={item}
                isCollapsed={isCollapsed}
                isMobile={isMobile}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Footer - Slimmer */}
      <div className="p-3 border-t border-gray-100">
        {(!isCollapsed || isMobile) ? (
          <>
            {/* Quick Action */}
            <div className="mb-3 p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-3 h-3 text-primary-600" />
                <span className="text-xs font-medium text-gray-700">Quick Action</span>
              </div>
              <button className="w-full py-1.5 bg-white border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                + New Report
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="relative">
                <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">JM</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white"></div>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900">John Manager</p>
                <p className="text-[10px] text-gray-500">Online</p>
              </div>
              <LogOut className="w-3 h-3 text-gray-400" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <Zap className="w-4 h-4 text-primary-600" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-gray-100 transition-colors">
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;