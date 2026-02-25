"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password
        });

        if (res?.error) {
            setError("Invalid credentials. Access denied.");
            setLoading(false);
        } else {
            router.push("/pos");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">

            {/* Animated Background Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

            <div className="glass-panel w-full max-w-md p-10 rounded-3xl relative z-10 shadow-[0_0_50px_rgba(79,70,229,0.15)] ring-1 ring-white/10 backdrop-blur-2xl">

                <div className="flex flex-col items-center mb-10">
                    <div className="h-16 w-16 mb-6 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-xl shadow-indigo-500/30 flex items-center justify-center animate-in zoom-in duration-500">
                        <span className="text-white font-black text-3xl">A</span>
                    </div>
                    <div className="text-center animate-in slide-in-from-bottom-2 duration-500">
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
                            SATHAM HUSSAIN-AeroSync <span className="text-indigo-400 px-1 opacity-90 rounded">Core</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium tracking-wide mt-2">Identify yourself to proceed.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                    {error && (
                        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm text-center font-bold font-mono tracking-tight animate-in shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-indigo-400 transition">👤</span>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/80 p-4 pl-12 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition shadow-inner font-mono text-sm"
                                placeholder="sysadmin@aerosync.com"
                            />
                        </div>

                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg group-focus-within:text-sky-400 transition">🔑</span>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700/80 p-4 pl-12 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 transition shadow-inner font-mono text-sm"
                                placeholder="[DECRYPT KEY]"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full py-4 rounded-xl flex justify-center items-center text-sm font-black tracking-widest uppercase transition-all overflow-hidden
                         disabled:opacity-70 disabled:cursor-not-allowed
                         bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white
                         shadow-[0_0_20px_rgba(99,102,241,0.4)]
                         border border-indigo-400/50 hover:border-white/50
                         active:scale-95 duration-200 mt-8"
                    >
                        <span className="relative z-10">
                            {loading ? "AUTHORIZING..." : "AUTHENTICATE CONNECTION"}
                        </span>
                    </button>

                    <div className="text-center space-y-2 pt-4">
                        <p className="text-xs text-slate-600 font-mono">Master: admin@vapor.com / master123</p>
                        <p className="text-xs text-slate-600 font-mono">Worker: staff@vapor.com / worker123</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
