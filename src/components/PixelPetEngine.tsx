import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

export type AnimalBehavior = 
  | 'idle'
  | 'walking'
  | 'studying'
  | 'cramming'
  | 'procrastinating'
  | 'caffeine_boost'
  | 'sleeping'
  | 'dangling'
  | 'falling'
  | 'stunt_backflip'
  | 'stunt_spin'
  | 'stunt_zoomies';

export interface PixelVitals {
  hunger: number;    // 0 = full, 100 = starving
  energy: number;    // 0 = exhausted, 100 = hyper
  happiness: number; // 0 = sad, 100 = ecstatic
  stress: number;    // 0 = zen, 100 = panic
}

interface PixelPetEngineProps {
  onPetClick?: () => void;
  pixelSize?: number; // size in pixels, default 80
  scale?: number;     // legacy scale multiplier fallback
}

export const PixelPetEngine: React.FC<PixelPetEngineProps> = ({ 
  onPetClick, 
  pixelSize = 80,
  scale = 2 
}) => {
  const { pet, feedPet, showToast, setPetSpecies, userCoins } = useEdzen();

  // Dimensions in pixels (crisp 5x integer scaling of 16x16 pixel grid)
  const petWidth = pixelSize;
  const petHeight = pixelSize;
  const floorOffset = 70;

  // Position & Physics state
  const posRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 180 : 600,
    y: typeof window !== 'undefined' ? window.innerHeight - 160 : 500,
  });
  const velRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const targetPosRef = useRef<{ x: number; y: number }>({ x: posRef.current.x, y: posRef.current.y });

  // Render state for React
  const [renderPos, setRenderPos] = useState({ x: posRef.current.x, y: posRef.current.y });
  const [facing, setFacing] = useState<'left' | 'right'>('left');
  const [behavior, setBehavior] = useState<AnimalBehavior>('idle');
  const [frame, setFrame] = useState<number>(0);
  const [bubbleIcon, setBubbleIcon] = useState<string | null>(null);
  const [studentActionLabel, setStudentActionLabel] = useState<string>('Deep Study Session');
  const [showInteractiveMenu, setShowInteractiveMenu] = useState<boolean>(false);
  const isMenuOpenRef = useRef<boolean>(false);

  // When interactive option menu is open, freeze pet completely still
  useEffect(() => {
    isMenuOpenRef.current = showInteractiveMenu;
    if (showInteractiveMenu) {
      velRef.current = { vx: 0, vy: 0 };
      targetPosRef.current = { x: posRef.current.x, y: posRef.current.y };
      setBehavior('idle');
    }
  }, [showInteractiveMenu]);

  // Life Vitals (Student-centric)
  const vitalsRef = useRef<PixelVitals>({
    hunger: 20,
    energy: 85,
    happiness: 90,
    stress: 25
  });

  // Dragging & Stunt Physics
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prevMouseRef = useRef<{ x: number; y: number; time: number }>({ x: 0, y: 0, time: 0 });
  const throwVelRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastClickTimeRef = useRef<number>(0);

  const behaviorTimerRef = useRef<number>(100);
  const lastFrameTimeRef = useRef<number>(performance.now());

  // Trigger an epic stunt with particles and SFX
  const triggerStunt = useCallback((stuntType?: 'backflip' | 'spin' | 'zoomies') => {
    const selected = stuntType || (['backflip', 'spin', 'zoomies'] as const)[Math.floor(Math.random() * 3)];
    sounds.playPetCheer();

    if (selected === 'backflip') {
      setBehavior('stunt_backflip');
      setBubbleIcon('⭐');
      setStudentActionLabel(pet.species === 'parrot' ? 'Flip! 🤸' : 'Mid-Air Backflip! 🤸');
      confetti({ particleCount: 6, spread: 30, scalar: 0.6, origin: { y: 0.7 } });
      behaviorTimerRef.current = 65; // ~1.0s
    } else if (selected === 'spin') {
      setBehavior('stunt_spin');
      setBubbleIcon('🎵');
      setStudentActionLabel(pet.species === 'parrot' ? 'Spin! 🕺' : 'Breakdance Spin! 🕺');
      behaviorTimerRef.current = 75; // ~1.2s
    } else {
      setBehavior('stunt_zoomies');
      setBubbleIcon('⚡');
      setStudentActionLabel(pet.species === 'parrot' ? 'Dart! ⚡' : 'Zoomies Energy Sprint! ⚡');
      velRef.current.vx = (facing === 'left' ? -5 : 5);
      behaviorTimerRef.current = 70;
    }
  }, [facing, pet.species]);

  // Trigger Student Life activities directly
  const triggerStudentAction = useCallback((action: 'studying' | 'cramming' | 'caffeine_boost' | 'procrastinating' | 'sleeping') => {
    sounds.playPetCheer();
    velRef.current = { vx: 0, vy: 0 };
    setBehavior(action);

    if (action === 'studying') {
      setBubbleIcon(Math.random() > 0.5 ? '📖' : '💻');
      setStudentActionLabel(
        pet.species === 'parrot' ? 'Recall' :
        pet.species === 'dog' ? 'Pair Programming' :
        pet.species === 'rabbit' ? 'Speed Reading' : 'Deep Study Session'
      );
      behaviorTimerRef.current = 240;
    } else if (action === 'cramming') {
      setBubbleIcon('📝');
      setStudentActionLabel(
        pet.species === 'parrot' ? 'Drill' :
        pet.species === 'rabbit' ? 'Speed-Reading Sprints' :
        pet.species === 'dog' ? 'Algorithm Flashcards' : 'Exam Flashcards Cramming'
      );
      behaviorTimerRef.current = 200;
    } else if (action === 'caffeine_boost') {
      setBubbleIcon('🧋');
      setStudentActionLabel(pet.species === 'parrot' ? 'Sip' : 'Boba / Espresso Energy Re-up');
      vitalsRef.current.energy = Math.min(100, vitalsRef.current.energy + 20);
      behaviorTimerRef.current = 180;
    } else if (action === 'procrastinating') {
      setBubbleIcon('📱');
      setStudentActionLabel(pet.species === 'parrot' ? 'Chirp' : 'Scrolling Student Memes');
      behaviorTimerRef.current = 200;
    } else if (action === 'sleeping') {
      setBubbleIcon('💤');
      setStudentActionLabel(pet.species === 'parrot' ? 'Zzz' : 'Burnout Recovery Nap');
      behaviorTimerRef.current = 320;
    }
  }, [pet.species]);

  // External Action Dispatch Listener
  useEffect(() => {
    const handlePetActionEvent = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      if (detail.type === 'stunt') {
        triggerStunt(detail.stunt);
      } else if (detail.type === 'action') {
        triggerStudentAction(detail.action);
      }
    };
    window.addEventListener('edzen-pet-action', handlePetActionEvent);
    return () => window.removeEventListener('edzen-pet-action', handlePetActionEvent);
  }, [triggerStunt, triggerStudentAction]);

  // ==========================================
  // 1. STUDENT BEHAVIORAL AI & DECISION MATRIX (FULLY AUTOMATIC)
  // ==========================================
  const decideNextStudentBehavior = useCallback(() => {
    const vitals = vitalsRef.current;

    // Burnout power nap if exhausted
    if (vitals.energy < 25) {
      setBehavior('sleeping');
      setBubbleIcon('💤');
      setStudentActionLabel(pet.species === 'parrot' ? 'Zzz' : 'Burnout Desk Nap');
      velRef.current = { vx: 0, vy: 0 };
      behaviorTimerRef.current = 130 + Math.random() * 50;
      return;
    }

    // High chance of spontaneous acrobatic stunt! (28% chance automatically)
    if (Math.random() < 0.28) {
      triggerStunt();
      return;
    }

    const roll = Math.random();

    if (roll < 0.25) {
      // 📚 STUDYING (open laptop / textbook)
      setBehavior('studying');
      setBubbleIcon(Math.random() > 0.5 ? '📖' : '💻');
      setStudentActionLabel(
        pet.species === 'parrot' ? 'Recall' :
        pet.species === 'dog' ? 'Pair Programming' :
        pet.species === 'rabbit' ? 'Speed Reading' : 'Deep Study Session'
      );
      velRef.current = { vx: 0, vy: 0 };
      behaviorTimerRef.current = 120 + Math.random() * 50;
    } else if (roll < 0.46) {
      // 🚶 CAMPUS ROAMING WALK
      setBehavior('walking');
      const minX = 40;
      const maxX = Math.max(minX + 80, window.innerWidth - petWidth - 40);
      const minY = Math.max(80, window.innerHeight - 250);
      const maxY = window.innerHeight - petHeight - floorOffset;

      const targetX = minX + Math.random() * (maxX - minX);
      const targetY = minY + Math.random() * (maxY - minY);

      targetPosRef.current = { x: targetX, y: targetY };
      setFacing(targetX < posRef.current.x ? 'left' : 'right');
      setBubbleIcon(Math.random() > 0.5 ? '🎒' : '🐾');
      setStudentActionLabel(
        pet.species === 'parrot' ? 'Fly' :
        pet.species === 'rabbit' ? 'Hopping to Library' :
        pet.species === 'dog' ? 'Trotting to Class' : 'Walking to Library'
      );
      behaviorTimerRef.current = 110 + Math.random() * 50;
    } else if (roll < 0.66) {
      // ⚡ CRAMMING / FLASHCARDS
      setBehavior('cramming');
      setBubbleIcon('📝');
      setStudentActionLabel(
        pet.species === 'parrot' ? 'Drill' :
        pet.species === 'rabbit' ? 'Speed-Reading Sprints' :
        pet.species === 'dog' ? 'Algorithm Flashcards' : 'Exam Flashcards Cramming'
      );
      velRef.current = { vx: 0, vy: 0 };
      behaviorTimerRef.current = 100 + Math.random() * 45;
    } else if (roll < 0.84) {
      // ☕ BOBA / COFFEE RE-UP
      setBehavior('caffeine_boost');
      setBubbleIcon(Math.random() > 0.5 ? '☕' : '🧋');
      setStudentActionLabel(pet.species === 'parrot' ? 'Sip' : 'Boba / Espresso Re-up');
      velRef.current = { vx: 0, vy: 0 };
      vitals.energy = Math.min(100, vitals.energy + 20);
      behaviorTimerRef.current = 90 + Math.random() * 40;
    } else {
      // 📱 MEME SCROLLING / PROCRASTINATING
      setBehavior('procrastinating');
      setBubbleIcon(Math.random() > 0.5 ? '📱' : '💭');
      setStudentActionLabel(pet.species === 'parrot' ? 'Chirp' : 'Scrolling Student Memes');
      velRef.current = { vx: 0, vy: 0 };
      behaviorTimerRef.current = 100 + Math.random() * 45;
    }
  }, [pet.species, petWidth, petHeight, floorOffset, triggerStunt]);

  // ==========================================
  // 2. 60 FPS REQUEST ANIMATION FRAME PHYSICS LOOP
  // ==========================================
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      lastFrameTimeRef.current = now;

      // Keep pet completely still when selecting options
      if (isMenuOpenRef.current) {
        velRef.current = { vx: 0, vy: 0 };
        setRenderPos({ x: Math.round(posRef.current.x), y: Math.round(posRef.current.y) });
        animId = requestAnimationFrame(tick);
        return;
      }

      // Decrement behavior timer
      if (!isDraggingRef.current && behavior !== 'falling') {
        behaviorTimerRef.current -= 1;
        if (behaviorTimerRef.current <= 0) {
          decideNextStudentBehavior();
        }
      }

      // Life Vitals Drain
      const vitals = vitalsRef.current;
      vitals.hunger = Math.min(100, vitals.hunger + 0.005);
      if (behavior === 'walking' || behavior === 'cramming') {
        vitals.energy = Math.max(0, vitals.energy - 0.01);
      } else if (behavior === 'sleeping') {
        vitals.energy = Math.min(100, vitals.energy + 0.04);
      }

      // PHYSICS COMPUTATIONS
      const pos = posRef.current;
      const vel = velRef.current;
      const groundY = window.innerHeight - petHeight - floorOffset;

      if (isDraggingRef.current) {
        setBehavior('dangling');
        setStudentActionLabel('Suspended in Mid-Air!');
      } else if (behavior === 'falling') {
        vel.vy += 0.58; // gravity
        vel.vx *= 0.98;

        pos.x += vel.vx;
        pos.y += vel.vy;

        // Ground bounce collision
        if (pos.y >= groundY) {
          pos.y = groundY;
          if (Math.abs(vel.vy) > 2) {
            vel.vy = -vel.vy * 0.4;
            sounds.playPetCheer();
          } else {
            vel.vy = 0;
            vel.vx = 0;
            setBehavior('idle');
            setBubbleIcon('✨');
            setStudentActionLabel('Safe Landing!');
            behaviorTimerRef.current = 90;
          }
        }
      } else if (behavior === 'walking' || behavior === 'stunt_zoomies') {
        const dx = targetPosRef.current.x - pos.x;
        const dy = targetPosRef.current.y - pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 6) {
          const speed = behavior === 'stunt_zoomies' ? 3.2 : 1.4;
          vel.vx += ((dx / dist) * speed - vel.vx) * 0.14;
          vel.vy += ((dy / dist) * speed - vel.vy) * 0.14;

          pos.x += vel.vx;
          pos.y += vel.vy;

          if (Math.abs(vel.vx) > 0.2) {
            setFacing(vel.vx < 0 ? 'left' : 'right');
          }
        } else {
          vel.vx = 0;
          vel.vy = 0;
          decideNextStudentBehavior();
        }
      }

      // Viewport Bounds Enforcing
      const padding = 15;
      const minX = padding;
      const maxX = window.innerWidth - petWidth - padding;
      const minY = 65;
      const maxY = window.innerHeight - petHeight - floorOffset;

      if (pos.x < minX) {
        pos.x = minX;
        vel.vx = Math.abs(vel.vx) * 0.5;
        setFacing('right');
      } else if (pos.x > maxX) {
        pos.x = maxX;
        vel.vx = -Math.abs(vel.vx) * 0.5;
        setFacing('left');
      }

      if (pos.y < minY) {
        pos.y = minY;
        vel.vy = Math.abs(vel.vy) * 0.5;
      } else if (pos.y > maxY && behavior !== 'falling') {
        pos.y = maxY;
        vel.vy = 0;
      }

      setRenderPos({ x: Math.round(pos.x), y: Math.round(pos.y) });
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [behavior, decideNextStudentBehavior, petWidth, petHeight, floorOffset]);

  // Sprite animation frame cycling (160ms timer)
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrame(f => (f + 1) % 4);
    }, 160);
    return () => clearInterval(frameInterval);
  }, []);

  // ==========================================
  // 3. INTERACTIVE DRAG & DROP & DOUBLE-CLICK STUNTS
  // ==========================================
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = performance.now();

    // Double-click triggers backflip stunt!
    if (now - lastClickTimeRef.current < 280) {
      triggerStunt('backflip');
      lastClickTimeRef.current = 0;
      return;
    }
    lastClickTimeRef.current = now;

    isDraggingRef.current = true;
    sounds.playPetCheer();
    setBehavior('dangling');
    setBubbleIcon('😲');

    dragStartRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y
    };

    prevMouseRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: now
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const now = performance.now();
      const dt = Math.max(1, now - prevMouseRef.current.time);
      const dx = e.clientX - prevMouseRef.current.x;
      const dy = e.clientY - prevMouseRef.current.y;

      throwVelRef.current = {
        vx: (dx / dt) * 12,
        vy: (dy / dt) * 12
      };

      prevMouseRef.current = { x: e.clientX, y: e.clientY, time: now };

      posRef.current.x = e.clientX - dragStartRef.current.x;
      posRef.current.y = e.clientY - dragStartRef.current.y;
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      velRef.current = {
        vx: Math.max(-11, Math.min(11, throwVelRef.current.vx)),
        vy: Math.max(-9, Math.min(9, throwVelRef.current.vy))
      };
      setBehavior('falling');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const handlePetInteract = (e: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    vitalsRef.current.happiness = Math.min(100, vitalsRef.current.happiness + 20);
    setBubbleIcon('💖');
    velRef.current = { vx: 0, vy: 0 };
    targetPosRef.current = { x: posRef.current.x, y: posRef.current.y };
    setBehavior('idle');
    setShowInteractiveMenu(prev => !prev);
    if (onPetClick) onPetClick();
  };

  // ==========================================
  // 4. RETRO CRISP PIXEL SPRITE RENDER ENGINE
  // ==========================================
  const renderPixelAnimalSprite = () => {
    const species = pet.species as 'cat' | 'dog' | 'rabbit' | 'parrot';
    const legPhase = frame % 2 === 0;
    const isSleeping = behavior === 'sleeping';

    // Palette per species
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
      <svg
        viewBox="0 0 28 24"
        className={`w-full h-full ${
          behavior === 'stunt_backflip' ? 'anim-stunt-backflip' :
          behavior === 'stunt_spin' ? 'anim-stunt-breakdance' :
          behavior === 'stunt_zoomies' ? 'anim-stunt-zoomies' :
          isRabbit && behavior === 'walking' ? 'anim-rabbit-hop' : ''
        }`}
        style={{
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges'
        }}
      >
        {/* ================= BACK ACCESSORIES ================= */}
        {pet.equipped.back === 'astral_cape' && (
          <g>
            <rect x="18" y="9" width="6" height="9" fill="#9333ea" />
            <rect x="21" y="12" width="4" height="7" fill="#6366f1" />
            <rect x="20" y="10" width="1" height="1" fill="#ffffff" />
          </g>
        )}

        {pet.equipped.back === 'jetpack' && (
          <g>
            <rect x="17" y="6" width="3" height="7" fill="#94a3b8" />
            <rect x="18" y="13" width="2" height="2" fill="#38bdf8" />
          </g>
        )}

        {/* ================= 1. SPECIES ANATOMY ================= */}

        {/* --- 🐱 CAT (Feline Student) --- */}
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

            {isSleeping ? (
              <>
                {/* Cat Closed Sleeping Eyes */}
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

            <rect x="5" y="9" width="1" height="1" fill="#f43f5e" />
            <rect x="0" y="8" width="2" height="1" fill="#ffffff" />
            <rect x="0" y="10" width="2" height="1" fill="#ffffff" />
          </g>
        )}

        {/* --- 🐶 DOG (Study Pup - Golden Retriever Energy) --- */}
        {isDog && (
          <g>
            {/* Wagging Happy Tail */}
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

            {/* Floppy Dog Ears */}
            <rect x="1" y="5" width="3" height="6" fill={darkColor} />
            <rect x="9" y="5" width="3" height="6" fill={darkColor} />

            {/* Head & Snout */}
            <rect x="3" y="4" width="8" height="8" fill={mainColor} />
            <rect x="1" y="8" width="4" height="4" fill="#fef08a" />
            <rect x="0" y="8" width="2" height="2" fill="#1e1035" />

            {/* Happy Panting Tongue */}
            <rect x="1" y="10" width="2" height="2" fill="#f43f5e" />

            {/* Friendly Eyes */}
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

        {/* --- 🐰 RABBIT (Cram Bunny - Speed Reader) --- */}
        {isRabbit && (
          <g>
            {/* Fluffy Round Cotton Tail */}
            <rect x="22" y="11" width="3" height="3" fill="#ffffff" />

            {/* Compact Bunny Body */}
            <rect x="8" y="9" width="14" height="8" fill={mainColor} />
            <rect x="9" y="11" width="11" height="6" fill="#ffffff" />

            {/* Back Jumping Paws & Front Paws */}
            <rect x={legPhase ? "18" : "16"} y="15" width="4" height="4" fill={mainColor} />
            <rect x={legPhase ? "9" : "11"} y="15" width="2" height="4" fill={mainColor} />

            {/* Tall Upright Bunny Ears */}
            <rect x="3" y="-3" width="2" height="8" fill={mainColor} />
            <rect x="4" y="-1" width="1" height="5" fill="#f472b6" />
            <rect x="7" y="-3" width="2" height="8" fill={mainColor} />
            <rect x="8" y="-1" width="1" height="5" fill="#f472b6" />

            {/* Head & Twitching Pink Nose */}
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

        {/* --- 🦜 PARROT (Scholar Parrot - Repeats Formulae) --- */}
        {isParrot && (
          <g>
            {/* Long Emerald Tail Feathers */}
            <rect x="22" y="13" width="4" height="2" fill="#047857" />
            <rect x="24" y="15" width="3" height="4" fill="#3b82f6" />

            {/* Round Bird Body */}
            <rect x="8" y="8" width="13" height="8" fill={mainColor} />
            <rect x="10" y="10" width="7" height="6" fill="#fbbf24" />

            {/* Flapping Wing */}
            <g className="anim-wing-flap">
              <rect x="11" y="9" width="7" height="5" fill="#047857" />
              <rect x="13" y="12" width="5" height="3" fill="#3b82f6" />
            </g>

            {/* Two Claw Perching Feet */}
            <rect x="12" y="16" width="2" height="3" fill="#f59e0b" />
            <rect x="16" y="16" width="2" height="3" fill="#f59e0b" />

            {/* Scarlet Crown / Crest */}
            <rect x="3" y="1" width="4" height="3" fill="#ef4444" />
            <rect x="5" y="0" width="3" height="2" fill="#ef4444" />

            {/* Head & Hooked Gold Beak */}
            <rect x="2" y="3" width="8" height="7" fill={mainColor} />
            <rect x="0" y="6" width="3" height="3" fill="#fbbf24" />
            <rect x="0" y="8" width="2" height="2" fill="#f59e0b" />

            {/* Intelligent Eye */}
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

        {/* ================= 2. STUDENT PROPS IN HAND / NEARBY ================= */}

        {/* 💻 Laptop when studying */}
        {behavior === 'studying' && (
          <g>
            <rect x="0" y="11" width="7" height="5" fill="#475569" />
            <rect x="1" y="12" width="5" height="3" fill="#38bdf8" />
            <rect x="0" y="16" width="8" height="1" fill="#94a3b8" />
          </g>
        )}

        {/* 📝 Cramming flashcards & formula */}
        {behavior === 'cramming' && (
          <g>
            <rect x="0" y="10" width="6" height="7" fill="#ffffff" stroke="#94a3b8" strokeWidth="0.5" />
            <rect x="1" y="12" width="4" height="1" fill="#ef4444" />
            <rect x="1" y="14" width="3" height="1" fill="#3b82f6" />
            <rect x="5" y="5" width="6" height="4" fill="#fbbf24" />
            <rect x="6" y="6" width="4" height="2" fill="#1e1035" />
          </g>
        )}

        {/* ☕ Boba / Coffee Cup when caffeinated */}
        {behavior === 'caffeine_boost' && (
          <g>
            <rect x="0" y="11" width="4" height="6" fill="#fef08a" />
            <rect x="1" y="13" width="2" height="3" fill="#78350f" />
            <rect x="1" y="8" width="1" height="3" fill="#ec4899" />
          </g>
        )}

        {/* 📱 Smartphone when procrastinating */}
        {behavior === 'procrastinating' && (
          <g>
            <rect x="1" y="10" width="3" height="6" fill="#1e293b" />
            <rect x="1" y="11" width="3" height="4" fill="#67e8f9" />
          </g>
        )}

        {/* 💤 Floating Zzz when napping */}
        {behavior === 'sleeping' && (
          <g className="animate-bounce">
            <rect x="19" y="3" width="3" height="1" fill="#c084fc" />
            <rect x="21" y="4" width="1" height="1" fill="#c084fc" />
            <rect x="20" y="5" width="1" height="1" fill="#c084fc" />
            <rect x="19" y="6" width="3" height="1" fill="#c084fc" />

            <rect x="23" y="0" width="2" height="1" fill="#a855f7" />
            <rect x="24" y="1" width="1" height="1" fill="#a855f7" />
            <rect x="23" y="2" width="2" height="1" fill="#a855f7" />
          </g>
        )}

        {/* ⭐ Sparkle Stars during Backflip Stunt */}
        {behavior === 'stunt_backflip' && (
          <g>
            <rect x="1" y="2" width="2" height="2" fill="#fbbf24" />
            <rect x="25" y="3" width="2" height="2" fill="#fef08a" />
            <rect x="13" y="-3" width="2" height="2" fill="#f472b6" />
          </g>
        )}

        {/* ⚡ Zoomies Sprint speed streaks */}
        {behavior === 'stunt_zoomies' && (
          <g>
            <rect x="22" y="15" width="5" height="1" fill="#94a3b8" />
            <rect x="24" y="17" width="4" height="1" fill="#cbd5e1" />
            <rect x="21" y="19" width="6" height="1" fill="#f8fafc" />
          </g>
        )}

        {/* ================= 3. WEARABLE ACCESSORIES ================= */}
        {pet.equipped.hat === 'wizard_hat' && (
          <g>
            <rect x="2" y="1" width="9" height="2" fill="#581c87" />
            <rect x="4" y="-2" width="5" height="3" fill="#7e22ce" />
            <rect x="5" y="-4" width="3" height="2" fill="#9333ea" />
            <rect x="5" y="0" width="2" height="1" fill="#fbbf24" />
          </g>
        )}

        {pet.equipped.hat === 'royal_crown' && (
          <g>
            <rect x="3" y="1" width="7" height="3" fill="#fbbf24" />
            <rect x="3" y="-1" width="1" height="2" fill="#f59e0b" />
            <rect x="6" y="-2" width="1" height="3" fill="#fbbf24" />
            <rect x="9" y="-1" width="1" height="2" fill="#f59e0b" />
          </g>
        )}

        {pet.equipped.glasses === 'cyber_shades' && (
          <g>
            <rect x="2" y="6" width="7" height="2" fill="#06b6d4" />
            <rect x="3" y="6" width="4" height="1" fill="#ffffff" />
          </g>
        )}

        {pet.equipped.neck === 'cozy_scarf' && (
          <g>
            <rect x="6" y="9" width="4" height="3" fill="#f472b6" />
            <rect x="7" y="12" width="2" height="4" fill="#ec4899" />
          </g>
        )}
      </svg>
    );
  };

  return (
    <div
      style={{
        left: `${renderPos.x}px`,
        top: `${renderPos.y}px`,
        width: `${petWidth}px`,
        height: `${petHeight}px`
      }}
      className="fixed z-40 cursor-grab active:cursor-grabbing select-none transition-transform"
      onMouseDown={handleMouseDown}
      onClick={handlePetInteract}
      title={`${pet.name} (${studentActionLabel}) — Click to interact! Double-click for Backflip! Toss to throw!`}
    >
      {/* Student Thought / Mood Bubble - Dark Futuristic Liquid Glass (1/3 compact size) */}
      {bubbleIcon && (
        <div 
          className="absolute -top-7 left-1/2 -translate-x-1/2 origin-bottom scale-[0.75] rounded-lg bg-slate-900/95 backdrop-blur-md border border-purple-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)] animate-bounce z-50 pointer-events-none whitespace-nowrap flex items-center px-1.5 py-0.5 text-[8px] gap-1"
        >
          <span className="text-[9px]">{bubbleIcon}</span>
          <span className="font-bold text-white text-[8px] max-w-[70px] truncate">
            {studentActionLabel}
          </span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-slate-900 rotate-45 border-r border-b border-purple-500/50 w-1 h-1" />
        </div>
      )}

      {/* Main Pixel Sprite */}
      <div 
        className={`w-full h-full transition-transform duration-75 ${
          facing === 'right' ? '-scale-x-100' : 'scale-x-100'
        } ${behavior === 'falling' ? 'rotate-12' : ''}`}
      >
        {renderPixelAnimalSprite()}
      </div>

      {/* Ground Shadow */}
      {behavior !== 'dangling' && behavior !== 'falling' && behavior !== 'stunt_backflip' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-purple-950/20 rounded-full blur-[1px] pointer-events-none -z-10" />
      )}

      {/* ================= INTERACTIVE STUDENT & STUNT POPUP MENU (Enlarged, Clear & Spacious) ================= */}
      {showInteractiveMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute -top-72 left-1/2 -translate-x-1/2 w-80 sm:w-88 p-4 bg-slate-950/95 backdrop-blur-3xl border border-purple-500/50 rounded-3xl shadow-[0_16px_50px_rgba(147,51,234,0.4)] text-xs text-white z-50 animate-in fade-in zoom-in duration-150 select-text"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-purple-500/25">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">
                {pet.species === 'cat' ? '🐱' : pet.species === 'dog' ? '🐶' : pet.species === 'rabbit' ? '🐰' : '🦜'}
              </span>
              <div>
                <div className="font-black text-white text-sm flex items-center gap-1.5">
                  <span>{pet.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-400/40 font-bold">
                    Lv.{pet.level}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold leading-tight">{studentActionLabel}</div>
              </div>
            </div>
            <button
              onClick={() => setShowInteractiveMenu(false)}
              className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition text-sm font-bold"
              title="Close menu"
            >
              ✕
            </button>
          </div>

          {/* 1. Species Quick Evolution (Cat, Dog, Rabbit, Parrot) */}
          <div className="mt-2.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Select Pixel Species
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'cat', icon: '🐱', label: 'Cat', perk: 'Habits' },
                { id: 'dog', icon: '🐶', label: 'Dog', perk: 'Focus' },
                { id: 'rabbit', icon: '🐰', label: 'Bunny', perk: 'Speed' },
                { id: 'parrot', icon: '🦜', label: 'Bird', perk: 'Recall' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => {
                    setPetSpecies(s.id as any);
                    showToast(`Evolved to ${s.label}!`);
                  }}
                  className={`p-2 rounded-2xl text-center border transition ${
                    pet.species === s.id
                      ? 'bg-purple-600/35 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)] text-white font-bold'
                      : 'bg-slate-900/70 border-purple-500/20 hover:bg-purple-900/40 text-slate-300'
                  }`}
                  title={`${s.label} (${s.perk})`}
                >
                  <span className="text-xl block">{s.icon}</span>
                  <span className="text-[10px] block font-semibold leading-tight mt-0.5">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Acrobatic Stunts Section */}
          <div className="mt-2.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
              🤸 Acrobatic Stunts
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  triggerStunt('backflip');
                  setShowInteractiveMenu(false);
                }}
                className="py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-300 text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span>🤸 Backflip</span>
              </button>
              <button
                onClick={() => {
                  triggerStunt('spin');
                  setShowInteractiveMenu(false);
                }}
                className="py-1.5 px-2 rounded-xl bg-pink-500/20 hover:bg-pink-500/35 border border-pink-500/40 text-pink-300 text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span>🕺 Dance</span>
              </button>
              <button
                onClick={() => {
                  triggerStunt('zoomies');
                  setShowInteractiveMenu(false);
                }}
                className="py-1.5 px-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/35 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition flex items-center justify-center gap-1 shadow-sm"
              >
                <span>⚡ Zoomies</span>
              </button>
            </div>
          </div>

          {/* 3. Student Habits Section */}
          <div className="mt-2.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
              Student Life Actions
            </span>
            <div className="grid grid-cols-5 gap-1 text-xs">
              <button
                onClick={() => {
                  triggerStudentAction('studying');
                  setShowInteractiveMenu(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/40 border border-purple-500/20 text-center transition"
                title="Deep Study"
              >
                <span className="block text-sm">💻</span>
                <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">Study</span>
              </button>
              <button
                onClick={() => {
                  triggerStudentAction('cramming');
                  setShowInteractiveMenu(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/40 border border-purple-500/20 text-center transition"
                title="Flashcards Cramming"
              >
                <span className="block text-sm">📝</span>
                <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">Cram</span>
              </button>
              <button
                onClick={() => {
                  triggerStudentAction('caffeine_boost');
                  setShowInteractiveMenu(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/40 border border-purple-500/20 text-center transition"
                title="Coffee Boost"
              >
                <span className="block text-sm">🧋</span>
                <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">Coffee</span>
              </button>
              <button
                onClick={() => {
                  triggerStudentAction('procrastinating');
                  setShowInteractiveMenu(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/40 border border-purple-500/20 text-center transition"
                title="Scrolling Memes"
              >
                <span className="block text-sm">📱</span>
                <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">Meme</span>
              </button>
              <button
                onClick={() => {
                  triggerStudentAction('sleeping');
                  setShowInteractiveMenu(false);
                }}
                className="p-1.5 rounded-xl bg-slate-900/70 hover:bg-purple-900/40 border border-purple-500/20 text-center transition"
                title="Power Nap"
              >
                <span className="block text-sm">💤</span>
                <span className="text-[9px] text-slate-300 font-semibold block mt-0.5">Nap</span>
              </button>
            </div>
          </div>

          {/* 4. Quick Care & Feed */}
          <div className="mt-2.5 pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                feedPet();
              }}
              className="px-3 py-1 rounded-xl bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-500/45 font-bold transition flex items-center gap-1.5 shadow-sm text-xs"
            >
              <span>🥪 Feed Berry (15 🪙)</span>
            </button>
            <span className="text-[10px] text-slate-400 italic">Drag to throw</span>
          </div>

          {/* Triangle pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-950 border-r border-b border-purple-500/50 rotate-45" />
        </div>
      )}
    </div>
  );
};

