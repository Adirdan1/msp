'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function UserProfile() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-hover)] animate-pulse" />
            </div>
        );
    }

    if (!session) {
        return (
            <Link
                href="/auth/signin"
                className="btn btn-primary btn-sm"
            >
                Sign In
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            {session.user?.image ? (
                <img
                    src={session.user.image}
                    alt={session.user.name || 'Profile'}
                    className="w-8 h-8 rounded-full"
                />
            ) : (
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: 'var(--color-accent)' }}
                >
                    {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || 'U'}
                </div>
            )}
            <div className="hidden sm:block">
                <p className="text-sm font-medium truncate max-w-[120px]">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                </p>
            </div>
            <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="btn btn-ghost btn-sm"
                title="Sign out"
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
            </button>
        </div>
    );
}
