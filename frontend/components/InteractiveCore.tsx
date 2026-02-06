'use client'

import { SplineScene } from "@/components/ui/spline";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"

export default function InteractiveCore() {
    return (
        <Card className="w-full h-[600px] bg-veil-bg border-veil-border relative overflow-hidden rounded-none border-x-0 border-t border-b">

            {/* Atmosphere */}
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="#00f0ff" // Cyan/Veil-Trust color
            />

            <div className="flex flex-col md:flex-row h-full">

                {/* Left Content */}
                <div className="flex-1 p-12 relative z-10 flex flex-col justify-center pointer-events-none">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-veil-trust rounded-full animate-pulse-slow"></div>
                        <span className="text-xs font-mono text-veil-text-muted tracking-widest uppercase">Live Topology</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500 leading-tight">
                        Cryptographic <br /> Hyperspace
                    </h1>
                    <p className="mt-6 text-veil-text-secondary max-w-lg text-lg font-light leading-relaxed">
                        Interact with the multi-dimensional geometry of agentic trust.
                        Every node represents a verified execution context.
                    </p>

                    <div className="mt-8 flex gap-4 pointer-events-auto">
                        <div className="px-4 py-2 border border-veil-border/50 bg-veil-sub/50 text-xs font-mono text-veil-text-muted">
                            NODES: 8,492
                        </div>
                        <div className="px-4 py-2 border border-veil-border/50 bg-veil-sub/50 text-xs font-mono text-veil-text-muted">
                            LATENCY: 12ms
                        </div>
                    </div>
                </div>

                {/* Right Content (3D Scene) */}
                <div className="flex-1 relative min-h-[400px]">
                    {/* We use a specific Spline scene that looks abstract/tech */}
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black via-transparent to-transparent"></div>
                </div>
            </div>
        </Card>
    )
}
