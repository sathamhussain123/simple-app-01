"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    if (pathname === '/login') return null;

    const userRole = (session?.user as any)?.role || 'STAFF';

    const links = [
        { href: "/pos", label: "Items", icon: "⚡", roles: ['ADMIN', 'STAFF'] },
        { href: "/dashboard", label: "Intelligence", icon: "📡", roles: ['ADMIN'] },
        { href: "/products", label: "Databanks", icon: "🗄️", roles: ['ADMIN'] },
        { href: "/reports", label: "Ledger", icon: "📜", roles: ['ADMIN', 'STAFF'] },
    ];

    const visibleLinks = links.filter(link => link.roles.includes(userRole));

    return (
        <div className="w-72 glass-panel border-r border-slate-800 flex flex-col justify-between py-10 relative z-20">

            {/* Brand */}
            <div className="px-8 mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 tracking-tight">
                        AeroSync <span className="text-indigo-400 px-1 opacity-90 rounded">POS</span>
                    </h1>
                </div>
                <p className="text-slate-500 text-sm font-medium tracking-wide">Smart Checkout Console</p>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-2 px-4 flex-1">
                {visibleLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 relative overflow-hidden
                ${isActive
                                    ? "bg-indigo-500/10 text-indigo-300"
                                    : "hover:bg-slate-800/50 text-slate-400 hover:text-slate-200"
                                }
              `}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`}>
                                {link.icon}
                            </div>
                            <span className={`font-semibold tracking-wide ${isActive ? '' : ''}`}>{link.label}</span>

                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-500 rounded-r-full animate-pulse shadow-[0_0_12px_rgba(99,102,241,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="px-8 mt-auto pt-8 border-t border-slate-800/50">
                <div
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex justify-between items-center p-3 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition cursor-pointer group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-black text-slate-300">
                            {session?.user?.name?.[0] || '🧑‍🍳'}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-200">{session?.user?.name || 'Loading...'}</p>
                            <p className="text-xs text-indigo-400 font-medium font-mono">{userRole}</p>
                        </div>
                    </div>
                    <div className="text-slate-500 group-hover:text-rose-400 font-black px-2 transition">
                        ⏻
                    </div>
                </div>
            </div>
        </div>
    );
}
