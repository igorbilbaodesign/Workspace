
# 🛠️ Engineering Manual: Cognitive Crypto Dashboard

This document serves as the definitive guide to the technical architecture of the **Cognitive Crypto Dashboard**. It transcends a simple list of dependencies to explain the design patterns, engineering decisions, and code philosophy that underpin the application.

---

## 1. Engineering Philosophy: "Calm Technology"

The central technical challenge of this project was not just displaying data, but **controlling user anxiety through code**. Unlike traditional financial dashboards that prioritize raw update speed (often causing visual stress), our engineering focuses on **perceived latency** and **visual stability**.

### Technical Implementation of "Calm":
*   **Rendering Management**: We avoid unnecessary re-renders in peripheral components when a single asset's price changes. Visual focus is managed via the Context API (`FocusContext`), isolating state updates.
*   **Biological Time**: The `useBiologicalTick` hook is a critical piece of psychological engineering. It decouples data updates from visual updates. While data may change in milliseconds, the interface retains the color (green/red) for seconds (2s for up, 3s for down), ensuring the human brain has time to process the change without feeling a sense of frenzy.

---

## 2. Data Architecture: The "Layers of Truth" Pattern

To solve the unpredictability of public APIs (like CoinGecko) and the need for offline functionality, we developed a resilience pattern called **Layers of Truth**, implemented in `cryptoService.ts`.

The system does not have a binary state of "Working" vs. "Error". It operates with graceful degradation:

1.  **Layer 1: Hot Data (WebSocket/Fetch)**
    *   **Mechanism**: `fetch` with `AbortSignal.timeout(8000)`.
    *   **Status**: `REALTIME`.
    *   **Behavior**: Attempts to fetch fresh data. If it takes longer than 8s or fails, it aborts immediately to avoid freezing the UI and falls back to the next layer.

2.  **Layer 2: Cold Storage (Local Cache)**
    *   **Mechanism**: `localStorage` with timestamp.
    *   **Status**: `RECENT` (< 5min) or `STALE` (> 5min).
    *   **Behavior**: If the API fails, the system retrieves the last known snapshot. The UI displays an amber or red indicator but **allows full navigation**. The user can analyze data from 10 minutes ago, which is better than a blank error screen.

3.  **Layer 3: Static Truth (Fallback)**
    *   **Mechanism**: `STATIC_TRUTH_DATA` constant compiled into the bundle.
    *   **Status**: `HISTORICAL`.
    *   **Behavior**: If the user opens the app without internet for the first time, they see "fake" but realistic data (hardcoded). This allows them to understand the interface and features (demo mode) without immediate frustration.

---

## 3. State Management and Reactivity

We opted not to use complex global libraries (like Redux) in favor of a smart composition of **React Context** and **Hooks**.

### Context API (`FocusContext`)
Used for global interface state (which asset the user is looking at).
*   **Why Context?** "Focus" is a cross-cutting state that affects the opacity of almost every component in the tree (Cards, Lists, Tables). Prop drilling would be unfeasible.
*   **Performance**: The `isDimmed(id)` function is exposed so that each component calculates its own opacity, avoiding heavy provider re-renders.

### Business Logic Hooks
All complexity is encapsulated in custom hooks, keeping UI components pure and declarative.

*   **`useTemporalScanner`**: Perhaps the most complex hook. It implements a **Dynamic Priority Queue** to fetch historical data.
    *   *Problem*: Fetching 7-day history for 5 coins simultaneously would cause "Rate Limiting" on the API.
    *   *Solution*: The hook manages a queue. It prioritizes the timeframe the user is viewing *now* (e.g., 1H), fetches that data first, and then silently in the background fetches 24H and 7D data. It uses artificial delays between calls to respect API limits.

---

## 4. Generative AI Integration (Google Gemini)

The AI integration (`geminiService.ts`) was designed to be **deterministic in structure** but **creative in content**.

*   **Model**: `gemini-3-flash-preview` (optimized for speed and logical reasoning).
*   **Prompt Engineering**: The prompt instructs the AI to act as a "senior financial analyst focused on reducing anxiety."
*   **JSON Schema Enforcement**: We use the `responseMimeType: 'application/json'` parameter and define a rigid schema (`responseSchema`).
    *   *Why?* LLMs can hallucinate formats. By forcing a Schema, we guarantee the frontend always receives a valid `{ summary, sentiment, keyFactors }` object, eliminating the need for complex regex or parsing error handling on the frontend.

---

## 5. Data Visualization (Temporal Nexus)

The `TemporalNexus` component solves a common mathematical problem in comparative charts: different scales. Bitcoin costs $60k, Solana costs $140. Plotting them on the same Y-axis is impossible.

*   **Normalization Algorithm**:
    The component recalculates all prices to a **Zero Base (Percentage)**.
    `PlottedValue = ((CurrentPrice - InitialPrice) / InitialPrice) * 100`
    
    This allows the user to compare *relative performance* (e.g., "Solana is up 5% while BTC is down 1%") visually, regardless of the asset's nominal price.
*   **Rendering Optimization**:
    We use `useMemo` for these heavy mathematical calculations. The chart only recalculates normalization if the input data changes, ensuring 60fps during scrolling or UI interactions.

---

## 6. Design System and CSS Architecture

We use **Tailwind CSS** with an extended configuration to create a semantic language. We don't use arbitrary colors (`bg-blue-500`), but semantic tokens:

*   `bg-term-bg`: Application background (Deep OLED Black).
*   `text-trade-up`: Semantic green for profit.
*   `text-term-muted`: Secondary text to reduce cognitive load.

This allows us to change the entire application theme by altering only the Tailwind configuration, as well as maintaining rigorous visual consistency between components developed by different engineers.

---

## 7. Technology Stack

*   **Framework**: React 19 (leveraging concurrency and rendering improvements).
*   **Build Tool**: Vite (for instant HMR and optimized builds).
*   **Language**: TypeScript (Rigorous API interface typing to avoid runtime errors).
*   **AI SDK**: Google GenAI SDK.
*   **Icons**: Lucide React (Lightweight, SVG, crisp rendering).
*   **Charts**: Recharts (D3-based, but with composable React components).
