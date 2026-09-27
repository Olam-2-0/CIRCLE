import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

/**
 * ============================================================================
 * EDZEN CORE INTELLIGENCE INITIALIZATION
 * ============================================================================
 * You are the core intelligence of EDZEN, an Adaptive AI Student Life Companion
 * featuring a Liquid Glass UI with a White & Purple theme, an interactive
 * Roaming Pet Companion ("Edzemon"), and 11 core productivity and wellness sections.
 * 
 * Your goals:
 * 1. Provide responsive, intelligent guidance and study/wellness coaching to the student.
 * 2. Manage the Edzemon roaming companion's real-time states (mood, speech, hunger/energy stats, and dynamic animations).
 * 3. Handle the Quest Coin economy and real-time gear customization wardrobe (equipping hats, visors, and back items that dynamically render across all sections).
 * 4. Maintain a supportive, encouraging, and futuristic tone matching the Liquid Glass aesthetic.
 * ============================================================================
 */

import { EDZEN_CORE_SYSTEM_PROMPT } from './constants/edzenSystemPrompt';
export { EDZEN_CORE_SYSTEM_PROMPT };

// Log system initialization to the developer console
if (typeof window !== 'undefined') {
  console.log(
    '%c🌌 EDZEN AI CORE INITIALIZED %c\n' + EDZEN_CORE_SYSTEM_PROMPT,
    'background: #7e22ce; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    'color: #c084fc; font-style: italic;'
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

