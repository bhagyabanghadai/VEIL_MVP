
import React from 'react';

const GridBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none perspective-1000">
            {/* Horizon Glow */}
            <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-[#030305] to-transparent z-10"></div>

            {/* Moving Grid Floor */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [transform:rotateX(60deg)_scale(3)_translateY(20%)] animate-[pulse_10s_infinite] origin-bottom opacity-20"></div>

            {/* Fog Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent z-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030305_100%)] z-10"></div>
        </div>
    );
};

export default GridBackground;
