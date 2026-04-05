'use client';

import { useEffect, useState } from 'react';

const BOOT_MESSAGES = [
    { text: 'BIOS v4.2.0 — ROOKS SYSTEMS INTERNATIONAL', delay: 0 },
    { text: 'POST CHECK... OK', delay: 300 },
    { text: 'DETECTING REACT HOOKS SUBSYSTEM... FOUND', delay: 700 },
    { text: 'INITIALIZING CTO NEURAL NETWORK...', delay: 1100 },
    { text: 'LOADING GENIUS ALGORITHMS... [██████████] 100%', delay: 1600 },
    { text: 'CALIBRATING 10X DEVELOPER VIBES...', delay: 2000 },
    { text: 'DEPLOYING INFINITE WISDOM...', delay: 2350 },
    { text: 'SYNCING WITH THE COSMIC HOOK REGISTRY...', delay: 2700 },
    { text: 'OVERCLOCK MODE: ENGAGED', delay: 3050 },
    { text: 'WARNING: GENIUS LEVELS EXCEEDING SAFE LIMITS', delay: 3300 },
    { text: 'SUPPRESSING EGO OVERFLOW... FAILED', delay: 3600 },
    { text: 'ALL SYSTEMS NOMINAL. LAUNCHING ROOKS... ', delay: 4000 },
];

export function BootSequence() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    const [shownCount, setShownCount] = useState(0);

    useEffect(() => {
        // Show messages one by one based on their delay
        const timers: ReturnType<typeof setTimeout>[] = [];

        BOOT_MESSAGES.forEach((_, i) => {
            const t = setTimeout(() => {
                setShownCount(i + 1);
            }, BOOT_MESSAGES[i].delay);
            timers.push(t);
        });

        // Start fade-out at 4.8s, remove at 5.5s
        const fadeTimer = setTimeout(() => setFadeOut(true), 4800);
        const removeTimer = setTimeout(() => setVisible(false), 5500);
        timers.push(fadeTimer, removeTimer);

        return () => timers.forEach(clearTimeout);
    }, []);

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                backgroundColor: '#000',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '10vw',
                fontFamily: '"Courier New", Courier, monospace',
                opacity: fadeOut ? 0 : 1,
                transition: fadeOut ? 'opacity 0.7s ease-in-out' : 'none',
                pointerEvents: fadeOut ? 'none' : 'all',
            }}
        >
            {/* Scanline overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)',
                    pointerEvents: 'none',
                }}
            />

            {/* CRT flicker */}
            <style>{`
                @keyframes flicker {
                    0%   { opacity: 1; }
                    92%  { opacity: 1; }
                    93%  { opacity: 0.85; }
                    94%  { opacity: 1; }
                    96%  { opacity: 0.9; }
                    100% { opacity: 1; }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
                @keyframes bootFadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .boot-screen-inner {
                    animation: flicker 3s infinite;
                }
                .boot-line {
                    animation: bootFadeIn 0.15s ease-out both;
                }
                .boot-cursor {
                    display: inline-block;
                    width: 10px;
                    height: 1.1em;
                    background: #00ff00;
                    vertical-align: text-bottom;
                    animation: blink 1s step-start infinite;
                    margin-left: 2px;
                }
            `}</style>

            <div className="boot-screen-inner" style={{ width: '100%', maxWidth: '900px' }}>
                {/* Logo header */}
                <div
                    style={{
                        color: '#00ff00',
                        fontSize: 'clamp(10px, 2vw, 18px)',
                        marginBottom: '2em',
                        letterSpacing: '0.15em',
                        opacity: 0.6,
                    }}
                >
                    ██████╗  ██████╗  ██████╗ ██╗  ██╗███████╗
                    <br />
                    ██╔══██╗██╔═══██╗██╔═══██╗██║ ██╔╝██╔════╝
                    <br />
                    ██████╔╝██║   ██║██║   ██║█████╔╝ ███████╗
                    <br />
                    ██╔══██╗██║   ██║██║   ██║██╔═██╗ ╚════██║
                    <br />
                    ██║  ██║╚██████╔╝╚██████╔╝██║  ██╗███████║
                    <br />
                    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝
                </div>

                {/* Boot messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35em' }}>
                    {BOOT_MESSAGES.slice(0, shownCount).map((msg, i) => (
                        <div
                            key={i}
                            className="boot-line"
                            style={{
                                color: i === shownCount - 1 ? '#00ff00' : 'rgba(0,255,0,0.65)',
                                fontSize: 'clamp(11px, 1.5vw, 15px)',
                                letterSpacing: '0.08em',
                                lineHeight: 1.6,
                            }}
                        >
                            <span style={{ color: 'rgba(0,255,0,0.35)', marginRight: '1em' }}>
                                [{String(i).padStart(2, '0')}]
                            </span>
                            {msg.text}
                            {i === shownCount - 1 && <span className="boot-cursor" />}
                        </div>
                    ))}
                </div>

                {/* Bottom status bar */}
                <div
                    style={{
                        marginTop: '3em',
                        borderTop: '1px solid rgba(0,255,0,0.2)',
                        paddingTop: '1em',
                        color: 'rgba(0,255,0,0.4)',
                        fontSize: 'clamp(9px, 1.2vw, 12px)',
                        letterSpacing: '0.12em',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>ROOKS OS v{new Date().getFullYear()}.04 — GENIUS EDITION</span>
                    <span>MEM: 640K (OUGHT TO BE ENOUGH FOR ANYONE)</span>
                </div>
            </div>
        </div>
    );
}
