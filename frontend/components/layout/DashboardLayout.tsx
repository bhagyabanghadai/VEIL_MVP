import React, { useState } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield,
    Database,
    Terminal,
    Settings,
    Activity,
    Search,
    Bell,
    ChevronRight,
    ChevronDown,
    Mail,
    FileText,
    Star,
    Moon,
    User
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- Sidebar Navigation Item ---
const NavItem = ({ icon: Icon, label, href, active, badge, hasSubmenu, isOpen, onClick }: any) => (
    <div>
        <Link
            to={href || '#'}
            onClick={onClick}
            className={cn(
                "flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group",
                active
                    ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5", active ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && (
                    <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        typeof badge === 'number' ? "bg-cyan-500/20 text-cyan-400" :
                            badge === 'Pro' ? "bg-teal-500/20 text-teal-400" :
                                badge === 'New' ? "bg-emerald-500/20 text-emerald-400" :
                                    "bg-amber-500/20 text-amber-400"
                    )}>
                        {badge}
                    </span>
                )}
                {hasSubmenu && (
                    isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                )}
            </div>
        </Link>
    </div>
);

// --- Security-Themed Sidebar ---
const Sidebar = () => {
    const location = useLocation();
    const [openMenus, setOpenMenus] = useState<string[]>(['dashboards']);

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev =>
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    return (
        <aside className="w-64 h-screen sticky top-0 bg-slate-900 border-r border-slate-800 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <span className="text-lg font-bold text-white">VEIL</span>
                    <span className="text-[10px] text-slate-500 block -mt-1">Security OS</span>
                </div>
            </div>

            {/* Navigation - Optimized with LayoutGroup and layoutDependency */}
            <LayoutGroup>
                <motion.nav
                    className="flex-1 p-4 space-y-1 overflow-y-auto"
                    layout
                    layoutDependency={openMenus.length}
                >
                    {/* Dashboards Group */}
                    <NavItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        href="/"
                        active={location.pathname === '/'}
                    />

                    <NavItem icon={User} label="Agents" href="/agents" active={location.pathname === '/agents'} />
                    <NavItem icon={Shield} label="Policies" href="/policies" active={location.pathname === '/policies'} badge={3} />
                    <NavItem icon={Database} label="Audit Ledger" href="/logs" active={location.pathname === '/logs'} />

                    {/* Divider */}
                    <div className="py-4">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-600 px-4 mb-2">
                            Management
                        </div>
                    </div>

                    <NavItem icon={Mail} label="Alerts" href="/alerts" badge="New" />
                    <NavItem icon={Terminal} label="Terminal" href="/terminal" />
                    <NavItem icon={FileText} label="Reports" href="/reports" />
                    <NavItem icon={Settings} label="Settings" href="/settings" active={location.pathname === '/settings'} />
                </motion.nav>
            </LayoutGroup>

            {/* Bottom Status */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <div className="flex-1">
                        <div className="text-xs font-medium text-slate-300">System Online</div>
                        <div className="text-[10px] text-slate-500">7 layers active</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

// --- Top Header ---
const Header = ({ headerProps }: { headerProps?: any }) => {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Search */}
            <div className="flex items-center relative w-80">
                <Search className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search agents, policies, logs..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {headerProps && (
                    <div className="flex items-center gap-2 mr-4 border-r border-slate-200 pr-4">
                        <button
                            onClick={headerProps.toggleDemo}
                            className={cn(
                                "text-xs font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-wider",
                                headerProps.isDemoMode
                                    ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                            )}
                        >
                            Demo: {headerProps.isDemoMode ? 'ON' : 'OFF'}
                        </button>

                        {headerProps.isDemoMode && (
                            <button
                                onClick={headerProps.runSimulation}
                                disabled={headerProps.simulationStep !== null}
                                className={cn(
                                    "text-xs font-bold px-3 py-1.5 rounded-lg border transition-all uppercase tracking-wider flex items-center gap-2",
                                    headerProps.simulationStep !== null
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                                )}
                            >
                                {headerProps.simulationStep !== null ? (
                                    <>
                                        <Activity className="w-3 h-3 animate-spin" />
                                        Running...
                                    </>
                                ) : (
                                    <>
                                        <Activity className="w-3 h-3" />
                                        Simulate Attack
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                )}

                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Moon className="w-5 h-5 text-slate-500" />
                </button>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-slate-500" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-sm font-medium text-slate-700">Admin</div>
                        <div className="text-[10px] text-slate-400">SecOps</div>
                    </div>
                    {headerProps?.onLogout ? (
                        <button
                            onClick={headerProps.onLogout}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center ring-2 ring-cyan-100 hover:ring-4 transition-all"
                            title="Logout"
                        >
                            <User className="w-5 h-5 text-white" />
                        </button>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center ring-2 ring-cyan-100">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// --- Main Layout ---
interface LayoutProps {
    children: React.ReactNode;
    isAuthenticated?: boolean;
    headerProps?: any;
    systemRisk?: string;
}

const DashboardLayout: React.FC<LayoutProps> = ({ children, headerProps }) => {
    return (
        <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Header headerProps={headerProps} />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
