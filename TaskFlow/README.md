# TaskFlow Pro // Neural Deck

> **Version:** 2.0 (React Implementation)  
> **Based on:** "Detailed Planning: Advanced Task List App"

## 📋 Overview & Proposal

**TaskFlow Pro** is the realization of a high-performance task management system, designed with a "Local-First" philosophy and a Cyberpunk Minimalist aesthetic.

This project stems from the proposal to create an application that combines the speed of native interfaces with the flexibility of the Web, eliminating login barriers and internet dependency for critical functionalities. The architecture was adapted from the original planning (focused on pure ES6 Modules) to a modern ecosystem using **React 19** and **TypeScript**, maintaining the principles of robustness and modularity.

### 🌟 Key Features

*   **⚡ Neural Deck Architecture:** A fluid interface where the command bar ("Omnibar") is the center of the experience.
*   **🧠 AI Integration (Gemini):**
    *   **Intelligent Decomposition:** Automatically breaks down complex tasks into actionable sub-tasks.
    *   **Semantic Filter:** Allows searching by "intent" (e.g., "urgent work stuff") rather than just keywords.
*   **💾 Advanced Local Persistence:** Uses **IndexedDB** to store thousands of tasks with zero latency, persisting state across sessions.
*   **🎨 Dynamic Themes:** Dark Mode (default) and Light Mode, with smooth transitions and prevention of "flashbang" on load.
*   **⏪ Time Machine:** Robust Undo/Redo system that tracks the application state.
*   **📊 Real-Time Analytics:** Integrated dashboard with completion rates and productivity metrics.
*   **📱 Responsive Design & PWA:** Functions like a native app on mobile devices, with gesture support and an adaptive HUD.

---

## 🚀 How to Run

This project uses a modern structure without the need for manually configured complex bundlers, running directly via ESM/Real-time Transpilation or standard build.

### Prerequisites
*   Node.js (v18 or higher)
*   Google Gemini API Key (for AI functionalities)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/taskflow-pro.git

# Enter the directory
cd taskflow-pro

# Install dependencies
npm install

# Configure API Key
# Create a .env file or export the variable in the terminal
export API_KEY="your-gemini-key-here"

# Start the development server
npm start
```

---

## 🗺️ Implementation Roadmap (Status)

Based on the original planning document:

- [x] **Phase 1: Semantic Structure:** Optimized and Accessible HTML5.
- [x] **Phase 2: Styling:** Tailwind CSS with custom Design Tokens.
- [x] **Phase 3: Application Logic:** Migrated from `StateManager.js` to React Reducers.
- [x] **Phase 4: DOM Manipulation:** Virtual DOM via React 19.
- [x] **Phase 5: Persistence:** Service layer over IndexedDB.
- [x] **Phase 6: Events:** Custom Hooks and Native Event Handlers.
- [x] **Phase 7: Integration:** Service Workers and PWA Manifest.

---

## 🤝 Contribution

The project follows **Clean Code** and **SOLID** principles. Pull requests are welcome, especially for improvements in the accessibility layer and new AI integrations.