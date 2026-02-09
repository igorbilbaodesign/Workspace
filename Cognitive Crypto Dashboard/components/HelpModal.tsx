
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

// Import independent steps
import { IntroVisual, introData } from './help/StepIntro';
import { TechVisual, techData } from './help/StepTech';
import { InterfaceVisual, interfaceData } from './help/StepInterface';
import { AiVisual, aiData } from './help/StepAI';
import { NexusVisual, nexusData } from './help/StepNexus';
import { StrategicVisual, strategicData } from './help/StepStrategic';
import { ExpandedVisual, expandedData } from './help/StepExpanded';
import { MobileVisual, mobileData } from './help/StepMobile';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { component: IntroVisual, data: introData },
  { component: TechVisual, data: techData },
  { component: InterfaceVisual, data: interfaceData },
  { component: AiVisual, data: aiData },
  { component: NexusVisual, data: nexusData },
  { component: StrategicVisual, data: strategicData },
  { component: ExpandedVisual, data: expandedData },
  { component: MobileVisual, data: mobileData }
];

export const HelpModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isOpen) setCurrentStep(0);
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else onClose();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const CurrentVisual = steps[currentStep].component;
  const currentData = steps[currentStep].data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-term-bg border border-term-border rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[600px] relative">
        
        {/* Close Button (Absolute Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors z-50 p-2 hover:bg-white/5 rounded-full"
        >
          <X size={20} />
        </button>

        {/* Main Body Area (Flex Grow) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            
            {/* Left: Text Content - CENTERED */}
            <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-start bg-term-bg z-10 border-r border-term-border relative">
                
                {/* Content Group */}
                <div className="space-y-6">
                   <h3 className="text-xs font-bold text-term-accent uppercase tracking-widest flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-term-accent rounded-sm"></span>
                     {currentData.subtitle}
                   </h3>
                   <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                     {currentData.title}
                   </h2>
                   <p className="text-sm lg:text-base text-text-muted leading-relaxed max-w-sm">
                     {currentData.description}
                   </p>
                </div>
                
                {/* Step Counter - Absolute Position to avoid affecting center alignment */}
                <div className="absolute bottom-8 left-12 text-[10px] text-text-muted/40 font-mono uppercase tracking-widest">
                   Guide Step {currentStep + 1} / {steps.length}
                </div>
            </div>

            {/* Right: Visual Snapshot */}
            <div className="w-full md:w-1/2 bg-term-panel relative flex items-center justify-center p-8 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
                {/* Visual Container with consistent shadow/scale */}
                <div className="relative z-10 transform transition-all duration-500 hover:scale-105">
                    <CurrentVisual />
                </div>
            </div>
        </div>

        {/* Footer: Controls */}
        <div className="h-20 bg-term-header/50 border-t border-term-border flex items-center justify-between px-8 shrink-0 backdrop-blur-sm">
            
            {/* Previous Button */}
            <button 
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-all px-4 py-2 rounded hover:bg-white/5
                ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-text-muted hover:text-white'}`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {/* Progress Bars */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 rounded-full transition-all duration-500 
                    ${idx === currentStep ? 'w-8 bg-term-accent shadow-glow' : 'w-2 bg-term-border hover:bg-term-border/80'}
                  `}
                ></div>
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-term-accent hover:bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-glow hover:translate-x-1"
            >
              {currentStep === steps.length - 1 ? 'Start Terminal' : 'Next'} 
              <ChevronRight size={16} />
            </button>
        </div>

      </div>
    </div>
  );
};
