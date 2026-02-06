import React from 'react';
import { motion } from 'framer-motion';

const NotFoundPage: React.FC = () => {
    return (
        <div className="w-full h-[80vh] flex flex-col items-center justify-center p-12 relative overflow-hidden">
            <div className="w-64 h-64 border border-white/10 rounded-full flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 border border-white/5 animate-[spin_10s_linear_infinite]"></div>
                <div className="w-2 h-2 bg-white/20"></div>
                <div className="text-[120px] font-black text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">404</div>
            </div>
            <h1 className="text-hero text-center mb-6">Sector Null.</h1>
            <p className="text-white/40 text-[18px] max-w-lg text-center leading-relaxed">
                The coordinates you are trying to reach do not exist within the verified network topography.
            </p>
            <a href="/" className="mt-12 neon-button primary">Return to Uplink</a>
        </div>
    );
};

export default NotFoundPage;
