
import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'three/examples/jsm/utils/BufferGeometryUtils.js';
// Note: We'll generate random positions manually to avoid complex imports if needed, 
// but let's try a standard approach first or just pure math for star generation to be safe.

import * as THREE from 'three';

// --- Components ---

function Stars(props: any) {
    const ref = useRef<any>(null);

    // Generate random star positions
    const [positions] = useState(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            // Random spherical distribution
            const r = 40 + Math.random() * 60; // radius between 40 and 100
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    });

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.1}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.4}
                />
            </Points>
        </group>
    );
}

function SentinelNode({ position, scale = 1, color = "#6ee7b7" }: { position: [number, number, number], scale?: number, color?: string }) {
    const ref = useRef<THREE.Mesh>(null);
    const wireframeRef = useRef<THREE.Mesh>(null);

    // Random rotation data
    const rotSpeed = useMemo(() => [
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
    ], []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x += rotSpeed[0] * delta;
            ref.current.rotation.y += rotSpeed[1] * delta;

            // Floating effect
            ref.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.01;
        }
        if (wireframeRef.current && ref.current) {
            wireframeRef.current.rotation.copy(ref.current.rotation);
            wireframeRef.current.position.copy(ref.current.position);
        }
    });

    return (
        <>
            {/* Core */}
            <mesh ref={ref} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#ffffff" roughness={0} metalness={1} transparent opacity={0.2} />
            </mesh>
            {/* Holographic Wireframe Cage */}
            <mesh ref={wireframeRef} position={position} scale={scale * 1.2}>
                <icosahedronGeometry args={[1, 0]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.1} />
            </mesh>
        </>
    );
}

function Scene({ systemRisk = 'LOW' }: { systemRisk?: string }) {
    const riskColor = useMemo(() => {
        if (systemRisk === 'CRITICAL') return '#ef4444';
        if (systemRisk === 'HIGH') return '#f97316';
        return '#6ee7b7';
    }, [systemRisk]);

    const lightIntensity = useMemo(() => {
        if (systemRisk === 'CRITICAL') return 4;
        if (systemRisk === 'HIGH') return 2.5;
        return 1;
    }, [systemRisk]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={lightIntensity} color={riskColor} />
            <Stars />

            {/* Background Sentinel Nodes */}
            <SentinelNode position={[-4, 2, -5]} scale={0.8} color={riskColor} />
            <SentinelNode position={[5, -3, -8]} scale={1.2} color={riskColor} />
            <SentinelNode position={[-6, -4, -10]} scale={0.6} color={riskColor} />
            <SentinelNode position={[8, 4, -12]} scale={1} color={riskColor} />
        </>
    );
}



const SpaceBackground = ({ systemRisk = 'LOW' }: { systemRisk?: string }) => {
    return (
        <div className="fixed inset-0 z-0 bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <Scene systemRisk={systemRisk} />
            </Canvas>
            {/* Overlay Gradient for Fade */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-black/80 pointer-events-none"></div>
        </div>
    );
};

export default SpaceBackground;
