# Technical Documentation: TaskFlow Pro

This documentation details the technological choices, architecture patterns, and specific implementations of TaskFlow Pro. The system was built on the premise of **Performance**, **Persistence**, and **Intelligence**.

## 🛠️ Tech Stack

| Category | Technology | Justification |
|-----------|------------|---------------|
| **Core** | React 19 + TypeScript | Leveraging new React APIs (optimized hooks) and static typing for robustness. |
| **Styling** | Tailwind CSS | Utility-first CSS for rapid development and a consistent design system (`cyber` theme). |
| **State** | React `useReducer` + Context | Predictable state management without the overhead of external libraries like Redux. |
| **Persistence** | IndexedDB (Native) | Storage of large data volumes on the client (Local-First) without blocking the main thread. |
| **Generative AI** | Google GenAI SDK | Integration with **Gemini 3 Flash** models for fast reasoning and low latency. |
| **Icons** | Lucide React | Lightweight and highly customizable SVG icons. |
| **Multimedia** | html2canvas | Client-side screenshot generation and video rendering for sharing. |

---

## 🏗️ Application Architecture

The application follows an architecture based on **Services** and **Functional Components**, clearly separating business logic from the interface.

### Directory Structure
```
/
├── components/     # UI Components (Omnibar, TaskItem, Dashboard)
├── services/       # Business Logic (Storage, AI, API)
├── reducers/       # State Machines (App Reducer)
├── hooks/          # Reusable Logic (useHistory)
├── utils/          # Helpers and Mock Data
└── types.ts        # TypeScript Type Definitions
```

### 1. State Management (`reducers/appReducer.ts`)
Unlike the original plan which suggested a `StateManager` class (Observer Pattern), we opted for the native React **Flux** pattern via `useReducer`.
*   **Immutability:** All state updates return new objects, facilitating change tracking.
*   **Actions:** Strictly typed in `types.ts` to prevent dispatch errors.
*   **Side-Effects:** Isolated in `useEffect` at the root component (`App.tsx`), keeping the reducer pure.

### 2. Hybrid Persistence (`services/storage.ts`)
We implemented a "Hydration" and "Lazy Loading" strategy:
*   **Theme:** Stored in `localStorage` (synchronous) to avoid FOUC (Flash of Unstyled Content) or a bright flash when loading dark mode. The hydration script runs in the HTML `<head>`.
*   **Tasks:** Stored in **IndexedDB** (asynchronous).
    *   The `IndexedDBService` class manages database opening, transactions, and versioning.
    *   Uses a "Save on Change" pattern with implicit debouncing via React's render cycle.

### 3. AI Integration (`services/geminiService.ts`)
AI is not just a chatbot, but a functional tool:
*   **Smart Filter:** The system prompt receives the list of tasks and the user query, returning an array of IDs. This allows filters like "Quick things to do now" based on task text.
*   **Task Breakdown:** Uses the model to break large tasks into JSON sub-tasks, which are then injected into the state.
*   **Model:** Uses `gemini-3-flash-preview` for maximum response speed.

### 4. History System (`hooks/useHistory.ts`)
Implementation of a **Past-Present-Future** data structure:
*   Maintains a buffer of the last 20 states.
*   Allows temporal navigation (Undo/Redo) without reloading the page.
*   Optimized to store references where possible, although currently stores snapshots of the task array.

### 5. Feature Gallery & Video Gen (`components/HelpModal.tsx`)
an advanced technical feature is the frontend video generation system:
*   **Fallback Strategy:** Tries to load a pre-rendered video. If it fails (404), the browser takes on the role of renderer.
*   **Canvas Recording:** Uses `html2canvas` in a loop to capture frames from a DOM component and assemble them into a `video/webm` Blob in real-time.

---

## 🎨 UI/UX Decisions

### Dark Mode by Default
We changed the initialization logic in `index.html` to prioritize the dark theme (`class="dark"`). The system checks `localStorage` only to *remove* the class if the user has explicitly chosen "light".

### Centralized Omnibar
The UI revolves around a floating input bar (inspired by launchers like Raycast/Alfred). It dynamically switches context between "Add" and "Search/AI".

---

## 📈 Performance and Optimizations

1.  **Code Splitting:** The use of ESM and modular structure allows modern browsers to load only what is necessary.
2.  **Virtualization (Conceptual):** Although we don't use a windowing lib (like react-window) due to scope, the DOM is kept lightweight by rendering only the filtered list.
3.  **Non-Blocking Storage:** The use of IndexedDB ensures that read/write operations of thousands of tasks do not freeze the UI (unlike localStorage).
4.  **CSS Purge:** Tailwind CSS generates only the classes used in the final bundle.