import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">SYSTEM FAILURE</h1>
                    <p className="mb-8 text-gray-400">The landing page crashed.</p>
                    <div className="bg-gray-900 p-6 rounded border border-gray-800 max-w-2xl w-full overflow-auto">
                        <p className="text-red-400 font-bold mb-2">{this.state.error?.toString()}</p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
