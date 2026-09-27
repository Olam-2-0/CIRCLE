import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { sounds } from '../utils/soundEffects';
import { Coffee, Shirt } from 'lucide-react';
import { PixelPetEngine } from './PixelPetEngine';
import { PetCustomizationModal } from './PetCustomizationModal';

export const RoamingPet: React.FC = () => {
  const { pet, feedPet, setPetSpecies, showToast } = useEdzen();
  const [showCustomModal, setShowCustomModal] = useState<boolean>(false);

  const speciesList: ('cat' | 'dog' | 'rabbit' | 'parrot')[] = ['cat', 'dog', 'rabbit', 'parrot'];
  const speciesNames: Record<string, { label: string; icon: string }> = {
    cat: { label: 'Study Cat', icon: '🐱' },
    dog: { label: 'Study Pup', icon: '🐶' },
    rabbit: { label: 'Cram Bunny', icon: '🐰' },
    parrot: { label: 'Scholar Parrot', icon: '🦜' },
  };

  const cycleSpecies = () => {
    const currentIndex = speciesList.indexOf(pet.species as any);
    const nextIndex = (currentIndex + 1) % speciesList.length;
    const nextSpecies = speciesList[nextIndex];
    setPetSpecies(nextSpecies);
    showToast(`Switched species to ${speciesNames[nextSpecies].icon} ${speciesNames[nextSpecies].label}!`);
  };

  const triggerHudStunt = () => {
    const stunts = ['backflip', 'spin', 'zoomies'];
    const chosen = stunts[Math.floor(Math.random() * stunts.length)];
    window.dispatchEvent(new CustomEvent('edzen-pet-action', { detail: { type: 'stunt', stunt: chosen } }));
  };

  const triggerHudStudy = () => {
    window.dispatchEvent(new CustomEvent('edzen-pet-action', { detail: { type: 'action', action: 'studying' } }));
  };

  return (
    <>
      {/* ================= LIVING PIXEL PET ENGINE (Exclusive Pixel Mode: 80px Organic AI, Physics, Drag-Drop, Student Actions, Vitals) ================= */}
      <PixelPetEngine pixelSize={80} />

      {/* Quick Floating Pet Setting HUD Pill in bottom-right - Enlarged Dark Liquid Glass */}
      <div className="fixed bottom-4 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 sm:gap-2.5 bg-slate-950/95 backdrop-blur-3xl px-4 py-2 sm:px-5 sm:py-2.5 rounded-full border border-purple-400/50 text-xs sm:text-sm text-purple-100 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.3)] transition-all">
        {/* Pixel Badge Indicator */}
        <span className="flex items-center gap-1.5 text-[11px] font-mono font-black text-purple-300 bg-purple-500/25 px-2.5 py-1 rounded-full border border-purple-400/40 tracking-wider">
          👾 PIXEL PET
        </span>
        <span className="text-purple-500/40">•</span>

        {/* Species Cycle Button */}
        <button
          onClick={cycleSpecies}
          className="flex items-center gap-1.5 text-purple-200 hover:text-white font-bold transition px-2.5 py-1 rounded-xl hover:bg-purple-900/40 text-xs sm:text-sm"
          title="Click to cycle species: 🐱 Cat ➔ 🐶 Dog ➔ 🐰 Rabbit ➔ 🦜 Parrot"
        >
          <span className="text-base sm:text-lg">{speciesNames[pet.species]?.icon || '🐾'}</span>
          <span>{speciesNames[pet.species]?.label || 'Pet'}</span>
        </button>
        <span className="text-purple-500/40">•</span>

        {/* Stunt Button */}
        <button
          onClick={triggerHudStunt}
          className="flex items-center gap-1.5 text-amber-300 hover:text-white font-bold transition px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/40 shadow-sm text-xs sm:text-sm"
          title="Trigger acrobatic stunt (Backflip, Breakdance, Zoomies)"
        >
          <span className="text-sm">🤸</span>
          <span>Stunt!</span>
        </button>
        <span className="text-purple-500/40">•</span>

        {/* Study Button */}
        <button
          onClick={triggerHudStudy}
          className="flex items-center gap-1.5 text-emerald-300 hover:text-white font-bold transition px-2.5 py-1 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-400/40 shadow-sm text-xs sm:text-sm"
          title="Prompt pet to study"
        >
          <span className="text-sm">💻</span>
          <span>Study</span>
        </button>
        <span className="text-purple-500/40">•</span>

        {/* Wardrobe Sets */}
        <button
          onClick={() => {
            setShowCustomModal(true);
            sounds.playCoin();
          }}
          className="flex items-center gap-1.5 text-amber-300 hover:text-white font-bold transition px-2.5 py-1 rounded-xl bg-purple-500/15 hover:bg-purple-500/30 border border-purple-400/40 shadow-sm text-xs sm:text-sm"
        >
          <Shirt className="w-4 h-4 text-amber-400" />
          <span>Sets (🪙)</span>
        </button>
        <span className="text-purple-500/40">•</span>

        {/* Feed */}
        <button
          onClick={() => {
            feedPet();
          }}
          className="flex items-center gap-1.5 text-slate-200 hover:text-white transition px-2.5 py-1 rounded-xl bg-white/5 hover:bg-purple-900/40 font-bold border border-white/10 hover:border-purple-400/40 text-xs sm:text-sm"
          title="Feed (15 🪙)"
        >
          <Coffee className="w-4 h-4 text-amber-400" />
          <span>Feed</span>
        </button>
      </div>

      {/* Global Interactive Customization & Sets Modal */}
      <PetCustomizationModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
      />
    </>
  );
};
