
import React, { useEffect, useRef, useMemo } from 'react';

const ALL_SKILLS = [
    "accessibility-compliance", "agent-orchestration", "ai-engineer", "airflow-dag", "angular-migration",
    "anti-reversing", "api-design", "api-documenter", "api-testing", "app-performance",
    "architect-review", "architecture-records", "architecture-patterns", "arm-cortex-expert",
    "async-python", "attack-tree", "auth-patterns", "backend-architect", "backend-security",
    "backtesting", "bash-defensive", "bash-pro", "bats-testing", "bazel-optimization",
    "billing-automation", "binary-analysis", "blockchain-dev", "business-analyst", "c-pro",
    "c4-architecture", "changelog-auto", "cicd-automation", "cloud-architect", "code-docs",
    "refactoring", "technical-debt", "ai-code-review", "code-reviewer", "cleanup-deps",
    "competitive-landscape", "conductor", "content-marketer", "context-driven", "context-manager",
    "cost-optimization", "cpp-pro", "cqrs", "csharp-pro", "customer-support", "data-engineer",
    "data-quality", "data-scientist", "data-storytelling", "db-admin", "db-architect",
    "db-migration", "db-optimizer", "dbt-patterns", "debugger", "defi-templates", "deployment-eng",
    "devops-troubleshooter", "distributed-tracing", "django-pro", "docs-architect", "dotnet-architect",
    "dx-optimizer", "e2e-testing", "elixir-pro", "embedding-strategies", "employment-contracts",
    "error-handling", "event-sourcing", "fastapi-pro", "firmware-analyst", "flutter-expert",
    "framework-migration", "frontend-dev", "gdpr-handling", "git-workflows", "github-actions",
    "gitlab-ci", "gitops", "go-concurrency", "godot-gdscript", "golang-pro", "grafana",
    "graphql-architect", "haskell-pro", "helm-charts", "hr-pro", "hybrid-cloud", "incident-response",
    "ios-developer", "istio", "java-pro", "javascript-pro", "julia-pro", "k8s-manifests",
    "k8s-security", "kpi-dashboard", "kubernetes-architect", "langchain", "legacy-modernizer",
    "linkerd", "llm-dev", "machine-learning", "malware-analyst", "market-sizing", "memory-forensics",
    "mermaid-expert", "microservices", "minecraft-bukkit", "ml-engineer", "mlops", "mobile-dev",
    "monorepo-architect", "mtls", "multi-cloud", "network-engineer", "nextjs-router", "nft-standards",
    "nodejs-patterns", "nx-workspace", "observability", "openapi-spec", "payment-integration",
    "pci-compliance", "performance-eng", "php-pro", "posix-shell", "postgresql", "postmortem",
    "prometheus", "prompt-engineer", "protocol-reverse", "python-pro", "quant-analyst",
    "rag-impl", "react-modernization", "react-native", "react-state", "reverse-engineer",
    "risk-manager", "ruby-pro", "rust-async", "rust-pro", "saga-pattern", "sales-automator",
    "sast-config", "scala-pro", "search-specialist", "secrets-mgmt", "security-auditor",
    "seo-strategist", "service-mesh", "solidity", "spark-opt", "sql-pro", "startup-analyst",
    "stripe-integration", "tailwind-system", "tdd-orchestrator", "team-collaboration",
    "temporal-pro", "terraform", "test-automator", "threat-modeling", "turborepo", "typescript-pro",
    "ui-ux-designer", "unity-dev", "uv-manager", "vector-db", "wcag-audit", "web3-testing",
    "workflow-patterns"
];

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    text: string;
    size: number;
    opacity: number;
}

const SkillConstellation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Create a stable set of particles
    const particles = useMemo(() => {
        return ALL_SKILLS.map(() => ({
            x: Math.random() * 2000,
            y: Math.random() * 1000,
            vx: (Math.random() - 0.5) * 0.2, // Very slow movement
            vy: (Math.random() - 0.5) * 0.2,
            text: ALL_SKILLS[Math.floor(Math.random() * ALL_SKILLS.length)],
            size: Math.random() * 10 + 8, // Font size range
            opacity: Math.random() * 0.3 + 0.1 // Opacity range
        }));
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let mouseX = 0;
        let mouseY = 0;

        const handleResize = () => {
            if (containerRef.current && canvas) {
                canvas.width = containerRef.current.clientWidth;
                canvas.height = containerRef.current.clientHeight;
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        };

        // Initial sizing
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        const render = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const width = canvas.width;
            const height = canvas.height;

            // Draw connections first (background layer)
            ctx.lineWidth = 0.5;

            // Update and Draw Particles
            particles.forEach((p, i) => {
                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around screen
                if (p.x < -50) p.x = width + 50;
                if (p.x > width + 50) p.x = -50;
                if (p.y < -50) p.y = height + 50;
                if (p.y > height + 50) p.y = -50;

                // Mouse interaction (gentle push)
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    p.x += dx * force * 0.02;
                    p.y += dy * force * 0.02;
                }

                // Draw Text
                ctx.font = `${p.size}px "JetBrains Mono", monospace`;
                ctx.fillStyle = `rgba(100, 200, 255, ${p.opacity})`;
                ctx.fillText(p.text, p.x, p.y);

                // Connect to nearby - ONLY if close enough to save perf
                // Optimized: only check next few particles to avoid O(N^2) on strictly everything
                for (let j = i + 1; j < particles.length; j += 5) {
                    const p2 = particles[j];
                    const distSq = (p.x - p2.x) ** 2 + (p.y - p2.y) ** 2;
                    if (distSq < 20000) { // approx 140px distance
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * (1 - distSq / 20000)})`; // Fade out
                        ctx.moveTo(p.x + p.text.length * 4, p.y - 4); // Approximate center of text
                        ctx.lineTo(p2.x + p2.text.length * 4, p2.y - 4);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particles]);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 bg-[#030712] pointer-events-none">
            {/* Deep Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1e] via-[#030712] to-black opacity-80" />

            <canvas
                ref={canvasRef}
                className="absolute inset-0 block"
                style={{ filter: 'blur(0.5px)' }} // Slight blur for depth
            />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>
    );
};

export default SkillConstellation;
