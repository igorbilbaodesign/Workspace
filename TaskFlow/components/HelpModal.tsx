import React, { useState, useRef, useEffect } from 'react';
import { X, Terminal, Plus, Search, ArrowUp, Sparkles, ChevronLeft, ChevronRight, Download, Activity, Camera, Zap, Layers, Database, WifiOff, Cpu, PlayCircle, MousePointer2, Check, Video } from 'lucide-react';
import TaskItem from './TaskItem';
import Stats from './Stats';
import { Task } from '../types';
import html2canvas from 'html2canvas';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
}

// --- LIVE DEMO COMPONENT ---
const LiveDemo = () => {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<any[]>([
    { id: '1', text: 'Review quarter goals', completed: true, priority: 'low' },
    { id: '2', text: 'Sync with design team', completed: false, priority: 'high' }
  ]);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 80 }); // % coordinates
  const [isClicking, setIsClicking] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const runSequence = async () => {
      // RESET
      if (stage === 0) {
        setText("");
        setTasks([
            { id: '1', text: 'Review quarter goals', completed: true, priority: 'low' },
            { id: '2', text: 'Sync with design team', completed: false, priority: 'high' }
        ]);
        setCursorPos({ x: 50, y: 90 }); // Start near bottom
        timeout = setTimeout(() => setStage(1), 1000);
      }

      // 1. MOVE TO INPUT
      if (stage === 1) {
        setCursorPos({ x: 50, y: 85 }); // Center over input
        timeout = setTimeout(() => setStage(2), 800);
      }

      // 2. TYPE TEXT
      if (stage === 2) {
        const targetText = "Deploy to production #urgent";
        let currentLen = 0;
        const typeInterval = setInterval(() => {
          currentLen++;
          setText(targetText.substring(0, currentLen));
          if (currentLen === targetText.length) {
            clearInterval(typeInterval);
            setTimeout(() => setStage(3), 500);
          }
        }, 50);
      }

      // 3. MOVE TO ADD BUTTON
      if (stage === 3) {
        setCursorPos({ x: 92, y: 85 }); // Right side of bar
        timeout = setTimeout(() => setStage(4), 800);
      }

      // 4. CLICK ADD
      if (stage === 4) {
        setIsClicking(true);
        setTimeout(() => {
            setIsClicking(false);
            setTasks(prev => [{ id: '3', text: 'Deploy to production', priority: 'high', tags: ['urgent'] }, ...prev]);
            setText("");
            setTimeout(() => setStage(5), 500);
        }, 200);
      }

      // 5. MOVE TO COMPLETE TASK
      if (stage === 5) {
        setCursorPos({ x: 15, y: 25 }); // Move to checkbox of first item
        timeout = setTimeout(() => setStage(6), 1000);
      }

      // 6. CLICK COMPLETE
      if (stage === 6) {
        setIsClicking(true);
        setTimeout(() => {
            setIsClicking(false);
            setTasks(prev => prev.map((t, i) => i === 0 ? { ...t, completed: true } : t));
            setTimeout(() => setStage(7), 1500);
        }, 200);
      }

      // 7. LOOP
      if (stage === 7) {
        setStage(0);
      }
    };

    runSequence();

    return () => clearTimeout(timeout);
  }, [stage]);

  return (
    <div className="w-full max-w-[380px] h-[300px] bg-white dark:bg-[#050505] rounded-xl border border-gray-200 dark:border-[#333] shadow-2xl relative overflow-hidden flex flex-col font-sans select-none transform scale-110">
      
      {/* Fake Header */}
      <div className="h-8 border-b border-gray-100 dark:border-[#222] flex items-center px-3 gap-1">
        <div className="w-2 h-2 rounded-full bg-red-400"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
        <div className="w-2 h-2 rounded-full bg-green-400"></div>
      </div>

      {/* Fake List */}
      <div className="flex-1 p-3 space-y-2 overflow-hidden">
        {tasks.map(t => (
            <div key={t.id} className={`flex items-center gap-2 p-2 rounded-lg border transition-all duration-300 ${t.completed ? 'opacity-50 bg-gray-50 dark:bg-[#111] border-transparent' : 'bg-white dark:bg-[#111] border-gray-100 dark:border-[#222] shadow-sm'}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${t.completed ? 'bg-gray-400 border-transparent' : 'border-gray-300 dark:border-gray-600'}`}>
                    {t.completed && <Check size={10} className="text-white"/>}
                </div>
                <div className="flex-1 min-w-0">
                    <div className={`text-[10px] font-medium truncate ${t.completed ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>{t.text}</div>
                    {t.tags && (
                        <div className="flex gap-1 mt-1">
                            {t.tags.map((tag: string) => (
                                <span key={tag} className="text-[8px] px-1 bg-gray-100 dark:bg-[#222] rounded text-gray-500">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={`w-1 h-6 rounded-full ${t.priority === 'high' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
            </div>
        ))}
      </div>

      {/* Fake Omnibar Container */}
      <div className="p-3 bg-gradient-to-t from-white dark:from-[#050505] to-transparent">
        <div className="bg-[#f4f4f5] dark:bg-[#111] border border-gray-300 dark:border-[#333] rounded-full p-1.5 flex items-center gap-2 shadow-lg">
            <div className="w-6 h-6 bg-white dark:bg-[#222] rounded-full flex items-center justify-center text-gray-400">
                <Plus size={12} />
            </div>
            <div className="flex-1 text-[10px] font-medium text-gray-800 dark:text-gray-200 pl-1 h-4 flex items-center">
                {text}
                {stage === 2 && <span className="w-0.5 h-3 bg-blue-500 animate-pulse ml-0.5"></span>}
            </div>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white transition-all ${text.length > 0 ? 'bg-blue-500 scale-100' : 'bg-gray-300 dark:bg-[#222] scale-90'}`}>
                <ArrowUp size={12} />
            </div>
        </div>
      </div>

      {/* FAKE CURSOR */}
      <div 
        className="absolute w-4 h-4 text-black dark:text-white pointer-events-none transition-all duration-700 ease-in-out z-50 drop-shadow-lg"
        style={{ 
            left: `${cursorPos.x}%`, 
            top: `${cursorPos.y}%`,
            transform: `translate(-2px, -2px) scale(${isClicking ? 0.8 : 1})`
        }}
      >
        <MousePointer2 size={24} fill="currentColor" className="opacity-90" />
      </div>

    </div>
  );
};


const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // --- MOCK DATA ---
  const mockTask: Task = {
    id: 'demo-task',
    text: 'Review Q4 financial reports',
    completed: false,
    priority: 'high',
    createdAt: Date.now(),
    tags: ['finance', 'urgent'],
    isEditing: false
  };

  const mockStats = {
    total: 12,
    completed: 8,
    active: 4
  };

  // --- RENDER HELPERS ---
  const renderOmnibarAdd = () => (
    <div className="flex items-center gap-2 p-3 rounded-[24px] bg-[#f4f4f5] dark:bg-[#000] border border-gray-400 dark:border-[#333] shadow-md w-full">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-[#222] text-black dark:text-gray-100 flex-shrink-0">
        <Plus size={20} />
      </div>
      <div className="flex-1 font-medium text-black dark:text-gray-100 text-sm truncate">
        Buy coffee <span className="text-blue-600">#shopping</span>
      </div>
      <div className="bg-gray-200 dark:bg-[#222] text-[10px] font-mono font-bold py-1 px-2 rounded-lg text-gray-700 dark:text-gray-500 hidden sm:block">HI</div>
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-lg flex-shrink-0">
        <ArrowUp size={20} strokeWidth={3} />
      </div>
    </div>
  );

  const renderOmnibarAI = () => (
    <div className="relative flex items-center gap-2 p-3 rounded-[24px] bg-[#f4f4f5] dark:bg-[#000] border border-purple-300 dark:border-purple-900 ring-2 ring-purple-500/20 shadow-md w-full">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex-shrink-0">
        <Search size={20} />
      </div>
      <div className="flex-1 font-medium text-black dark:text-gray-100 text-sm truncate">
        Show me urgent work tasks...
      </div>
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-[#222] text-gray-500 flex-shrink-0">
        <Sparkles size={18} />
      </div>
    </div>
  );

  const renderIntro = () => (
    <div className="flex flex-col items-center justify-center space-y-6 transform scale-110">
      <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-3 transition-transform hover:rotate-6">
         <Zap size={48} className="text-white fill-current" />
      </div>
      <div className="text-center space-y-2">
         <h2 className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white">TASK<span className="font-light opacity-70">FLOW</span></h2>
         <div className="inline-block px-3 py-1 rounded-full bg-gray-200 dark:bg-[#222] text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em]">
            Neural Deck v2.0
         </div>
      </div>
    </div>
  );

  const renderArchitecture = () => (
    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <Database size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Local First</span>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
                <WifiOff size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Offline Ready</span>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                <Zap size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Instant Load</span>
        </div>
        <div className="bg-white dark:bg-[#1a1a1a] p-5 rounded-2xl shadow-sm border border-gray-200 dark:border-[#333] flex flex-col items-center gap-3 transition-transform hover:-translate-y-1">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Cpu size={24} />
            </div>
            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">AI Powered</span>
        </div>
    </div>
  );

  // --- SLIDES CONFIGURATION ---
  const slides = [
    {
      id: 'intro',
      title: 'Welcome to TaskFlow',
      icon: <Zap size={20} className="text-indigo-600" />,
      color: 'bg-indigo-100 dark:bg-indigo-900/30',
      description: "TaskFlow Pro is a next-generation task management system designed for speed and focus. It combines a minimal aesthetic with powerful features like state persistence, history management, and privacy-focused design.",
      component: <div className="pointer-events-none select-none w-full max-w-md flex justify-center">{renderIntro()}</div>
    },
    {
      id: 'arch',
      title: 'Neural Architecture',
      icon: <Layers size={20} className="text-orange-600" />,
      color: 'bg-orange-100 dark:bg-orange-900/30',
      description: "Built on a local-first philosophy. Your data lives in your browser's IndexedDB for instant load times and offline capability. No sign-ups, no tracking—just pure productivity available anytime, anywhere.",
      component: <div className="pointer-events-none select-none w-full max-w-md flex justify-center">{renderArchitecture()}</div>
    },
    {
      id: 'demo',
      title: 'Live Preview',
      icon: <PlayCircle size={20} className="text-red-600" />,
      color: 'bg-red-100 dark:bg-red-900/30',
      description: "Watch how simple it is to stay organized. Just type naturally in the Omnibar to add tasks with tags (#) and priority. The interface is designed to keep you in the flow state without navigating through complex menus.",
      component: <div className="pointer-events-none select-none w-full flex justify-center py-4"><LiveDemo /></div>
    },
    {
      id: 'task',
      title: 'Smart Task Item',
      icon: <Plus size={20} className="text-blue-600" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      description: "Experience rich task cards designed for clarity. Each card features a color-coded priority strip, instant tag visualization, and intuitive hover actions. Click the checkbox to complete, or hover to reveal edit and delete options.",
      component: <div className="pointer-events-none select-none w-full max-w-md transform scale-110"><TaskItem task={mockTask} onToggle={()=>{}} onDelete={()=>{}} onEdit={()=>{}} onToggleEdit={()=>{}} /></div>
    },
    {
      id: 'stats',
      title: 'Real-time Analytics',
      icon: <Activity size={20} className="text-green-600" />,
      color: 'bg-green-100 dark:bg-green-900/30',
      description: "Stay on top of your productivity with the embedded dashboard. The stats panel updates instantly as you work, providing a visual breakdown of your completion rate, active pending items, and total workload.",
      component: <div className="pointer-events-none select-none w-full max-w-md transform scale-105"><Stats stats={mockStats} isDark={isDark} /></div>
    },
    {
      id: 'input',
      title: 'Command Input',
      icon: <Terminal size={20} className="text-gray-600 dark:text-gray-300" />,
      color: 'bg-gray-200 dark:bg-gray-800',
      description: "The Omnibar is your command center. Type naturally to add tasks. Use hashtags like #work or #home to automatically tag items. You can also toggle priority (Low, Medium, High) directly from the bar before adding.",
      component: <div className="pointer-events-none select-none w-full max-w-md transform scale-110">{renderOmnibarAdd()}</div>
    },
    {
      id: 'ai',
      title: 'AI Semantic Search',
      icon: <Sparkles size={20} className="text-purple-600" />,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      description: "Switch to Search Mode and leverage Gemini AI. Don't just search for keywords—search for intent. Try 'What do I need to buy?' or 'Show me urgent coding tasks', and the system will intelligently filter your list.",
      component: <div className="pointer-events-none select-none w-full max-w-md transform scale-110">{renderOmnibarAI()}</div>
    }
  ];

  const currentSlide = slides[currentIndex];

  // --- ACTIONS ---
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  // --- HELPERS ---
  const downloadBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generateVideoFallback = async () => {
    const element = slideRef.current;
    if (!element) return;

    // Temporary Style Overrides to prevent cutting
    const originalOverflow = element.style.overflow;
    element.style.overflow = 'visible';
    
    // Find all truncated elements and force full display
    const truncatedElements = element.querySelectorAll('.truncate');
    truncatedElements.forEach((el) => {
        (el as HTMLElement).style.whiteSpace = 'normal';
        (el as HTMLElement).style.overflow = 'visible';
    });

    try {
        const fps = 10;
        const durationMs = 10000;
        
        // Setup Capture Canvas
        const canvas = document.createElement('canvas');
        const rect = element.getBoundingClientRect();
        canvas.width = rect.width; // Use exact width
        canvas.height = rect.height;
        const ctx = canvas.getContext('2d');
        
        if(!ctx) throw new Error("Context creation failed");

        const stream = canvas.captureStream(fps);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            downloadBlob(blob, 'taskflow-demo-generated.webm');
        };

        recorder.start();

        const startTime = Date.now();
        // Capture Loop
        while (Date.now() - startTime < durationMs) {
             const frameStart = Date.now();
             
             const frame = await html2canvas(element, {
                 backgroundColor: isDark ? '#0a0a0a' : '#f4f4f5',
                 scale: 2, // Good quality
                 logging: false,
                 useCORS: true
             });
             
             ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
             
             const elapsed = Date.now() - frameStart;
             const delay = Math.max(0, (1000/fps) - elapsed);
             await new Promise(r => setTimeout(r, delay));
        }

        recorder.stop();

    } catch (e) {
        console.error("Generation failed", e);
        alert("Video generation failed. Please try again.");
    } finally {
        // Restore Styles
        element.style.overflow = originalOverflow;
        truncatedElements.forEach((el) => {
            (el as HTMLElement).style.whiteSpace = '';
            (el as HTMLElement).style.overflow = '';
        });
    }
  };

  const handleDownload = async () => {
    if (currentSlide.id === 'demo') {
      setIsCapturing(true);
      try {
        // 1. Try to fetch static asset
        const response = await fetch("/assets/preview.mp4");
        
        if (response.ok) {
            // 2a. If found, download it nicely
            const blob = await response.blob();
            downloadBlob(blob, "taskflow-demo.mp4");
        } else {
            // 2b. If not found (404), fallback to generation
            console.warn("Static preview not found, starting fallback generation...");
            await generateVideoFallback();
        }
      } catch (err) {
        console.warn("Fetch error, generating fallback...", err);
        await generateVideoFallback();
      } finally {
        setIsCapturing(false);
      }
    } else {
      await captureImage();
    }
  };

  const captureImage = async () => {
    if (!slideRef.current || isCapturing) return;
    setIsCapturing(true);

    try {
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(slideRef.current, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 1600,
        onclone: (clonedDoc) => {
            const el = clonedDoc.getElementById('slide-container');
            if (el) {
                el.style.height = 'auto';
                el.style.maxHeight = 'none';
                el.style.overflow = 'visible';
                el.style.width = '1200px'; 
                el.style.flexDirection = 'row';
                
                const textCol = el.firstElementChild as HTMLElement;
                if (textCol) {
                    textCol.style.flex = '1';
                    textCol.style.height = 'auto';
                    textCol.style.padding = '60px';
                }

                const visualCol = el.children[1] as HTMLElement;
                if (visualCol) {
                    visualCol.style.overflow = 'visible'; 
                    visualCol.style.height = 'auto';
                    visualCol.style.flex = '1';
                }

                const allTruncated = el.querySelectorAll('.truncate');
                allTruncated.forEach((t) => {
                    (t as HTMLElement).style.whiteSpace = 'normal';
                    (t as HTMLElement).style.overflow = 'visible';
                    (t as HTMLElement).style.textOverflow = 'clip';
                });

                const taskItems = el.querySelectorAll('.group.relative.flex.items-stretch.overflow-hidden');
                taskItems.forEach((t) => {
                    (t as HTMLElement).style.overflow = 'visible';
                });
            }
        }
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `taskflow-${currentSlide.id}-card.png`;
      link.click();
    } catch (err) {
      console.error("Snapshot failed:", err);
      alert("Failed to capture image");
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#f4f4f5] dark:bg-[#0a0a0a] w-full max-w-4xl rounded-3xl shadow-2xl border border-gray-300 dark:border-gray-800 overflow-hidden flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-300 dark:border-gray-800 flex justify-between items-center bg-gray-100/50 dark:bg-[#0f0f0f]/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Terminal size={20} className="text-blue-500"/>
              FEATURE GALLERY
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content Area (Split View) */}
        {/* ID added for html2canvas targeting */}
        <div 
          id="slide-container"
          ref={slideRef}
          className="flex-1 overflow-hidden flex flex-col md:flex-row"
        >
          
          {/* Left: Info & Description */}
          <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#111]">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${currentSlide.color}`}>
              {currentSlide.icon}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              {currentSlide.title}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              {currentSlide.description}
            </p>
          </div>

          {/* Right: Visual Showcase */}
          <div className="flex-1 bg-[#eaeaea] dark:bg-[#050505] relative flex items-center justify-center p-8 overflow-hidden">
            {/* Decorative BG elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -top-10 -right-10"></div>
            
            <div key={currentIndex} className="relative z-10 animate-in fade-in zoom-in-95 duration-500 w-full flex justify-center">
               {currentSlide.component}
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-300 dark:border-gray-800 flex items-center justify-between">
           
           {/* Dots Indicator */}
           <div className="flex gap-2">
             {slides.map((_, idx) => (
               <button
                 key={idx}
                 onClick={() => setCurrentIndex(idx)}
                 className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-blue-600' : 'bg-gray-400 dark:bg-gray-600'}`}
               />
             ))}
           </div>

           {/* Controls + Download Action */}
           <div className="flex gap-4 items-center">
             
             {/* Action Button moved here */}
             <button 
                onClick={handleDownload}
                disabled={isCapturing}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm border
                  ${isCapturing 
                    ? 'bg-gray-200 dark:bg-[#333] text-gray-500 cursor-wait border-transparent'
                    : currentSlide.id === 'demo'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500'
                      : 'bg-white dark:bg-[#222] hover:bg-gray-50 dark:hover:bg-[#333] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                  }`}
               >
                 {isCapturing ? (
                   <Activity size={16} className="animate-spin" />
                 ) : (
                   currentSlide.id === 'demo' ? <Download size={16} /> : <Camera size={16} />
                 )}
                 {isCapturing 
                   ? (currentSlide.id === 'demo' ? 'Processing...' : 'Saving...') 
                   : (currentSlide.id === 'demo' ? 'Download' : 'Save')
                 }
             </button>

             {/* Divider */}
             <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

             {/* Nav Buttons */}
             <div className="flex gap-2">
               <button 
                 onClick={prevSlide}
                 className="p-3 rounded-full bg-white dark:bg-black border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#222] transition-colors"
               >
                 <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
               </button>
               <button 
                 onClick={nextSlide}
                 className="p-3 rounded-full bg-black dark:bg-white border border-transparent text-white dark:text-black hover:opacity-80 transition-opacity"
               >
                 <ChevronRight size={20} />
               </button>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default HelpModal;