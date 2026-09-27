import React, { useState, useEffect } from 'react';
import { PetState } from '../types';

export interface PetAvatar2DProps {
  pet: PetState;
  size?: number; // size in px, default 112
  isAnimated?: boolean;
  isWalking?: boolean;
  behavior?: 'idle' | 'walking' | 'studying' | 'cramming' | 'caffeine_boost' | 'sleeping' | 'stunt_backflip' | 'stunt_spin' | 'stunt_zoomies';
}

export const PetAvatar2D: React.FC<PetAvatar2DProps> = ({ 
  pet, 
  size = 112,
  isAnimated = true,
  isWalking = true,
  behavior = 'idle'
}) => {
  const [frame, setFrame] = useState<number>(0);

  // Frame cycling for pixel animation
  useEffect(() => {
    if (!isAnimated) return;
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 220);
    return () => clearInterval(interval);
  }, [isAnimated]);

  const species = (pet.species || 'cat') as 'cat' | 'dog' | 'rabbit' | 'parrot';
  const legPhase = (frame % 2 === 0) && (isWalking || isAnimated);
  const isSleeping = behavior === 'sleeping';

  const isCat = species === 'cat';
  const isDog = species === 'dog';
  const isRabbit = species === 'rabbit';
  const isParrot = species === 'parrot';

  // Base colors
  const mainColor = isCat ? (pet.color || '#a855f7') :
                    isDog ? '#f59e0b' :
                    isRabbit ? '#f1f5f9' : '#10b981'; // Parrot emerald green

  const darkColor = isCat ? '#581c87' :
                    isDog ? '#b45309' :
                    isRabbit ? '#cbd5e1' : '#047857';

  return (
    <div 
      style={{ width: `${size}px`, height: `${size}px` }} 
      className={`relative select-none pointer-events-none transition-transform duration-300 filter drop-shadow-[0_8px_24px_rgba(168,85,247,0.4)] ${
        isAnimated ? 'hover:scale-105' : ''
      }`}
    >
      <svg
        viewBox="0 0 28 24"
        className="w-full h-full overflow-visible"
        style={{
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges'
        }}
      >
        {/* ================= BACK ACCESSORIES ================= */}
        {pet.equipped?.back === 'astral_cape' && (
          <g className={isAnimated ? 'animate-pulse' : ''}>
            <rect x="18" y="9" width="6" height="9" fill="#9333ea" />
            <rect x="21" y="12" width="4" height="7" fill="#6366f1" />
            <rect x="20" y="10" width="1" height="1" fill="#ffffff" />
            <rect x="23" y="14" width="1" height="1" fill="#fef08a" />
          </g>
        )}

        {pet.equipped?.back === 'jetpack' && (
          <g>
            <rect x="17" y="6" width="3" height="7" fill="#94a3b8" />
            <rect x="18" y="13" width="2" height="2" fill="#38bdf8" />
            {isAnimated && <rect x="18" y="15" width="2" height="3" fill="#f59e0b" />}
          </g>
        )}

        {pet.equipped?.back === 'angel_wings' && (
          <g className={isAnimated ? 'animate-bounce-gentle' : ''}>
            <rect x="18" y="4" width="3" height="6" fill="#ffffff" />
            <rect x="21" y="2" width="3" height="5" fill="#f8fafc" />
            <rect x="24" y="3" width="2" height="3" fill="#e2e8f0" />
          </g>
        )}

        {/* ================= 1. SPECIES ANATOMY ================= */}

        {/* --- 🐱 PIXEL CAT --- */}
        {isCat && (
          <g>
            {/* Curled Tail */}
            <rect x="22" y="11" width="2" height="3" fill={mainColor} />
            <rect x="23" y={legPhase ? "8" : "9"} width="2" height="4" fill={mainColor} />
            <rect x="24" y={legPhase ? "6" : "7"} width="2" height="3" fill="#ffffff" />

            {/* Torso & Belly */}
            <rect x="8" y="9" width="14" height="8" fill={mainColor} />
            <rect x="10" y="12" width="9" height="5" fill="#ffffff" />

            {/* 4 Stepping Legs */}
            <rect x={legPhase ? "19" : "17"} y="15" width="2" height="4" fill={darkColor} />
            <rect x={legPhase ? "9" : "11"} y="15" width="2" height="4" fill={darkColor} />
            <rect x={legPhase ? "16" : "18"} y="15" width="3" height="4" fill={mainColor} />
            <rect x={legPhase ? "10" : "8"} y="15" width="3" height="4" fill={mainColor} />
            <rect x={legPhase ? "16" : "18"} y="18" width="3" height="1" fill="#ffffff" />
            <rect x={legPhase ? "10" : "8"} y="18" width="3" height="1" fill="#ffffff" />

            {/* Head, Triangular Ears & Whiskers */}
            <rect x="3" y="2" width="3" height="4" fill={mainColor} />
            <rect x="4" y="3" width="1" height="2" fill="#f472b6" />
            <rect x="8" y="2" width="3" height="4" fill={mainColor} />
            <rect x="9" y="3" width="1" height="2" fill="#f472b6" />
            <rect x="2" y="5" width="10" height="8" fill={mainColor} />

            {/* Eyes */}
            {isSleeping ? (
              <>
                <rect x="3" y="8" width="3" height="1" fill="#1e1035" />
                <rect x="7" y="8" width="3" height="1" fill="#1e1035" />
              </>
            ) : (
              <>
                <rect x="3" y="7" width="2" height="3" fill="#1e1035" />
                <rect x="3" y="7" width="1" height="2" fill="#38bdf8" />
                <rect x="7" y="7" width="2" height="3" fill="#1e1035" />
                <rect x="7" y="7" width="1" height="2" fill="#38bdf8" />
              </>
            )}

            {/* Nose & Whiskers */}
            <rect x="5" y="9" width="1" height="1" fill="#f43f5e" />
            <rect x="0" y="8" width="2" height="1" fill="#ffffff" />
            <rect x="0" y="10" width="2" height="1" fill="#ffffff" />
          </g>
        )}

        {/* --- 🐶 PIXEL DOG (Study Pup) --- */}
        {isDog && (
          <g>
            {/* Wagging Tail */}
            <rect x="22" y={legPhase ? "7" : "10"} width="2" height="4" fill={mainColor} />
            <rect x="23" y={legPhase ? "5" : "8"} width="2" height="3" fill="#fef08a" />

            {/* Torso & Cream Belly */}
            <rect x="8" y="9" width="14" height="8" fill={mainColor} />
            <rect x="11" y="12" width="8" height="5" fill="#fef08a" />

            {/* Stepping Paws */}
            <rect x={legPhase ? "19" : "17"} y="15" width="2" height="4" fill={darkColor} />
            <rect x={legPhase ? "9" : "11"} y="15" width="2" height="4" fill={darkColor} />
            <rect x={legPhase ? "16" : "18"} y="15" width="3" height="4" fill={mainColor} />
            <rect x={legPhase ? "10" : "8"} y="15" width="3" height="4" fill={mainColor} />

            {/* Floppy Ears */}
            <rect x="1" y="5" width="3" height="6" fill={darkColor} />
            <rect x="9" y="5" width="3" height="6" fill={darkColor} />

            {/* Head & Snout */}
            <rect x="3" y="4" width="8" height="8" fill={mainColor} />
            <rect x="1" y="8" width="4" height="4" fill="#fef08a" />
            <rect x="0" y="8" width="2" height="2" fill="#1e1035" />
            <rect x="1" y="10" width="2" height="2" fill="#f43f5e" />

            {/* Eyes */}
            {isSleeping ? (
              <>
                <rect x="4" y="7" width="3" height="1" fill="#1e1035" />
                <rect x="7" y="7" width="3" height="1" fill="#1e1035" />
              </>
            ) : (
              <>
                <rect x="4" y="6" width="2" height="2" fill="#1e1035" />
                <rect x="4" y="6" width="1" height="1" fill="#ffffff" />
                <rect x="7" y="6" width="2" height="2" fill="#1e1035" />
                <rect x="7" y="6" width="1" height="1" fill="#ffffff" />
              </>
            )}
          </g>
        )}

        {/* --- 🐰 PIXEL RABBIT (Cram Bunny) --- */}
        {isRabbit && (
          <g>
            {/* Fluffy Cotton Tail */}
            <rect x="22" y="11" width="3" height="3" fill="#ffffff" />

            {/* Compact Body */}
            <rect x="8" y="9" width="14" height="8" fill={mainColor} />
            <rect x="9" y="11" width="11" height="6" fill="#ffffff" />

            {/* Back & Front Paws */}
            <rect x={legPhase ? "18" : "16"} y="15" width="4" height="4" fill={mainColor} />
            <rect x={legPhase ? "9" : "11"} y="15" width="2" height="4" fill={mainColor} />

            {/* Tall Upright Bunny Ears */}
            <rect x="3" y="-3" width="2" height="8" fill={mainColor} />
            <rect x="4" y="-1" width="1" height="5" fill="#f472b6" />
            <rect x="7" y="-3" width="2" height="8" fill={mainColor} />
            <rect x="8" y="-1" width="1" height="5" fill="#f472b6" />

            {/* Head & Pink Nose */}
            <rect x="2" y="4" width="9" height="8" fill={mainColor} />
            
            {isSleeping ? (
              <>
                <rect x="4" y="7" width="3" height="1" fill="#991b1b" />
                <rect x="7" y="7" width="3" height="1" fill="#991b1b" />
              </>
            ) : (
              <>
                <rect x="4" y="6" width="2" height="2" fill="#e11d48" />
                <rect x="4" y="6" width="1" height="1" fill="#ffffff" />
                <rect x="7" y="6" width="2" height="2" fill="#e11d48" />
                <rect x="7" y="6" width="1" height="1" fill="#ffffff" />
              </>
            )}

            <rect x="5" y="9" width="1" height="1" fill="#f472b6" />
          </g>
        )}

        {/* --- 🦜 PIXEL PARROT (Scholar Parrot) --- */}
        {isParrot && (
          <g>
            {/* Long Emerald Tail Feathers */}
            <rect x="22" y="13" width="4" height="2" fill="#047857" />
            <rect x="24" y="15" width="3" height="4" fill="#3b82f6" />

            {/* Round Bird Body */}
            <rect x="8" y="8" width="13" height="8" fill={mainColor} />
            <rect x="10" y="10" width="7" height="6" fill="#fbbf24" />

            {/* Wing */}
            <g className={isAnimated ? 'anim-wing-flap' : ''}>
              <rect x="11" y="9" width="7" height="5" fill="#047857" />
              <rect x="13" y="12" width="5" height="3" fill="#3b82f6" />
            </g>

            {/* Two Claw Feet */}
            <rect x="12" y="16" width="2" height="3" fill="#f59e0b" />
            <rect x="16" y="16" width="2" height="3" fill="#f59e0b" />

            {/* Scarlet Crest */}
            <rect x="3" y="1" width="4" height="3" fill="#ef4444" />
            <rect x="5" y="0" width="3" height="2" fill="#ef4444" />

            {/* Head & Hooked Beak */}
            <rect x="2" y="3" width="8" height="7" fill={mainColor} />
            <rect x="0" y="6" width="3" height="3" fill="#fbbf24" />
            <rect x="0" y="8" width="2" height="2" fill="#f59e0b" />

            {/* Eye */}
            {isSleeping ? (
              <rect x="4" y="6" width="4" height="1" fill="#1e1035" />
            ) : (
              <>
                <rect x="4" y="5" width="3" height="3" fill="#ffffff" />
                <rect x="5" y="6" width="1" height="1" fill="#1e1035" />
              </>
            )}
          </g>
        )}

        {/* ================= 2. WEARABLE ACCESSORIES ================= */}
        {pet.equipped?.hat === 'wizard_hat' && (
          <g>
            <rect x="2" y="1" width="9" height="2" fill="#581c87" />
            <rect x="4" y="-2" width="5" height="3" fill="#7e22ce" />
            <rect x="5" y="-4" width="3" height="2" fill="#9333ea" />
            <rect x="5" y="0" width="2" height="1" fill="#fbbf24" />
          </g>
        )}

        {pet.equipped?.hat === 'royal_crown' && (
          <g>
            <rect x="3" y="1" width="7" height="3" fill="#fbbf24" />
            <rect x="3" y="-1" width="1" height="2" fill="#f59e0b" />
            <rect x="6" y="-2" width="1" height="3" fill="#fbbf24" />
            <rect x="9" y="-1" width="1" height="2" fill="#f59e0b" />
          </g>
        )}

        {pet.equipped?.hat === 'cyber_hood' && (
          <g>
            <rect x="2" y="1" width="10" height="3" fill="#0284c7" />
            <rect x="1" y="3" width="2" height="6" fill="#0284c7" />
            <rect x="10" y="3" width="2" height="6" fill="#0284c7" />
            <rect x="4" y="1" width="5" height="1" fill="#38bdf8" />
          </g>
        )}

        {pet.equipped?.hat === 'student_cap' && (
          <g>
            <rect x="2" y="2" width="9" height="2" fill="#1e293b" />
            <rect x="4" y="0" width="5" height="2" fill="#334155" />
            <rect x="9" y="1" width="1" height="3" fill="#f59e0b" />
          </g>
        )}

        {pet.equipped?.glasses === 'cyber_shades' && (
          <g>
            <rect x="2" y="6" width="7" height="2" fill="#06b6d4" />
            <rect x="3" y="6" width="4" height="1" fill="#ffffff" />
          </g>
        )}

        {pet.equipped?.glasses === 'wire_frames' && (
          <g>
            <rect x="2" y="6" width="3" height="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
            <rect x="6" y="6" width="3" height="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" />
            <rect x="5" y="7" width="1" height="1" fill="#f59e0b" />
          </g>
        )}

        {pet.equipped?.neck === 'cozy_scarf' && (
          <g>
            <rect x="6" y="9" width="5" height="3" fill="#f472b6" />
            <rect x="7" y="12" width="2" height="4" fill="#ec4899" />
          </g>
        )}

        {pet.equipped?.neck === 'focus_band' && (
          <g>
            <rect x="6" y="9" width="5" height="2" fill="#10b981" />
            <rect x="8" y="10" width="1" height="1" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};
