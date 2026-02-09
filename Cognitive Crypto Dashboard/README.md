
# 🌌 Cognitive Crypto Dashboard (Cognitive OS v2.0)

> "Data must serve, not intimidate."

The **Cognitive Crypto Dashboard** is not merely a cryptocurrency dashboard; it is a **decision support system**. Designed with the philosophy that the interface should act as a cognitive extension of the investor, this project transforms market volatility and complexity into clarity and action.

## 🧠 Concept and Philosophy

The system architecture was designed to align technology with investor psychology. Instead of bombarding the user with flashing numbers, we created an experience that adapts to context and reduces cognitive anxiety.

### Fundamental Pillars:

1.  **Narrative Semantics**: The app structure tells a story. From the header (identity) to the footer (security), every section has a narrative purpose.
2.  **Cognitive Adaptation (Responsiveness)**:
    *   **Mobile (Tactical View)**: Focus on immediate action. "Binoculars" metaphor.
    *   **Tablet (Campaign View)**: Comparison and medium-term context.
    *   **Desktop (Strategic View)**: The complete "Command Room" for deep planning.
3.  **Layers of Truth**: The system never says "Error". It degrades gracefully from "Realtime" to "Recent Data", "Stale Data", and finally "Historical", keeping the user informed about the reliability of the information.

## ✨ Key Features

### 1. Data Nervous System (Layers of Truth)
The app manages data integrity like a living organism:
*   🟢 **Realtime (< 30s)**: Sympathetic System. Immediate reaction.
*   🟡 **Recent (< 5m)**: Cached data. Parasympathetic System.
*   🔴 **Stale (> 5m)**: Degraded mode.
*   🟣 **Historical**: Safety mode (static fallback).

### 2. Temporal Nexus
A comparative analysis tool that normalizes the performance of different assets starting from a zero base. It allows visualizing the correlation between assets across 1H, 24H, and 7D windows.

### 3. AI Integration (Google Gemini)
The **Cognitive Insight** module uses the Google Gemini API to analyze market "sentiment". It digests raw data and provides:
*   A soothing and objective summary.
*   Sentiment (Bullish/Bearish/Neutral).
*   Key influencing factors.

### 4. Biological Feedback ("Biological Tick")
To combat visual anxiety:
*   Price updates do not flash frantically.
*   **Up (Green)**: Persists for 2 seconds.
*   **Down (Red)**: Persists for 3 seconds (recognizing that psychological fear persists longer than euphoria).

### 5. Focused Interface
*   **Asset Injector**: Search and add any asset tracked by CoinGecko.
*   **Strategic Table**: Table with subtle trend overlays and interactive mini-charts.
*   **Focus Mode**: When focusing on an asset, the rest of the interface lowers opacity to reduce visual noise.

## 🚀 How to Run

This project uses React + Vite.

```bash
# Install dependencies
npm install

# Configure Gemini API Key (Optional for AI)
# Create a .env file in the root:
# VITE_GEMINI_API_KEY=your_key_here

# Run in development
npm run dev
```

---
*Developed with React, TypeScript, TailwindCSS, and Google GenAI.*
