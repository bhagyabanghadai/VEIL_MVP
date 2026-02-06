import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {/* Header Warning Line */}
                        <div className={`h-1 w-full ${isDestructive ? 'bg-red-500' : 'bg-[#00f0ff]'}`} />

                        <div className="p-6">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-[#00f0ff]/10 text-[#00f0ff]'}`}>
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                                    <p className="text-white/60 text-sm leading-relaxed mb-6">
                                        {message}
                                    </p>

                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={onCancel}
                                            className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {cancelText}
                                        </button>
                                        <button
                                            onClick={() => {
                                                onConfirm();
                                                onCancel(); // Close after confirm
                                            }}
                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isDestructive
                                                    ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                                                    : 'bg-[#00f0ff]/10 border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff]/20'
                                                }`}
                                        >
                                            {confirmText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Close button top right */}
                        <button
                            onClick={onCancel}
                            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmationModal;
