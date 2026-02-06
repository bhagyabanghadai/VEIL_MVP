import React, { useState } from 'react';
import {
    LayoutDashboard,
    Shield,
    Database,
    Settings,
    Radio,
    Terminal,
    Menu,
    LogOut
} from 'lucide-react';
import { Sidebar as SidebarContainer, SidebarBody, SidebarLink } from '../ui/sidebar';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SidebarProps {
    className?: string;
}

const DashboardSidebar: React.FC<SidebarProps> = ({ className }) => {
    const [open, setOpen] = useState(false);

    const navItems = [
        { label: 'Command Grid', href: '/', icon: <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-veil-accent" /> },
        { label: 'Identities', href: '/agents', icon: <UsersIcon /> }, // Custom wrapper for consistency
        { label: 'Policy Matrix', href: '/policies', icon: <Shield className="h-5 w-5 flex-shrink-0 text-veil-text-secondary" /> },
        { label: 'Audit Ledger', href: '/logs', icon: <Database className="h-5 w-5 flex-shrink-0 text-veil-text-secondary" /> },
        { label: 'System CLI', href: '/terminal', icon: <Terminal className="h-5 w-5 flex-shrink-0 text-veil-text-secondary" /> },
    ];

    const bottomItems = [
        { label: 'Broadcast', href: '/broadcast', icon: <Radio className="h-5 w-5 flex-shrink-0 text-veil-text-muted" /> },
        { label: 'Configuration', href: '/settings', icon: <Settings className="h-5 w-5 flex-shrink-0 text-veil-text-muted" /> },
    ];

    return (
        <div className={cn("h-full", className)}>
            <SidebarContainer open={open} setOpen={setOpen} animate={true}>
                <SidebarBody className="justify-between gap-10 bg-black/40 backdrop-blur-xl border-r border-white/5">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {/* Section Header if open */}
                            {open && <div className="px-2 mb-2 text-xs font-semibold text-veil-text-muted/50 uppercase tracking-widest">Main Modules</div>}

                            {navItems.map((link, idx) => (
                                <SidebarLink key={idx} link={link} className={cn("hover:bg-veil-accent/10 rounded-md transition-colors", open ? "px-2" : "")} />
                            ))}

                            {open && <div className="px-2 mt-6 mb-2 text-xs font-semibold text-veil-text-muted/50 uppercase tracking-widest">System</div>}
                            {bottomItems.map((link, idx) => (
                                <SidebarLink key={idx + 10} link={link} className={cn("hover:bg-veil-accent/10 rounded-md transition-colors", open ? "px-2" : "")} />
                            ))}
                        </div>
                    </div>

                    {/* Footer Profile / User */}
                    <div>
                        <SidebarLink
                            link={{
                                label: "Admin User",
                                href: "#",
                                icon: (
                                    <div className="h-7 w-7 flex-shrink-0 rounded-full bg-veil-accent/20 flex items-center justify-center border border-veil-accent">
                                        <div className="h-2 w-2 rounded-full bg-veil-accent animate-pulse" />
                                    </div>
                                ),
                            }}
                            className={cn("hover:bg-veil-accent/10 rounded-md transition-colors", open ? "px-2" : "")}
                        />
                    </div>
                </SidebarBody>
            </SidebarContainer>
        </div>
    );
};

// Sub-components
const Logo = () => {
    return (
        <a href="#" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
            <div className="h-6 w-6 bg-veil-accent rounded flex items-center justify-center text-white font-bold flex-shrink-0">V</div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg tracking-tight text-veil-text-primary whitespace-pre"
            >
                VEIL<span className="text-veil-text-muted font-normal">CORP</span>
            </motion.span>
        </a>
    );
};

const LogoIcon = () => {
    return (
        <a href="#" className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20">
            <div className="h-6 w-6 bg-veil-accent rounded flex items-center justify-center text-white font-bold flex-shrink-0">V</div>
        </a>
    );
};

export default DashboardSidebar;

// Helper to avoid import issues
import { Users } from 'lucide-react';
const UsersIcon = () => <Users className="h-5 w-5 flex-shrink-0 text-veil-text-secondary group-hover:text-veil-text-primary transition-colors" />;
