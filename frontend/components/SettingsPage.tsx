import React from 'react';
import { Settings, Key, Cpu, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SettingsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage system configuration and credentials</p>
                </div>
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
            </div>

            {/* Admin Credentials Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <Key className="w-4 h-4 text-cyan-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Admin Credentials</h3>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Operator ID</label>
                            <input
                                type="text"
                                value="veil_admin"
                                disabled
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Password</label>
                            <input
                                type="password"
                                value="********"
                                disabled
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <button className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-medium text-sm hover:bg-cyan-700 transition-colors">
                        Rotate Security Keys
                    </button>
                </div>
            </div>

            {/* API Integration Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Cpu className="w-4 h-4 text-teal-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">API Integration</h3>
                </div>

                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gemini API Key</label>
                        <div className="flex gap-3">
                            <input
                                type="password"
                                value="AIzaSy...XyZ"
                                disabled
                                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-slate-600 tracking-wider"
                            />
                            <button className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                                Reveal
                            </button>
                        </div>
                        <p className="text-sm text-slate-400">
                            Linked to Project: <span className="text-slate-600 font-medium">Limitless_V99</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Security Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-slate-800">Security Status</h3>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <div>
                            <div className="text-sm font-medium text-emerald-800">All Systems Secure</div>
                            <div className="text-xs text-emerald-600">7 security layers active</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
