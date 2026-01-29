'use client';

import { useEffect, useState } from 'react';

interface StreakCelebrationProps {
    isActive: boolean;
    onComplete: () => void;
}

export function StreakCelebration({ isActive, onComplete }: StreakCelebrationProps) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isActive) {
            setShow(true);
            const timer = setTimeout(() => {
                setShow(false);
                setTimeout(onComplete, 500); // Wait for exit animation
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isActive, onComplete]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn" />

            <div className="relative z-10 flex flex-col items-center justify-center animate-scaleIn">
                {/* Fire Animation Effect */}
                <div className="relative w-48 h-48 mb-8">
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse-fast">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]">
                            <path
                                d="M12 22c4.97 0 9-4.03 9-9 0-4.97-9-13-9-13S3 8.03 3 13c0 4.97 4.03 9 9 9z"
                                fill="currentColor"
                                className="animate-fire-base"
                            />
                            <path
                                d="M12 18c3.31 0 6-2.69 6-6 0-3.31-6-10-6-10S6 8.69 6 12c0 3.31 2.69 6 6 6z"
                                fill="#fcb045"
                                className="animate-fire-middle"
                            />
                            <path
                                d="M12 14c1.66 0 3-1.34 3-3 0-1.66-3-6-3-6S9 9.34 9 11c0 1.66 1.34 3 3 3z"
                                fill="#fff"
                                className="animate-fire-inner"
                            />
                        </svg>
                    </div>

                    {/* Floating Sparks */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-spark"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: '80%',
                                    animationDelay: `${Math.random() * 1}s`,
                                    opacity: 0
                                }}
                            />
                        ))}
                    </div>
                </div>

                <h2 className="text-4xl font-bold text-white mb-2 text-center drop-shadow-lg">
                    Daily Goal Reached!
                </h2>
                <div className="text-2xl font-mono text-orange-400 font-bold animate-bounce">
                    STREAK EXTENDED 🔥
                </div>
            </div>

            <style jsx>{`
                @keyframes fire-base {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                @keyframes fire-middle {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(0.95) translateY(2px); }
                }
                @keyframes fire-inner {
                    0%, 100% { transform: scale(1) translateY(0); }
                    50% { transform: scale(1.1) translateY(-2px); }
                }
                @keyframes spark {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-60px) scale(0); opacity: 0; }
                }
                .animate-fire-base { animation: fire-base 1s ease-in-out infinite alternate; }
                .animate-fire-middle { animation: fire-middle 1.5s ease-in-out infinite alternate; }
                .animate-fire-inner { animation: fire-inner 0.5s ease-in-out infinite alternate; }
                .animate-spark { animation: spark 1s linear infinite; }
            `}</style>
        </div>
    );
}
