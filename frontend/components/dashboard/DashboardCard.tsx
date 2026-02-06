import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface DashboardCardProps {
    title?: string;
    subtitle?: string;
    icon?: React.ComponentType<{ className?: string; size?: number | string }>;
    children: React.ReactNode;
    className?: string;
    action?: React.ReactNode;
    gradient?: boolean; // Kept for API compat
    alertLevel?: 'none' | 'low' | 'medium' | 'high';
    status?: 'neutral' | 'active' | 'warning' | 'critical' | 'success';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
    title,
    subtitle,
    icon: Icon,
    children,
    className,
    action,
    alertLevel = 'none',
    status = 'neutral'
}) => {
    // Map legacy alertLevel to status
    const effectiveStatus = alertLevel !== 'none'
        ? (alertLevel === 'high' ? 'critical' : alertLevel === 'medium' ? 'warning' : 'neutral')
        : status;

    const getColor = () => {
        switch (effectiveStatus) {
            case 'critical': return 'text-veil-alert border-veil-alert/50 shadow-[#ff3b30]';
            case 'warning': return 'text-veil-warning border-veil-warning/50 shadow-[#ff9500]';
            case 'success': return 'text-veil-success border-veil-success/50 shadow-[#34c759]';
            case 'active': return 'text-veil-accent border-veil-accent/50 shadow-[#00f0ff]';
            default: return 'text-white/50 border-white/10 shadow-white/5';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "relative flex flex-col overflow-hidden group rounded-sm",
                "bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10",
                "hover:border-white/20 transition-all duration-500",
                className
            )}
        >
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

            {/* Hover Glow Gradient */}
            <div className={cn(
                "absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white/10 to-transparent",
                effectiveStatus === 'active' && "via-[#00f0ff]/20",
                effectiveStatus === 'critical' && "via-[#ef4444]/20"
            )} />

            {/* Header Block */}
            {(title || Icon) && (
                <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        {Icon && (
                            <div className={cn(
                                "p-1.5 rounded-sm bg-white/5 border border-white/5",
                                effectiveStatus === 'active' && "text-[#00f0ff] border-[#00f0ff]/30",
                                effectiveStatus === 'critical' && "text-[#ef4444] border-[#ef4444]/30"
                            )}>
                                <Icon size={16} />
                            </div>
                        )}
                        <div>
                            {title && (
                                <h3 className="text-sm font-bold text-white tracking-tight uppercase group-hover:text-white transition-colors">
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p className="text-[10px] font-mono text-white/40 tracking-[0.2em] uppercase group-hover:text-white/60 transition-colors">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    {action && (
                        <div className="flex items-center">
                            {action}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            <div className="relative z-10 flex-1 p-6 bg-gradient-to-b from-transparent to-black/20">
                {children}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Status Line */}
            {effectiveStatus !== 'neutral' && (
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-[1px] opacity-50",
                    effectiveStatus === 'active' && "bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]",
                    effectiveStatus === 'critical' && "bg-[#ef4444] shadow-[0_0_10px_#ef4444]",
                    effectiveStatus === 'success' && "bg-[#10b981] shadow-[0_0_10px_#10b981]"
                )} />
            )}
        </motion.div>
    );
};

export default DashboardCard;
