import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { PetAvatar2D } from './PetAvatar2D';
import { 
  X, Coins, Sparkles, Check, Lock, 
  Coffee, ShieldCheck, Heart, Zap, Package 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

interface PetCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ThematicSet {
  id: string;
  name: string;
  tagline: string;
  bundlePrice: number;
  items: {
    hat?: string;
    glasses?: string;
    neck?: string;
    back?: string;
  };
  bonusDescription: string;
  badge: string;
}

export const THEMATIC_SETS: ThematicSet[] = [
  {
    id: 'archmage_set',
    name: 'Astral Archmage Set',
    tagline: 'Deep flow state & exam problem solving',
    bundlePrice: 380,
    items: {
      hat: 'wizard_hat',
      glasses: 'cyber_shades',
      neck: 'astral_amulet',
      back: 'astral_cape'
    },
    bonusDescription: '+15% Focus Aura & Boss Magic Damage',
    badge: 'Popular 🧙‍♂️'
  },
  {
    id: 'cyber_scholar_set',
    name: 'Cyberpunk Scholar Set',
    tagline: 'High-speed coding & algorithmic stamina',
    bundlePrice: 420,
    items: {
      hat: 'scholar_cap',
      glasses: 'cyber_shades',
      neck: 'bell_collar',
      back: 'jetpack'
    },
    bonusDescription: '+20% Sprint Boost & Speed Regeneration',
    badge: 'Tech 🤖'
  },
  {
    id: 'royal_zen_set',
    name: 'Royal Seraphic Set',
    tagline: 'Sovereign discipline & stress immunity',
    bundlePrice: 480,
    items: {
      hat: 'royal_crown',
      glasses: 'starlight_goggles',
      neck: 'cozy_scarf',
      back: 'angel_wings'
    },
    bonusDescription: '+25% Overwhelm Protection Shield',
    badge: 'Exemplary 👑'
  },
  {
    id: 'mindful_lotus_set',
    name: 'Zen Mindfulness Set',
    tagline: 'Calm breathing & balanced revision',
    bundlePrice: 220,
    items: {
      hat: 'lotus_flower',
      glasses: 'nerd_glasses',
      neck: 'cozy_scarf',
      back: 'astral_cape'
    },
    bonusDescription: '+30% Recovery Energy Refill',
    badge: 'Peace 🪷'
  }
];

export const PetCustomizationModal: React.FC<PetCustomizationModalProps> = ({ isOpen, onClose }) => {
  const {
    pet,
    userCoins,
    petAccessories,
    equipAccessory,
    unequipAccessory,
    unlockAccessory,
    addCoins,
    feedPet,
    setPetSpecies,
    showToast
  } = useEdzen();

  const [activeTab, setActiveTab] = useState<'sets' | 'individual' | 'species'>('sets');
  const [selectedSlot, setSelectedSlot] = useState<'hat' | 'glasses' | 'neck' | 'back'>('hat');

  if (!isOpen) return null;

  // Equip full set logic
  const handleEquipOrBuySet = (set: ThematicSet) => {
    // Check which items are unlocked
    const itemIds = [set.items.hat, set.items.glasses, set.items.neck, set.items.back].filter(Boolean) as string[];
    const lockedItems = itemIds.map(id => petAccessories.find(a => a.id === id)).filter(a => a && !a.unlocked);

    if (lockedItems.length > 0) {
      // Calculate total cost to unlock remaining items
      const neededCost = lockedItems.reduce((acc, curr) => acc + (curr ? curr.price : 0), 0);
      if (userCoins < neededCost) {
        showToast(`Need ${neededCost} 🪙 to unlock remaining items in this set! Complete more 25-min quests.`);
        return;
      }

      // Unlock remaining items
      lockedItems.forEach(item => {
        if (item) unlockAccessory(item.id);
      });
    }

    // Equip each item
    itemIds.forEach(id => {
      const item = petAccessories.find(a => a.id === id);
      if (item) equipAccessory(item);
    });

    sounds.playSuccess();
    confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.6 } });
    showToast(`✨ Equipped the ${set.name}!`);
  };

  const isSetEquipped = (set: ThematicSet) => {
    return (
      (!set.items.hat || pet.equipped.hat === set.items.hat) &&
      (!set.items.glasses || pet.equipped.glasses === set.items.glasses) &&
      (!set.items.neck || pet.equipped.neck === set.items.neck) &&
      (!set.items.back || pet.equipped.back === set.items.back)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-slate-900/95 border border-purple-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col max-h-[90vh] text-white"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-purple-500/20 bg-purple-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-xl shadow-inner">
              🐾
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>Customize {pet.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold uppercase">
                  2D Chibi Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Equip thematic accessory sets or individual gear with Quest Coins (🪙)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{userCoins} 🪙</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left 2D Avatar Stage + Right Customization Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Left Preview Stage (5 cols) */}
          <div className="md:col-span-5 p-6 bg-slate-950/40 border-r border-purple-500/20 flex flex-col items-center justify-between text-center space-y-4">
            <div className="w-full">
              <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-2">
                Live Pixel Companion Preview
              </span>

              {/* 2D Avatar Render */}
              <div className="p-4 my-2 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-center shadow-inner relative">
                <div className="absolute inset-0 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                <PetAvatar2D pet={pet} size={135} isAnimated={true} />
              </div>

              <div className="text-xs font-bold text-slate-200 mt-1 capitalize">
                {pet.species} • Lv.{pet.level}
              </div>

              {/* Quick Pet Mood & Stats */}
              <div className="grid grid-cols-2 gap-2 mt-3 text-[10px] text-slate-400">
                <div className="p-2 rounded-xl bg-slate-900/60 border border-purple-500/20">
                  <span className="text-slate-400 block font-medium">Vitality</span>
                  <strong className="text-purple-300">{pet.energy}%</strong>
                </div>
                <div className="p-2 rounded-xl bg-slate-900/60 border border-purple-500/20">
                  <span className="text-slate-400 block font-medium">Fullness</span>
                  <strong className="text-amber-300">{pet.hunger}%</strong>
                </div>
              </div>
            </div>

            <button
              onClick={feedPet}
              className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Feed Cosmic Berry (15 🪙)</span>
            </button>
          </div>

          {/* Right Controls & Sets (7 cols) */}
          <div className="md:col-span-7 p-6 space-y-4 flex flex-col justify-between">
            <div>
              {/* Tabs: Sets vs Individual Gear vs Species */}
              <div className="flex gap-1.5 p-1 rounded-2xl bg-slate-950/60 border border-purple-500/20 text-xs font-bold mb-4">
                <button
                  onClick={() => setActiveTab('sets')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    activeTab === 'sets'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thematic Sets 🪙
                </button>
                <button
                  onClick={() => setActiveTab('individual')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    activeTab === 'individual'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Single Items
                </button>
                <button
                  onClick={() => setActiveTab('species')}
                  className={`flex-1 py-1.5 rounded-xl transition ${
                    activeTab === 'species'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Species
                </button>
              </div>

              {/* TAB 1: THEMATIC SETS */}
              {activeTab === 'sets' && (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {THEMATIC_SETS.map(set => {
                    const equipped = isSetEquipped(set);
                    return (
                      <div
                        key={set.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          equipped
                            ? 'bg-purple-900/30 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                            : 'bg-slate-950/40 hover:bg-slate-900/60 border-purple-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-white">{set.name}</h4>
                              <span className="text-[9px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.2 rounded-full border border-purple-500/30">
                                {set.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-0.5">{set.tagline}</p>
                          </div>

                          <span className="text-xs font-bold text-amber-300 font-mono">
                            {set.bundlePrice} 🪙
                          </span>
                        </div>

                        <div className="text-[10px] text-emerald-300 bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-500/30 mb-2 font-semibold">
                          ✨ {set.bonusDescription}
                        </div>

                        <button
                          onClick={() => handleEquipOrBuySet(set)}
                          className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            equipped
                              ? 'bg-purple-600 text-white shadow-sm'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow-md'
                          }`}
                        >
                          {equipped ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>Set Currently Equipped</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Equip / Unlock Full Set</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: INDIVIDUAL ITEMS */}
              {activeTab === 'individual' && (
                <div className="space-y-3">
                  <div className="flex gap-1.5 text-xs font-semibold">
                    {(['hat', 'glasses', 'neck', 'back'] as const).map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-1 rounded-xl capitalize font-bold ${
                          selectedSlot === slot
                            ? 'bg-purple-600 text-white shadow-sm'
                            : 'bg-slate-900/60 text-slate-400 hover:text-white'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {petAccessories.filter(a => a.slot === selectedSlot).map(item => {
                      const isEquipped = pet.equipped[item.slot] === item.id;
                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-2xl bg-slate-950/40 border border-purple-500/20 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.icon}</span>
                            <div>
                              <div className="font-bold text-white">{item.name}</div>
                              <div className="text-[10px] text-slate-400">{item.description}</div>
                            </div>
                          </div>

                          <div>
                            {item.unlocked ? (
                              isEquipped ? (
                                <button
                                  onClick={() => unequipAccessory(item.slot)}
                                  className="px-3 py-1 rounded-xl bg-purple-600 text-white text-[11px] font-bold"
                                >
                                  Equipped ✓
                                </button>
                              ) : (
                                <button
                                  onClick={() => equipAccessory(item)}
                                  className="px-3 py-1 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/30 text-[11px] font-bold"
                                >
                                  Equip
                                </button>
                              )
                            ) : (
                              <button
                                onClick={() => unlockAccessory(item.id)}
                                className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold"
                              >
                                {item.price} 🪙 Unlock
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: SPECIES ARCHETYPES */}
              {activeTab === 'species' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: 'cat', name: 'Study Cat', icon: '🐱', perk: '+10% Habit Shield & Naps' },
                    { id: 'dog', name: 'Study Pup', icon: '🐶', perk: '+15% Momentum & Zoomies' },
                    { id: 'rabbit', name: 'Cram Bunny', icon: '🐰', perk: '+20% Speed Reading & Hops' },
                    { id: 'parrot', name: 'Scholar Parrot', icon: '🦜', perk: '+15% Recall & Aerial Flips' },
                  ].map(sp => (
                    <button
                      key={sp.id}
                      onClick={() => setPetSpecies(sp.id as any)}
                      className={`p-3 rounded-2xl border text-left transition ${
                        pet.species === sp.id
                          ? 'bg-purple-600/30 border-purple-400 shadow-sm text-white'
                          : 'bg-slate-950/40 border-purple-500/20 hover:bg-purple-900/20 text-slate-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{sp.icon}</span>
                      <strong className="text-xs text-white block">{sp.name}</strong>
                      <span className="text-[10px] text-purple-300 font-semibold">{sp.perk}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-purple-500/20 text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow-sm"
              >
                Close Customizer
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
