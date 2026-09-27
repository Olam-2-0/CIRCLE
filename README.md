# EDZEN — Adaptive AI Student Life Companion

> *"Don't make students adapt to a productivity system. Make the productivity system adapt to the student."*
> **Sustainable Progress • Zero Guilt • Total Agency**

---

## 🌌 Aesthetics & Theme: Liquid Glass & Astral Purple
- **Canvas Background**: Deep Royal & Violet Gradient (`bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900`)
- **Cards & Containers**: Liquid Glass Effect (`bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] rounded-3xl`)
- **Accents**: Astral Violet & Pure White (`text-white`, `bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]`)
- **Self-Contained Audio Synthesizer**: Generative ambient rain, cosmic lofi, zen temple bowls, coin jingles, and success chimes using the Web Audio API without external audio files.

---

## 🐾 Roaming Screen Pet Companion ("Edzemon")
1. **Autonomous Roaming & Speech**:
   - Roams across the viewport or docks in the bottom-right corner.
   - Draggable & clickable with interactive speech bubbles, mood indicators, and energy/hunger stats.
   - Species archetypes: **Cat** (Mystic Feline), **Dragon** (Ember Drake), **Spirit** (Astral Wisp), **Robot** (Cyber Bot).
2. **Real-Time Customization Wardrobe**:
   - Spend earned Quest Coins (🪙) to unlock and equip:
     - **Hats**: Archmage Wizard Hat, Sovereign Gold Crown, Honors Graduation Cap, Zen Lotus Blossom.
     - **Visors & Glasses**: Astral Neon Visor, Vintage Brass Spectacles, Starlight Aviators.
     - **Neck**: Lavender Knit Scarf, Celestial Pendulum, Chime of Mindfulness.
     - **Back**: Midnight Nebula Cape, Seraphic Light Wings, Cosmic Boost Jetpack.
   - Equipped gear dynamically renders on the roaming pet across all 12 sections of the application in real-time.

---

## 🧭 The 12 Functional Navigation Sections
1. **Dashboard**: "Right Now" Hero Card matching cognitive energy, quick action shortcuts, daily momentum rings, and live pet preview.
2. **Adaptive Planner**: Multilingual AI Brain Dump (NLP synthesizer into 20–45 min quests), non-punitive rebalancing banner ("Your plan changed? That's completely okay.").
3. **Exam Rescue**: Smart Syllabus Scanner, multimodal OCR upload simulation, 80/20 triage mode for weak subjects, and multilingual concept flashcards (EN, HI, ML, ES, TA).
4. **Skill Tree**: Interactive visual RPG curriculum map across 4 branches (Math & Logic, Computer Systems, Cognitive Psychology, Linguistics) with micro-credential unlocks.
5. **Quests & Focus**: 25-Min Pomodoro Timer with SVG radial progress ring, short/long breaks, ambient focus sound player, feeding companion energy upon completion.
6. **Answer Battle**: Progressive hint engine (Hints 1-3), camera OCR answer upload simulation, deterministic AI keyword review, and raid boss health attacks.
7. **Study Together**: Global synchronized virtual room with live peers from Oxford, IIT Bombay, Tokyo Tech, UNAM, and NUS + collective weekly Raid Boss ("The Procrastination Behemoth").
8. **Goals & Habits**: Goal → Milestone → Habit → Quest hierarchy with non-streak-reset **Forgiveness Shields** that protect consistency on hard days.
9. **Wellness Companion**: Empathetic ZenBot AI chat, "I'm Overwhelmed" mode, 5-minute guided 4-7-8 breathing reset with expanding orb, and "I Can't Study Right Now" gentle roll-forward protocol.
10. **Student Routines**: Crowdsourced routine discovery (Balanced Zen Scholar, ADHD 25-Min Sprint, Night Owl Deep Work, 72-Hour Rapid Triage) with 1-click schedule adoption.
11. **Pet Wardrobe**: Customization store, color aura picker, species evolution, accessory unlock & equip system.
12. **Profile & Credentials**: Student profile card, language preference toggle, verifiable micro-credentials catalog with SHA-256 cryptographic verification lookup portal.

---

## 🛠️ Tech Stack & Local Execution
- **React 18 + Vite + TypeScript**
- **Tailwind CSS**
- **Lucide React Icons**
- **Canvas-Confetti**
- **Web Audio API**
- **LocalStorage State Persistence** across all sessions

To run locally:
```bash
npm run dev
# or
cmd.exe /c npm run dev -- --host
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.
