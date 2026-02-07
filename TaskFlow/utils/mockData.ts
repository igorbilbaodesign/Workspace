import { Task } from "../types";

const generateId = () => Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

export const generateMockTasks = (): Task[] => {
  const now = Date.now();
  const day = 86400000; // 24 hours in ms

  // A rich, pre-defined dataset representing a realistic user state.
  // We use offsets to ensure dates are relative to "Now" whenever this is run.
  const staticData = [
    // --- OVERDUE / PAST ---
    { 
      text: "Pay electricity bill", 
      priority: "high", 
      tags: ["finance", "bills"], 
      completed: true, 
      offset: -4 
    },
    { 
      text: "Renew car insurance policy", 
      priority: "high", 
      tags: ["finance", "car", "admin"], 
      completed: false, 
      offset: -3 
    },
    { 
      text: "Weekly team sync notes", 
      priority: "medium", 
      tags: ["work"], 
      completed: true, 
      offset: -2 
    },
    { 
      text: "Buy birthday gift for Sarah", 
      priority: "medium", 
      tags: ["personal", "shopping"], 
      completed: false, 
      offset: -2 
    },
    { 
      text: "Finish reading 'Clean Architecture' Ch. 5", 
      priority: "low", 
      tags: ["learning", "dev"], 
      completed: false, 
      offset: -5 
    },
    
    // --- YESTERDAY / TODAY ---
    { 
      text: "Debug authentication memory leak in production", 
      priority: "high", 
      tags: ["dev", "bug", "urgent"], 
      completed: false, 
      offset: -1 
    },
    { 
      text: "Grocery shopping (Milk, Eggs, Coffee, Avocados)", 
      priority: "medium", 
      tags: ["personal", "shopping"], 
      completed: true, 
      offset: 0 
    },
    { 
      text: "Review Pull Requests #402 and #405", 
      priority: "high", 
      tags: ["work", "dev"], 
      completed: false, 
      offset: 0 
    },
    { 
      text: "Call Mom", 
      priority: "low", 
      tags: ["personal", "family"], 
      completed: false, 
      offset: 0 
    },
    { 
      text: "Workout: Leg day & Cardio", 
      priority: "medium", 
      tags: ["health", "gym"], 
      completed: true, 
      offset: 0 
    },
    { 
      text: "Update project documentation header", 
      priority: "low", 
      tags: ["work", "docs"], 
      completed: false, 
      offset: 0 
    },

    // --- UPCOMING / FUTURE ---
    { 
      text: "Prepare Q3 presentation slides", 
      priority: "high", 
      tags: ["work", "strategy"], 
      completed: false, 
      offset: 1 
    },
    { 
      text: "Dentist appointment (2:00 PM)", 
      priority: "high", 
      tags: ["health"], 
      completed: false, 
      offset: 2 
    },
    { 
      text: "Research new frontend frameworks for dashboard", 
      priority: "low", 
      tags: ["dev", "learning"], 
      completed: false, 
      offset: 2 
    },
    { 
      text: "Clean and organize the garage", 
      priority: "low", 
      tags: ["house"], 
      completed: false, 
      offset: 3 
    },
    { 
      text: "Plan weekend hiking trip itinerary", 
      priority: "medium", 
      tags: ["hobby", "health"], 
      completed: false, 
      offset: 3 
    },
    { 
      text: "Backup NAS drives to cloud", 
      priority: "medium", 
      tags: ["tech", "admin"], 
      completed: false, 
      offset: 4 
    },
    { 
      text: "Quarterly tax review meeting", 
      priority: "high", 
      tags: ["finance", "taxes"], 
      completed: false, 
      offset: 5 
    },
    { 
      text: "Book flight for Tech Conference", 
      priority: "medium", 
      tags: ["work", "travel"], 
      completed: false, 
      offset: 6 
    },
    { 
      text: "Cancel unused streaming subscriptions", 
      priority: "low", 
      tags: ["finance"], 
      completed: false, 
      offset: 7 
    },
  ] as const;

  return staticData.map(item => ({
    id: generateId(),
    text: item.text,
    completed: item.completed,
    priority: item.priority as any,
    tags: [...item.tags],
    createdAt: now + (item.offset * day),
    isEditing: false
  }));
};