import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import { PetAvatar2D } from '../components/PetAvatar2D';
import { PetCustomizationModal, THEMATIC_SETS } from '../components/PetCustomizationModal';
import {
  Shirt, Coins, Sparkles, Check, Lock,
  Coffee, Heart, Zap, RefreshCw, Palette,
  Package, Crown, Award, ChevronRight
} from 'lucide-react';
import { PetAccessory, PetSpecies } from '../types';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export const PetWardrobeShopPage: React.FC = () => {
  const {
    t,
    pet,
    setPetName,
    setPetSpecies,
    setPetColor,
    petAccessories,
    equipAccessory,
    unequipAccessory,
    unlockAccessory,
    userCoins,
    feedPet,
    showToast
  } = useEdzen();

  const [activeTab, setActiveTab] = useState<'sets' | 'single' | 'aura'>('sets');
  const [activeSlot, setActiveSlot] = useState<'all' | 'hat' | 'glasses' | 'neck' | 'back'>('all');
  const [editingName, setEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(pet.name);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Top Species Selection Options (Pixel Student Companions)
  const topSpeciesList: { id: PetSpecies; name: string; title: string; perk: string; icon: string }[] = [
    { id: 'cat', name: 'Study Cat', title: 'Astra', perk: '+10% Habit Streak Shield & Naps', icon: '🐱' },
    { id: 'dog', name: 'Study Pup', title: 'Barnaby', perk: '+15% Focus Momentum & Zoomies', icon: '🐶' },
    { id: 'rabbit', name: 'Cram Bunny', title: 'Pip', perk: '+20% Speed Reading & Hops', icon: '🐰' },
    { id: 'parrot', name: 'Scholar Parrot', title: 'Echo', perk: '+15% Formula Recall & Aerial Flips', icon: '🦜' },
  ];

  const colorPalettes = [
    { name: 'Astral Purple', hex: '#c084fc' },
    { name: 'Cosmic Teal', hex: '#2dd4bf' },
    { name: 'Rose Blossom', hex: '#f472b6' },
    { name: 'Solar Amber', hex: '#fbbf24' },
    { name: 'Cyber Blue', hex: '#38bdf8' },
  ];

  const filteredAccessories = petAccessories.filter(a =>
    activeSlot === 'all' ? true : a.slot === activeSlot
  );

  const handleSaveName = () => {
    if (tempName.trim()) {
      setPetName(tempName.trim());
      setEditingName(false);
      showToast(`Companion renamed to ${tempName.trim()}!`);
    }
  };

  const handleEquipOrBuySet = (set: typeof THEMATIC_SETS[0]) => {
    const itemIds = [set.items.hat, set.items.glasses, set.items.neck, set.items.back].filter(Boolean) as string[];
    const lockedItems = itemIds.map(id => petAccessories.find(a => a.id === id)).filter(a => a && !a.unlocked);

    if (lockedItems.length > 0) {
      const neededCost = lockedItems.reduce((acc, curr) => acc + (curr ? curr.price : 0), 0);
      if (userCoins < neededCost) {
        showToast(`Need ${neededCost} 🪙 to unlock remaining items in this set! Complete more focus sprints.`);
        return;
      }
      lockedItems.forEach(item => {
        if (item) unlockAccessory(item.id);
      });
    }

    itemIds.forEach(id => {
      const item = petAccessories.find(a => a.id === id);
      if (item) equipAccessory(item);
    });

    sounds.playSuccess();
    confetti({ particleCount: 8, spread: 35, scalar: 0.6, origin: { y: 0.6 } });
    showToast(`✨ Equipped the ${set.name}!`);
  };

  const isSetEquipped = (set: typeof THEMATIC_SETS[0]) => {
    return (
      (!set.items.hat || pet.equipped.hat === set.items.hat) &&
      (!set.items.glasses || pet.equipped.glasses === set.items.glasses) &&
      (!set.items.neck || pet.equipped.neck === set.items.neck) &&
      (!set.items.back || pet.equipped.back === set.items.back)
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-pink-900/30 to-slate-900/60 backdrop-blur-2xl border border-purple-500/30 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-flex items-center gap-1.5 mb-2">
            <Shirt className="w-3.5 h-3.5 text-purple-300" />
            2D Companion Wardrobe & Thematic Sets
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {t('wardrobeTitle')}
          </h2>
          <p className="text-xs text-purple-200/80 mt-1 max-w-xl">
            Choose your 2D companion archetype and equip thematic gear with earned Quest Coins (🪙)!
          </p>
        </div>

        {/* Coin Balance & Quick Modal Trigger */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Coins className="w-5 h-5 text-amber-400 animate-bounce-gentle" />
            <div>
              <div className="text-sm font-black font-mono leading-none">{userCoins} 🪙</div>
              <div className="text-[9px] text-amber-200 uppercase font-semibold">Coins</div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] transition hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Customize Sets (🪙)</span>
          </button>
        </div>
      </div>

      {/* 2. TOP PET SPECIES SELECTION BAR (Prominent Top Row) */}
      <div className="p-5 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-200 flex items-center gap-2">
            <span>Select Pixel Companion Archetype</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-2 py-0.2 rounded-full border border-emerald-500/30">
              1-Click Instant Evolution
            </span>
          </h3>
          <span className="text-[11px] text-slate-400">
            Active: <strong className="text-white capitalize">{pet.species}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {topSpeciesList.map((sp) => {
            const isSelected = pet.species === sp.id;
            const mockPetState = { ...pet, species: sp.id };

            return (
              <div
                key={sp.id}
                onClick={() => {
                  setPetSpecies(sp.id);
                  sounds.playPetCheer();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected
                  ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-[1.02]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-purple-400/40'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{sp.icon}</span>
                  {isSelected ? (
                    <span className="text-[9px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Active
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                      Switch
                    </span>
                  )}
                </div>

                {/* Pixel Mini Avatar Render */}
                <div className="flex justify-center my-1">
                  <PetAvatar2D pet={mockPetState} size={70} isAnimated={isSelected} />
                </div>

                <div className="mt-2 text-center">
                  <h4 className="text-xs font-bold text-white">{sp.name}</h4>
                  <p className="text-[10px] text-purple-300 font-semibold mt-0.5 leading-tight">
                    {sp.perk}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Stage: Left Pixel Companion Interactive Studio (5 cols) + Right Thematic Sets & Wardrobe (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left: Interactive Pixel Companion Stage (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-6">
          <div>
            {/* Rename Bar */}
            <div className="flex items-center justify-between mb-3">
              {editingName ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={e => setTempName(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/70 border border-purple-400 text-white text-xs outline-none flex-1"
                  />
                  <button
                    onClick={handleSaveName}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <span>{pet.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Lv.{pet.level} {pet.species.toUpperCase()}
                      </span>
                    </h3>
                    <span className="text-xs text-slate-400">Click pet to open Set Customizer</span>
                  </div>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-xs text-purple-300 hover:text-white underline font-semibold"
                  >
                    Rename
                  </button>
                </>
              )}
            </div>

            {/* Clickable Pixel Companion Stage */}
            <div
              onClick={() => {
                setIsModalOpen(true);
                sounds.playCoin();
              }}
              className="p-6 my-3 rounded-3xl bg-gradient-to-b from-purple-900/30 via-slate-950/50 to-slate-900/40 border border-purple-500/30 flex flex-col items-center justify-center cursor-pointer group hover:border-purple-400 transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden"
              title="Click avatar to customize sets with coins!"
            >
              <div className="absolute top-2 right-3 text-[10px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 group-hover:scale-105 transition">
                <Sparkles className="w-3 h-3" /> Click to Customize
              </div>

              <div className="relative py-4">
                <PetAvatar2D pet={pet} size={150} isAnimated={true} />
              </div>

              <span className="text-xs text-purple-200/90 font-semibold mt-2 group-hover:text-white transition">
                Equipped: {pet.equipped.hat || 'No Hat'} • {pet.equipped.glasses || 'No Visor'} • {pet.equipped.back || 'No Cape'}
              </span>
            </div>

            {/* Color Palette Aura Picker */}
            <div className="space-y-2 mb-4">
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Astral Color Aura:
              </label>
              <div className="flex items-center gap-3">
                {colorPalettes.map(c => (
                  <button
                    key={c.hex}
                    onClick={() => setPetColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform ${pet.color === c.hex ? 'scale-125 border-white shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'border-transparent hover:scale-110'
                      }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Vitality & Fullness Stats */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Companion Vitality</span>
                  <strong className="text-purple-300">{pet.energy}%</strong>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full" style={{ width: `${pet.energy}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Hunger Level</span>
                  <strong className="text-amber-300">{pet.hunger}%</strong>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${pet.hunger}%` }} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={feedPet}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] transition"
          >
            Feed Cosmic Berry Bowl (15 🪙)
          </button>
        </div>

        {/* Right: Thematic Sets (🪙) & Single Gear Wardrobe (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">

          {/* Main Toggle: Thematic Sets vs Single Items */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('sets')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'sets'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
              >
                Thematic Sets (🪙)
              </button>
              <button
                onClick={() => setActiveTab('single')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeTab === 'single'
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
              >
                Single Gear
              </button>
            </div>

            {activeTab === 'single' && (
              <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
                {(['all', 'hat', 'glasses', 'neck', 'back'] as const).map(slot => (
                  <button
                    key={slot}
                    onClick={() => setActiveSlot(slot)}
                    className={`px-2.5 py-1 rounded-lg capitalize text-xs font-semibold transition ${activeSlot === slot ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TAB 1: THEMATIC SETS LIST */}
          {activeTab === 'sets' && (
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {THEMATIC_SETS.map(set => {
                const equipped = isSetEquipped(set);
                return (
                  <div
                    key={set.id}
                    className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${equipped
                      ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{set.name}</h4>
                          <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
                            {set.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">{set.tagline}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-amber-300 font-mono">
                          {set.bundlePrice} 🪙
                        </span>
                        <span className="text-[9px] text-slate-400 block uppercase">Full Bundle</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-500/20 text-xs text-purple-200 mb-3 flex items-center justify-between">
                      <span>✨ {set.bonusDescription}</span>
                      <span className="text-[10px] text-amber-300 font-semibold">4 Items</span>
                    </div>

                    <button
                      onClick={() => handleEquipOrBuySet(set)}
                      className={`w-full py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 ${equipped
                        ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white shadow'
                        }`}
                    >
                      {equipped ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-300" />
                          <span>Equipped across all 12 sections</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Unlock / Equip Set with Coins (🪙)</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: SINGLE ACCESSORIES GRID */}
          {activeTab === 'single' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredAccessories.map(item => {
                const isEquipped = pet.equipped[item.slot] === item.id;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${isEquipped
                      ? 'bg-purple-950/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10'
                      }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-xl">
                          {item.icon}
                        </div>
                        <div className="text-right">
                          {item.unlocked ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                              Owned
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-amber-300 font-mono">
                              {item.price} 🪙
                            </span>
                          )}
                          <span className="text-[9px] text-slate-400 block uppercase mt-0.5">{item.slot}</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mb-0.5">{item.name}</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed mb-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10">
                      {item.unlocked ? (
                        isEquipped ? (
                          <button
                            onClick={() => unequipAccessory(item.slot)}
                            className="w-full py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Equipped</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => equipAccessory(item)}
                            className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                          >
                            Equip
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => unlockAccessory(item.id)}
                          className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black text-xs font-black shadow transition flex items-center justify-center gap-1"
                        >
                          <Coins className="w-3.5 h-3.5" />
                          <span>Unlock for {item.price} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Global Customization Modal (Also openable from clicking pet) */}
      <PetCustomizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
