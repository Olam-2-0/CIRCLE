import React, { useState } from 'react';
import { useEdzen } from '../context/EdzenContext';
import {
  Award, ShieldCheck, CheckCircle, ExternalLink,
  Search, Lock, Sparkles, User, Globe, Copy
} from 'lucide-react';
import { LANGUAGES } from '../i18n/translations';
import { Language } from '../types';

export const ProfileCredentialsPage: React.FC = () => {
  const {
    t,
    userName,
    userLevel,
    userXp,
    userCoins,
    focusStreak,
    credentials,
    language,
    setLanguage
  } = useEdzen();

  const [searchId, setSearchId] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    credential?: typeof credentials[0];
    verifiedAt: string;
  } | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const trimmed = searchId.trim().toUpperCase();
    const found = credentials.find(c =>
      c.credentialCode.toUpperCase().includes(trimmed) ||
      c.blockchainHash.toLowerCase().includes(searchId.trim().toLowerCase())
    );

    if (found) {
      setVerificationResult({
        valid: true,
        credential: found,
        verifiedAt: new Date().toLocaleTimeString()
      });
    } else {
      setVerificationResult({
        valid: false,
        verifiedAt: new Date().toLocaleTimeString()
      });
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">

      {/* Student Profile Card Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900/60 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.2)] flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-600 to-indigo-500 p-[2px] shadow-[0_0_25px_rgba(168,85,247,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-2xl font-black text-white">
              AM
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">{userName}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                Student #ED-7821
              </span>
            </div>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Level {userLevel} Scholar • {focusStreak}-Day Sustainable Streak • Zero Guilt Record
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-base font-black text-amber-300">{userCoins} 🪙</div>
            <div className="text-[10px] text-slate-400">Quest Coins</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-base font-black text-purple-300">{userXp} XP</div>
            <div className="text-[10px] text-slate-400">Cumulative Mastery</div>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-base font-black text-emerald-400">100%</div>
            <div className="text-[10px] text-slate-400">Streak Integrity</div>
          </div>
        </div>
      </div>

      {/* Language Preferences Settings Box */}
      <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Default Native Language Setting</h3>
            <p className="text-xs text-slate-300">
              Concept summaries, AI chat prompts, and system messages will be localized immediately.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${language === lang.code
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-400/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.nativeName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Verifiable Credentials & Verification Lookup Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Credentials Catalog (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">
                Earned Micro-Credentials ({credentials.length})
              </h3>
            </div>
            <span className="text-xs text-purple-300">ERC-4337 Compatible</span>
          </div>

          <div className="space-y-4">
            {credentials.map((cred) => (
              <div
                key={cred.id}
                className="p-5 rounded-3xl bg-slate-950/60 border border-purple-500/30 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md">
                      {cred.credentialCode}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">
                      {cred.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Issued by {cred.issuer} • {cred.issueDate}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {cred.skillsVerified.map((sk, i) => (
                    <span key={i} className="text-[10px] text-purple-200 bg-purple-500/20 px-2 py-0.5 rounded-md">
                      ✓ {sk}
                    </span>
                  ))}
                </div>

                {/* Blockchain Proof Hash */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="truncate max-w-xs">{cred.blockchainHash}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(cred.blockchainHash);
                      alert("Blockchain hash copied to clipboard!");
                    }}
                    className="text-purple-300 hover:text-white ml-2 shrink-0"
                    title="Copy Hash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Lookup Tool (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(168,85,247,0.15)] flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-purple-400" />
              <h3 className="text-base font-bold text-white">
                Credential Verification Portal
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Employers or institutions can independently verify authenticity using the credential code or SHA-256 hash.
            </p>

            <form onSubmit={handleVerify} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Enter Credential Code or Hash:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    placeholder="e.g. EDZ-MATH-8849"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950/70 border border-white/20 text-white text-xs outline-none focus:ring-1 focus:ring-purple-400"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition shadow"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {/* Sample Quick Fill */}
              <div className="flex gap-2 text-[10px]">
                <button
                  type="button"
                  onClick={() => setSearchId('EDZ-MATH-8849')}
                  className="text-purple-300 hover:underline"
                >
                  Fill Math Credential
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setSearchId('EDZ-SYS-2910')}
                  className="text-purple-300 hover:underline"
                >
                  Fill Systems Credential
                </button>
              </div>
            </form>

            {/* Verification Result Output */}
            {verificationResult && (
              <div className="mt-5 p-4 rounded-2xl border animate-in fade-in duration-200 bg-slate-950/70 border-purple-500/30">
                {verificationResult.valid && verificationResult.credential ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authentic & Valid Credential!</span>
                    </div>
                    <div className="text-xs text-white font-bold">
                      {verificationResult.credential.title}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      Awarded to: <strong>{verificationResult.credential.recipientName}</strong>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Timestamp: {verificationResult.verifiedAt}
                    </div>
                  </div>
                ) : (
                  <div className="text-rose-400 text-xs font-semibold">
                    No matching credential found for this identifier.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] text-slate-400">
              Secured by EDZEN Zero-Knowledge Identity Protocol
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
