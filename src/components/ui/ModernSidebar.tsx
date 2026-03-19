"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users,
  FileCheck,
  Layers,
  ShieldCheck,
  Menu,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutDashboard,
} from 'lucide-react';

type Tab = 'dashboard' | 'classes' | 'files' | 'groups' | 'accounts' | 'roles' | 'menu' | 'settings';

interface NavigationItem {
  id: Tab;
  name: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  permission?: string;
}

interface ModernSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  onLogout: () => void;
  siteSettings: {
    site_name: string;
    theme_color: string;
    site_subtitle: string;
  };
  hasPermission: (permission: string) => boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "仪表盘", icon: LayoutDashboard, permission: 'view_dashboard' },
  { id: "classes", name: "班级管理", icon: Users, permission: 'manage_classes' },
  { id: "files", name: "文件管理", icon: FileCheck, permission: 'manage_files' },
  { id: "groups", name: "分组管理", icon: Layers, permission: 'manage_groups' },
];

const adminItems: NavigationItem[] = [
  { id: "accounts", name: "账号管理", icon: Users, permission: 'manage_users' },
  { id: "roles", name: "角色管理", icon: ShieldCheck, permission: 'manage_roles' },
  { id: "menu", name: "页面管理", icon: Menu, permission: 'manage_menu' },
  { id: "settings", name: "系统设置", icon: Settings },
];

const roleLabels: Record<string, string> = {
  admin: '系统管理员',
  teacher: '授课教师',
  student: '学生',
};

export function ModernSidebar({
  activeTab,
  onTabChange,
  user,
  onLogout,
  siteSettings,
  hasPermission,
  isCollapsed,
  onToggleCollapse,
}: ModernSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (tab: Tab) => {
    onTabChange(tab);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  const visibleMainItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );
  
  const visibleAdminItems = adminItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] p-3 rounded-2xl bg-white shadow-lg border border-slate-200 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="打开菜单"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-50 to-white z-[59] transition-all duration-300 ease-in-out flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isCollapsed ? "w-20" : "w-64"}
          border-r border-slate-200/80 shadow-xl shadow-slate-200/50
        `}
      >
        <div className="relative">
          <div className={`flex items-center ${isCollapsed ? 'justify-center p-4' : 'p-5'} border-b border-slate-200/60`}>
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ backgroundColor: siteSettings.theme_color }}
            >
              <Layers size={24} className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="font-bold text-lg text-slate-800">{siteSettings.site_name}</h1>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{siteSettings.site_subtitle}</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 items-center justify-center shadow-md hover:bg-slate-50 transition-all duration-200 z-10"
            aria-label={isCollapsed ? "展开" : "收起"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索功能..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-200 shadow-sm"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <div className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 ${isCollapsed ? 'text-center px-2' : 'px-3'}`}>
            {!isCollapsed && '主菜单'}
          </div>
          <ul className="space-y-1">
            {visibleMainItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id} className="relative">
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`
                      w-full flex items-center gap-3 transition-all duration-200 group relative
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                      ${isCollapsed ? "justify-center p-3 rounded-xl" : "px-4 py-3 rounded-xl"}
                    `}
                  >
                    <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} size={22} />
                    {!isCollapsed && <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>{item.name}</span>}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                        {item.name}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2 h-2 bg-slate-800 rotate-45" />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {visibleAdminItems.length > 0 && (
            <>
              <div className={`my-4 border-t border-slate-200/60 ${isCollapsed ? 'mx-2' : 'mx-3'}`} />
              <div className={`text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2 ${isCollapsed ? 'text-center px-2' : 'px-3'}`}>
                {!isCollapsed && '系统管理'}
              </div>
              <ul className="space-y-1">
                {visibleAdminItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id} className="relative">
                      <button
                        onClick={() => handleNavClick(item.id)}
                        className={`
                          w-full flex items-center gap-3 transition-all duration-200 group relative
                          ${isActive 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30" 
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}
                          ${isCollapsed ? "justify-center p-3 rounded-xl" : "px-4 py-3 rounded-xl"}
                        `}
                      >
                        <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"}`} size={22} />
                        {!isCollapsed && <span className={`text-sm font-medium ${isActive ? "font-semibold" : ""}`}>{item.name}</span>}
                        {isCollapsed && (
                          <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                            {item.name}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2 h-2 bg-slate-800 rotate-45" />
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </nav>

        <div className="mt-auto border-t border-slate-200/60 bg-gradient-to-t from-slate-50 to-transparent">
          <div className={`border-b border-slate-200/60 ${isCollapsed ? 'p-2' : 'p-4'}`}>
            <div className={`flex items-center rounded-xl transition-colors duration-200 ${isActive => isActive ? 'bg-blue-50' : 'hover:bg-slate-100'} ${isCollapsed ? 'justify-center p-2' : 'p-2.5'}`}>
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-200">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              {!isCollapsed && (
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{roleLabels[user.role] || user.role}</p>
                </div>
              )}
            </div>
          </div>

          <div className={`p-2 ${isCollapsed ? '' : ''}`}>
            <button
              onClick={onLogout}
              className={`
                w-full flex items-center rounded-xl text-left transition-all duration-200 group relative
                text-rose-600 hover:bg-rose-50 hover:text-rose-700
                ${isCollapsed ? "justify-center p-3" : "px-4 py-3"}
              `}
            >
              <LogOut className="h-5 w-5 flex-shrink-0 text-rose-500 group-hover:text-rose-600" size={22} />
              {!isCollapsed && <span className="text-sm font-medium ml-3">退出登录</span>}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-xl">
                  退出登录
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2 h-2 bg-slate-800 rotate-45" />
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
