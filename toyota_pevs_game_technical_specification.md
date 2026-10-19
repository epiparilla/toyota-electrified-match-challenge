# TECHNICAL SPECIFICATION & PROMPT: Toyota PEVS Interactive Matching Game

**To:** Autonomous AI Lead Developer (Claude Code / GPT / Codex)  
**From:** Development Management Team  
**Project Name:** Toyota Motor Philippines - PEVS Interactive Vehicle Matching Kiosk Game  
**Target Environment:** 55-Inch Portrait Touch Screen Android TV (`9:16` Aspect Ratio)  
**Initial Delivery:** High-Performance Web Application (React/Vite + Tailwind CSS)  
**Future Roadmap:** Native Android App Wrapper (via Capacitor or WebView Shell)

---

## 1. EXECUTIVE OVERVIEW & ROLE
You are acting as the Lead Autonomous Full-Stack Developer for a high-profile interactive booth game commissioned by **Toyota Motor Philippines** for the **Philippine Electric Vehicle Summit (PEVS)**. 

Your goal is to build a bulletproof, visually stunning, lightning-fast kiosk web app optimized for high-traffic convention conditions. The user interface must enforce a strict vertical **9:16 aspect ratio**, withstand bright exhibition hall lighting, maintain rapid line velocity (no sluggish transitions), and incorporate a sophisticated dark eco-tech aesthetic with a deliberate **"touch of red"** brand accent.

---

## 2. HARDWARE, DISPLAY, & VIEWPORT CONSTRAINTS
- **Target Display:** 55-inch portrait touch screen Android TV operating at 1080x1920 or 2160x3840 resolution.
- **Aspect Ratio Enforcement:** The app container **MUST** be strictly locked to a vertical `9:16` aspect ratio (`max-width: 540px`, `height: 100vh` or scaled via CSS letterboxing/pillarboxing on wider desktop/tablet screens during development and mobile testing).
- **Touch Optimization:** 
  - Minimum touch target size for buttons and cards: `48px x 48px` (preferably larger for 55-inch kiosk ergonomics).
  - Disable default browser behaviors: No text selection (`user-select: none`), no context menus on long-press, no pinch-to-zoom, and smooth touch registration with zero perceived input latency (`<50ms`).
- **Kiosk Mode Readiness:** Include helper scripts or CSS rules to prevent accidental scroll bounces, pull-to-refresh gestures, and accidental browser toolbar triggers.

---

## 3. COLOR PALETTE & VISUAL DESIGN SYSTEM ("TOUCH OF RED" DARK THEME)
Convention halls feature aggressive overhead spotlights. The UI must use high-contrast dark elements that pop without washing out.

* **Background / Base:** Deep Carbon / Midnight Slate (`#0B0F19` to `#09090B`).
* **Containers & Structural Borders:** Sleek electric cyan/teal glowing outlines (`#00F0FF`) with subtle inner box-shadow glows to create a premium futuristic EV ambiance.
* **The "Touch of Red" Accent:** Strategically reserved for primary anchor points to tie in Toyota's signature brand red without cluttering the screen:
  - Primary call-to-action (CTA) buttons (e.g., the "Start" button glow, close/exit triggers).
  - Incorrect match warnings or subtle card error flashes (`#EF4444` or `#F43F5E`).
  - Active toggle states or crucial milestone highlights.
* **Success & Progress States:** Hybrid Lime Green / Electric Cyan (`#10B981` / `#00F0FF`) for correct matches, timer meters, and victory celebrations.
* **Typography:** Crisp white and silver body text (`#F8FAFC`). Scale headers, scores, and countdown timers massively for **distance legibility** (spectators in line must be able to read game states from 2-3 meters away).

---

## 4. COMPLETE APPLICATION SCREEN & GAMEPLAY FLOW
The application must manage a seamless state machine traversing the following 7 core screens/phases:

### Phase 1: Welcome Page (Attract Loop / Idle State)
- **Visuals:** Brand header ("Toyota Motor Philippines"), event badge ("Philippine Electric Vehicle Summit"), dynamic game title ("Electrified Match Challenge"), and welcoming subtitle.
- **Interactivity:** Prominent, glowing red-accented **"Start"** button.
- **Idle Feature:** If untouched for X seconds, optional background video loop / attract animation kicks in. Includes a hidden or discreet settings gear icon to configure wait times and pre-loading options.

### Phase 2: Configuration & Attract Preset (Settings Modal / Screen)
- Controls for video loop pre-loading, queue wait-time presets, and audio toggles. Accessible easily for booth technicians.

### Phase 3: Car Preview Phase (Memorization Tier 1)
- Displays a clean, vertically scrollable list of Toyota electrified models (e.g., *bZ4X*, *RAV4 Hybrid*, *Camry Hybrid*, *Yaris Cross Hybrid*, etc.) pairing high-resolution vehicle thumbnails with bold model names.
- Gives players a brief countdown to study the lineup and recognize vehicle silhouettes.

### Phase 4: Grid Preview Phase (Phase 2 - Location Memorization)
- A grid panel interface (e.g., 4x4 grid representing 8 pairs of vehicle photos and model names) is briefly revealed face-up so players can memorize card coordinates.
- Features a prominent visual countdown timer before cards automatically flip face-down.

### Phase 5: Main Game (Play Time / Active Matching)
- **Mechanics:** All grid panels are face-down. Players tap two panels at a time to find matching pairs (Photo matches Corresponding Name or exact pair match).
- **Objective:** Reveal **3 correct pairs** before the countdown timer expires.
- **Feedback Loop:**
  - Correct Match: Green glow (`#10B981`) and celebratory scale-up pop animation.
  - Incorrect Match: Brief red border flash (`#EF4444`) and quick face-down reset.
  - State Transitions: Snappy, under 300ms animation speed to maintain high booth throughput.

### Phase 6: Win State
- **Visuals:** Celebratory celebratory banner ("Congratulations! You Win!!!"), total time elapsed, score summary, and a quick auto-reset countdown timer returning players to the welcome screen so the next person in line can step up.

### Phase 7: Lose State
- **Visuals:** Encouraging fallback screen ("Thank you for playing!" / "Great Effort! Try Again!") with a quick restart button to keep the queue moving smoothly.

---

## 5. TECHNICAL ARCHITECTURE & DELIVERABLE EXPECTATIONS
- **Recommended Stack:** React (Vite) + Tailwind CSS + Lucide Icons (or custom SVG icons) + Framer Motion (or lightweight CSS transitions for fluid 300ms animations).
- **Component Modularity:** Build clean, modular components for each screen state (`WelcomeScreen`, `SettingsModal`, `CarPreview`, `GridPreview`, `GamePlay`, `WinScreen`, `LoseScreen`).
- **State Management:** Robust state container (React Context or Zustand) to handle game phases, timer intervals, matched pairs count, and sound/vibration toggles.
- **Code Quality:** Production-ready, fully commented, responsive code with zero console errors. Ensure assets (car images and icons) use reliable placeholder paths or embedded SVGs so the app runs out-of-the-box.

---
*End of Technical Specification. Please initialize the project structure and build the complete single-page application adhering strictly to these guidelines.*