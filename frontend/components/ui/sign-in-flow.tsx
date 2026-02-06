"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom"; // Adapted for Vite
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { SplineScene } from "@/components/ui/spline";

// --- Types ---

type Uniforms = {
    [key: string]: {
        value: number[] | number[][] | number;
        type: string;
    };
};

interface ShaderProps {
    source: string;
    uniforms: {
        [key: string]: {
            value: number[] | number[][] | number;
            type: string;
        };
    };
    maxFps?: number;
}

interface SignInPageProps {
    className?: string;
    onLoginSuccess?: (token: string) => void; // Added prop for integration
}

// --- Components ---

export const CanvasRevealEffect = ({
    animationSpeed = 10,
    opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
    colors = [[0, 255, 255]],
    containerClassName,
    dotSize,
    showGradient = true,
    reverse = false,
}: {
    animationSpeed?: number;
    opacities?: number[];
    colors?: number[][];
    containerClassName?: string;
    dotSize?: number;
    showGradient?: boolean;
    reverse?: boolean;
}) => {
    return (
        <div className={cn("h-full relative w-full", containerClassName)}>
            <div className="h-full w-full">
                <DotMatrix
                    colors={colors ?? [[0, 255, 255]]}
                    dotSize={dotSize ?? 3}
                    opacities={
                        opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
                    }
                    shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
                    center={["x", "y"]}
                />
            </div>
            {showGradient && (
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            )}
        </div>
    );
};


interface DotMatrixProps {
    colors?: number[][];
    opacities?: number[];
    totalSize?: number;
    dotSize?: number;
    shader?: string;
    center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
    colors = [[0, 0, 0]],
    opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
    totalSize = 20,
    dotSize = 2,
    shader = "",
    center = ["x", "y"],
}) => {
    const uniforms = React.useMemo(() => {
        let colorsArray = [
            colors[0],
            colors[0],
            colors[0],
            colors[0],
            colors[0],
            colors[0],
        ];
        if (colors.length === 2) {
            colorsArray = [
                colors[0],
                colors[0],
                colors[0],
                colors[1],
                colors[1],
                colors[1],
            ];
        } else if (colors.length === 3) {
            colorsArray = [
                colors[0],
                colors[0],
                colors[1],
                colors[1],
                colors[2],
                colors[2],
            ];
        }
        return {
            u_colors: {
                value: colorsArray.map((color) => [
                    color[0] / 255,
                    color[1] / 255,
                    color[2] / 255,
                ]),
                type: "uniform3fv",
            },
            u_opacities: {
                value: opacities,
                type: "uniform1fv",
            },
            u_total_size: {
                value: totalSize,
                type: "uniform1f",
            },
            u_dot_size: {
                value: dotSize,
                type: "uniform1f",
            },
            u_reverse: {
                value: shader.includes("u_reverse_active") ? 1 : 0,
                type: "uniform1i",
            },
        };
    }, [colors, opacities, totalSize, dotSize, shader]);

    return (
        <Shader
            source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse;

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${center.includes("x")
                    ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                    : ""
                }
            ${center.includes("y")
                    ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                    : ""
                }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2);
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            float animation_speed_factor = 0.5;
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a;
        }`}
            uniforms={uniforms}
            maxFps={60}
        />
    );
};


const ShaderMaterial = ({
    source,
    uniforms,
    maxFps = 60,
}: {
    source: string;
    hovered?: boolean;
    maxFps?: number;
    uniforms: Uniforms;
}) => {
    const { size } = useThree();
    const ref = useRef<THREE.Mesh>(null);
    let lastFrameTime = 0;

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const timestamp = clock.getElapsedTime();

        lastFrameTime = timestamp;

        const material: any = ref.current.material;
        const timeLocation = material.uniforms.u_time;
        timeLocation.value = timestamp;
    });

    const getUniforms = () => {
        const preparedUniforms: any = {};

        for (const uniformName in uniforms) {
            const uniform: any = uniforms[uniformName];

            switch (uniform.type) {
                case "uniform1f":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
                    break;
                case "uniform1i":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
                    break;
                case "uniform3f":
                    preparedUniforms[uniformName] = {
                        value: new THREE.Vector3().fromArray(uniform.value),
                        type: "3f",
                    };
                    break;
                case "uniform1fv":
                    preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
                    break;
                case "uniform3fv":
                    preparedUniforms[uniformName] = {
                        value: uniform.value.map((v: number[]) =>
                            new THREE.Vector3().fromArray(v)
                        ),
                        type: "3fv",
                    };
                    break;
                case "uniform2f":
                    preparedUniforms[uniformName] = {
                        value: new THREE.Vector2().fromArray(uniform.value),
                        type: "2f",
                    };
                    break;
                default:
                    console.error(`Invalid uniform type for '${uniformName}'.`);
                    break;
            }
        }

        preparedUniforms["u_time"] = { value: 0, type: "1f" };
        preparedUniforms["u_resolution"] = {
            value: new THREE.Vector2(size.width * 2, size.height * 2),
        };
        return preparedUniforms;
    };

    const material = useMemo(() => {
        const materialObject = new THREE.ShaderMaterial({
            vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
            fragmentShader: source,
            uniforms: getUniforms(),
            glslVersion: THREE.GLSL3,
            blending: THREE.CustomBlending,
            blendSrc: THREE.SrcAlphaFactor,
            blendDst: THREE.OneFactor,
        });

        return materialObject;
    }, [size.width, size.height, source]);

    return (
        <mesh ref={ref as any}>
            <planeGeometry args={[2, 2]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
    return (
        <div className="absolute inset-0 h-full w-full">
            <Canvas>
                <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
            </Canvas>
        </div>
    );
};

const AnimatedNavLink = ({ href, children, linkKey }: { href: string; children: React.ReactNode; linkKey?: string }) => {
    const defaultTextColor = 'text-gray-300';
    const hoverTextColor = 'text-white';
    const textSizeClass = 'text-sm';

    return (
        <a href={href} className={`group relative inline-block overflow-hidden h-5 ${textSizeClass}`}>
            <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
                <span className={`${defaultTextColor} leading-5`}>{children}</span>
                <span className={`${hoverTextColor} leading-5`}>{children}</span>
            </div>
        </a>
    );
};

function MiniNavbar({ authMode, setAuthMode }: { authMode: 'login' | 'signup'; setAuthMode: (mode: 'login' | 'signup') => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
    const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (shapeTimeoutRef.current) {
            clearTimeout(shapeTimeoutRef.current);
        }

        if (isOpen) {
            setHeaderShapeClass('rounded-xl');
        } else {
            shapeTimeoutRef.current = setTimeout(() => {
                setHeaderShapeClass('rounded-full');
            }, 300);
        }

        return () => {
            if (shapeTimeoutRef.current) {
                clearTimeout(shapeTimeoutRef.current);
            }
        };
    }, [isOpen]);

    const logoElement = (
        <div className="relative w-5 h-5 flex items-center justify-center">
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 top-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 left-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 right-0 top-1/2 transform -translate-y-1/2 opacity-80"></span>
            <span className="absolute w-1.5 h-1.5 rounded-full bg-gray-200 bottom-0 left-1/2 transform -translate-x-1/2 opacity-80"></span>
        </div>
    );

    const navLinksData = [
        { label: 'Manifesto', href: '/mission' },
        { label: 'Protocol', href: '/protocol' },
        { label: 'Connect', href: '#' },
    ];

    return (
        <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       pl-6 pr-6 py-3 backdrop-blur-sm
                       ${headerShapeClass}
                       border border-[#333] bg-[#1f1f1f57]
                       w-[calc(100%-2rem)] sm:w-auto
                       transition-[border-radius] duration-0 ease-in-out`}>

            <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-8">
                <Link to="/" className="flex items-center cursor-pointer">
                    {logoElement}
                </Link>

                <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
                    {navLinksData.map((link) => (
                        <React.Fragment key={link.label}>
                            <AnimatedNavLink href={link.href}>
                                {link.label}
                            </AnimatedNavLink>
                        </React.Fragment>
                    ))}
                </nav>

                <div className="hidden sm:flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={() => setAuthMode('login')}
                        className={`px-4 py-2 sm:px-3 text-xs sm:text-sm border rounded-full transition-colors duration-200 w-full sm:w-auto ${authMode === 'login' ? 'bg-white text-black border-white' : 'bg-[rgba(31,31,31,0.62)] text-gray-300 border-[#333] hover:border-white/50 hover:text-white'}`}
                    >
                        LogIn
                    </button>
                    <button
                        onClick={() => setAuthMode('signup')}
                        className={`px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 w-full sm:w-auto ${authMode === 'signup' ? 'bg-white text-black' : 'text-black bg-gradient-to-br from-gray-100 to-gray-300 hover:from-gray-200 hover:to-gray-400 opacity-80 hover:opacity-100'}`}
                    >
                        Signup
                    </button>
                </div>

                {/* Mobile menu button */}
                <button
                    className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md"
                    onClick={toggleMenu}
                    aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={isOpen}
                >
                    <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                    <span aria-hidden="true">⋯</span>
                </button>
            </div>
        </header>
    );
}

import { loginUser, registerUser } from "../../services/scaffoldService";

export const SignInPage = ({ className, onLoginSuccess }: SignInPageProps) => {
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [step, setStep] = useState<"initial" | "password" | "success">("initial");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form States
    const [name, setName] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);
    const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    // Reset flow when switching modes
    useEffect(() => {
        setStep("initial");
        setPassword("");
        setError(null);
        setReverseCanvasVisible(false);
        setInitialCanvasVisible(true);
    }, [authMode]);

    const handleInitialSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (identifier && (authMode === 'login' || name)) {
            setStep("password");
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length > 0) {
            setIsLoading(true);
            setError(null);

            try {
                let result;
                if (authMode === 'login') {
                    result = await loginUser(identifier, password);
                } else {
                    result = await registerUser(name, identifier, password);
                }

                // Initial success
                triggerSuccess();

                // Persist user info for profile dropdown
                if (result.user) {
                    localStorage.setItem('veil_user_profile', JSON.stringify(result.user));
                }

                // Delay the actual token callback to let animations play
                setTimeout(() => {
                    if (onLoginSuccess) onLoginSuccess(result.token);
                }, 2500);

            } catch (err: any) {
                console.error("Auth failed:", err);
                setError("Authentication Failed: Invalid Credentials");
                setIsLoading(false);
                // Shake effect could go here
            }
        }
    };

    const triggerSuccess = () => {
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => setStep("success"), 2000);
    };

    const handleSuccessContinue = () => {
        // Handled by the timeout in handlePasswordSubmit to ensure token passing
    };

    // Focus password input when step changes
    useEffect(() => {
        if (step === "password") {
            setTimeout(() => {
                passwordInputRef.current?.focus();
            }, 400);
        }
    }, [step]);

    const handleBackClick = () => {
        setStep("initial");
        setPassword("");
        setError(null);
    };

    return (
        <div className={cn("flex w-[100%] flex-col min-h-screen bg-black relative overflow-hidden font-sans", className)}>
            <div className="absolute inset-0 z-0">
                {/* 3D Robot - Interactive and Foreground */}
                <div className="absolute inset-0 z-20 w-full h-full">
                    <SplineScene
                        scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>

                {/* Matrix/Canvas Effect - Background Layer */}
                {initialCanvasVisible && (
                    <div className="absolute inset-0 z-10 mix-blend-screen opacity-30 pointer-events-none">
                        <CanvasRevealEffect
                            animationSpeed={3}
                            containerClassName="bg-black"
                            colors={[[255, 255, 255], [255, 255, 255]]}
                            dotSize={6}
                            reverse={false}
                            opacities={[0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.5]} // Reduced opacity for less distraction
                        />
                    </div>
                )}

                {/* Reverse canvas (appears when code is complete) */}
                {reverseCanvasVisible && (
                    <div className="absolute inset-0 z-10 mix-blend-screen opacity-30 pointer-events-none">
                        <CanvasRevealEffect
                            animationSpeed={4}
                            containerClassName="bg-black"
                            colors={[[255, 255, 255], [255, 255, 255]]}
                            dotSize={6}
                            reverse={true}
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)] z-30 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent z-30 pointer-events-none" />
            </div>

            {/* Content Layer */}
            <div className="relative z-50 flex flex-col flex-1 pointer-events-none">
                <div className="relative z-50 pointer-events-auto">
                    <MiniNavbar authMode={authMode} setAuthMode={setAuthMode} />
                </div>

                {/* Main content container */}
                <div className="flex flex-1 flex-col lg:flex-row pointer-events-none">
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <div className="w-full mt-[100px] max-w-sm pointer-events-auto">
                            <AnimatePresence mode="wait">
                                {step === "initial" ? (
                                    <motion.div
                                        key="initial-step"
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="space-y-6 text-center"
                                    >
                                        <div className="space-y-1">
                                            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white font-sans">
                                                {authMode === 'login' ? 'Welcome Agent' : 'Initialize Agent'}
                                            </h1>
                                            <p className="text-[1.8rem] text-white/70 font-light font-sans">
                                                {authMode === 'login' ? 'Authenticate Identity' : 'Create New Identity'}
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {authMode === 'login' && (
                                                <button className="backdrop-blur-[2px] w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-3 px-4 transition-colors font-sans">
                                                    <span className="text-lg">G</span>
                                                    <span className="text-sm font-medium">Sign in with Google</span>
                                                </button>
                                            )}

                                            {authMode === 'login' && (
                                                <div className="flex items-center gap-4">
                                                    <div className="h-px bg-white/10 flex-1" />
                                                    <span className="text-white/40 text-xs font-mono uppercase tracking-widest">or</span>
                                                    <div className="h-px bg-white/10 flex-1" />
                                                </div>
                                            )}

                                            <form onSubmit={handleInitialSubmit} className="space-y-3" noValidate>
                                                {authMode === 'signup' && (
                                                    <div className="relative">
                                                        <label htmlFor="name-input" className="sr-only">Full Name</label>
                                                        <input
                                                            id="name-input"
                                                            name="name"
                                                            type="text"
                                                            autoComplete="name"
                                                            placeholder="Agent Designation (Name)"
                                                            aria-label="Full Name"
                                                            value={name}
                                                            onChange={(e) => setName(e.target.value)}
                                                            className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-full py-3 pl-6 pr-6 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 text-center placeholder:text-white/20 transition-all font-mono text-sm"
                                                            required
                                                        />
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 relative">
                                                        <label htmlFor="username-input" className="sr-only">Username or Email</label>
                                                        <input
                                                            id="username-input"
                                                            name="username"
                                                            type="text"
                                                            autoComplete="username"
                                                            placeholder="Username"
                                                            aria-label="Username or Email"
                                                            value={identifier}
                                                            onChange={(e) => setIdentifier(e.target.value)}
                                                            className="w-full backdrop-blur-[1px] bg-white/5 text-white border border-white/10 rounded-full py-3 pl-6 pr-6 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 text-center placeholder:text-white/20 transition-all font-mono text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        aria-label="Continue to password"
                                                        className="text-white w-12 h-12 shrink-0 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors group overflow-hidden border border-white/10"
                                                    >
                                                        <span className="relative w-full h-full block overflow-hidden" aria-hidden="true">
                                                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-full">→</span>
                                                            <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 -translate-x-full group-hover:translate-x-0">→</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </form>
                                            <div className="text-center">
                                                <Link to="/forgot-password" className="text-xs text-white/40 hover:text-white transition-colors">Forgot Credentials?</Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : step === "password" ? (
                                    <motion.div
                                        key="password-step"
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 50 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="space-y-6 text-center"
                                    >
                                        <div className="space-y-1">
                                            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white">
                                                {authMode === 'login' ? 'Security Check' : 'Set Credentials'}
                                            </h1>
                                            <p className="text-[1.25rem] text-white/50 font-light">
                                                {authMode === 'login' ? 'Enter access passphrase' : 'Create strong passphrase'}
                                            </p>
                                        </div>

                                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                            <div className="relative">
                                                <label htmlFor="password-input" className="sr-only">Password</label>
                                                <input
                                                    ref={passwordInputRef}
                                                    id="password-input"
                                                    name="password"
                                                    type="password"
                                                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                                                    placeholder="••••••••••••"
                                                    aria-label="Password"
                                                    aria-describedby={error ? 'password-error' : undefined}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    disabled={isLoading}
                                                    className={`w-full backdrop-blur-[1px] bg-white/5 text-white border rounded-full py-3 px-6 focus:outline-none focus:ring-1 focus:ring-white/20 text-center placeholder:text-white/20 transition-all font-mono text-xl tracking-widest ${error ? 'border-red-500/50' : 'border-white/10 focus:border-white/50'
                                                        }`}
                                                    required
                                                    minLength={6}
                                                />
                                                {error && (
                                                    <span id="password-error" role="alert" className="absolute -bottom-6 left-0 w-full text-center text-xs text-red-500 font-mono animate-pulse">{error}</span>
                                                )}
                                            </div>

                                            <div className="flex w-full gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleBackClick}
                                                    disabled={isLoading}
                                                    className="rounded-full bg-white/5 border border-white/10 text-white font-medium px-8 py-3 hover:bg-white/10 transition-colors w-[30%] text-sm disabled:opacity-50"
                                                >
                                                    Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={password.length === 0 || isLoading}
                                                    className={`flex-1 rounded-full font-medium py-3 border transition-all duration-300 text-sm flex items-center justify-center gap-2 ${password.length > 0
                                                        ? "bg-white text-black border-transparent hover:bg-white/90 cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                                        : "bg-[#111] text-white/50 border-white/10 cursor-not-allowed"
                                                        }`}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                                            <span>Verifying...</span>
                                                        </>
                                                    ) : (
                                                        <span>{authMode === 'login' ? 'Verify Identity' : 'Mint Identity'}</span>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success-step"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
                                        className="space-y-6 text-center"
                                    >
                                        <div className="space-y-1">
                                            <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white mb-2">
                                                {authMode === 'login' ? 'Access Granted' : 'Identity Minted'}
                                            </h1>
                                            <p className="text-[1rem] text-veil-trust font-mono tracking-widest uppercase">
                                                {authMode === 'login' ? 'Identity Verified' : 'Registration Complete'}
                                            </p>
                                        </div>

                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                            className="py-6"
                                        >
                                            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-veil-trust to-teal-900 flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.4)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </motion.div>

                                        <motion.button
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 1 }}
                                            disabled={true}
                                            className="w-full rounded-full bg-white text-black font-bold py-4 transition-all duration-300 shadow-lg tracking-wide uppercase text-sm opacity-50 cursor-wait"
                                        >
                                            Redirecting...
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
