
import React from 'react';

const ConfettiPiece: React.FC<{ initialX: number, initialY: number, delay: number, color: string, rotation: number }> = ({ initialX, delay, color, rotation }) => (
    <div
        className="absolute w-3 h-5 rounded-sm"
        style={{
            left: `${initialX}%`,
            backgroundColor: color,
            animation: `fall 5s linear ${delay}s infinite`,
            transform: `rotate(${rotation}deg)`,
        }}
    >
        <style>
            {`
                @keyframes fall {
                    0% {
                        transform: translateY(-10vh) rotate(${rotation}deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(${rotation * 5}deg);
                        opacity: 0;
                    }
                }
            `}
        </style>
    </div>
);


const Celebration: React.FC = () => {
    const confettiColors = ['#fde047', '#f97316', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];
    const confettiCount = 50;

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center z-50 pointer-events-none">
            {Array.from({ length: confettiCount }).map((_, i) => (
                <ConfettiPiece
                    key={i}
                    initialX={Math.random() * 100}
                    initialY={Math.random() * -20}
                    delay={Math.random() * 5}
                    color={confettiColors[i % confettiColors.length]}
                    rotation={Math.random() * 360}
                />
            ))}
            <div className="text-center bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl animate-bounce-in">
                <h2 className="text-5xl font-black text-amber-900">Geschafft!</h2>
                <p className="mt-2 text-xl text-slate-700">Das Vogelhaus ist fertiggestellt!</p>
            </div>
             <style>
                {`
                    @keyframes bounce-in {
                        0% {
                            transform: scale(0.5);
                            opacity: 0;
                        }
                        70% {
                            transform: scale(1.05);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(1);
                        }
                    }
                    .animate-bounce-in {
                        animation: bounce-in 0.7s ease-out forwards;
                    }
                `}
            </style>
        </div>
    );
};

export default Celebration;
