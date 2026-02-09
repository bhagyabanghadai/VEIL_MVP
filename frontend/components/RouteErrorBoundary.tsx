/**
 * VEIL Error Boundary Component
 * Handles route errors with proper status codes and user-friendly messages.
 * Based on Context7 React Router v7 patterns.
 */
import React from 'react';
import { useRouteError, isRouteErrorResponse, Link, useNavigate } from 'react-router';
import { AlertTriangle, Home, RefreshCw, Lock, Search } from 'lucide-react';

interface RouteErrorBoundaryProps {
    className?: string;
}

export function RouteErrorBoundary({ className }: RouteErrorBoundaryProps) {
    const error = useRouteError();
    const navigate = useNavigate();

    // Handle Response errors (thrown with status codes)
    if (isRouteErrorResponse(error)) {
        // 404 - Not Found
        if (error.status === 404) {
            return (
                <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                            <Search className="w-10 h-10 text-amber-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
                        <p className="text-xl text-slate-400 mb-6">Page Not Found</p>
                        <p className="text-slate-500 mb-8">
                            The resource you're looking for doesn't exist or has been moved.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        // 401 - Unauthorized
        if (error.status === 401) {
            return (
                <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                            <Lock className="w-10 h-10 text-rose-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">401</h1>
                        <p className="text-xl text-slate-400 mb-6">Unauthorized</p>
                        <p className="text-slate-500 mb-8">
                            Your session has expired or you don't have permission to access this resource.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        // 403 - Forbidden
        if (error.status === 403) {
            return (
                <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                            <Lock className="w-10 h-10 text-orange-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">403</h1>
                        <p className="text-xl text-slate-400 mb-6">Access Denied</p>
                        <p className="text-slate-500 mb-8">
                            You don't have permission to access this resource. Contact your administrator.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        // Generic HTTP error
        return (
            <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-rose-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2">{error.status}</h1>
                    <p className="text-xl text-slate-400 mb-6">{error.statusText || 'Error'}</p>
                    <p className="text-slate-500 mb-8">
                        {error.data || 'An error occurred while processing your request.'}
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Handle JavaScript errors
    if (error instanceof Error) {
        return (
            <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
                <div className="max-w-lg text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-10 h-10 text-rose-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
                    <p className="text-slate-400 mb-6">{error.message}</p>

                    {/* Show stack trace in development */}
                    {import.meta.env.DEV && (
                        <pre className="text-left text-xs text-slate-500 bg-slate-800 p-4 rounded-lg overflow-auto max-h-48 mb-6">
                            {error.stack}
                        </pre>
                    )}

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reload Page
                        </button>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Unknown error type
    return (
        <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-6 ${className}`}>
            <div className="max-w-md text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-rose-400" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-4">Unknown Error</h1>
                <p className="text-slate-400 mb-8">An unexpected error occurred.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default RouteErrorBoundary;
