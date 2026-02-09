import React from 'react';
import { useBiologicalTick } from '../hooks/useBiologicalTick';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Props {
  value: number;
  isCurrency?: boolean;
  className?: string;
  showIcon?: boolean;
}

export const PriceTicker: React.FC<Props> = ({ 
  value, 
  isCurrency = true, 
  className = '',
  showIcon = false
}) => {
  const direction = useBiologicalTick(value);

  const getBaseStyles = () => {
    switch (direction) {
      case 'up':
        return 'text-trade-up bg-trade-up/10 transition-colors duration-300';
      case 'down':
        return 'text-trade-down bg-trade-down/10 transition-colors duration-500'; // Slower fade for drops
      default:
        return 'text-inherit bg-transparent transition-colors duration-1000';
    }
  };

  return (
    <div className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 -ml-1.5 ${getBaseStyles()} ${className}`}>
      {showIcon && direction === 'up' && <ArrowUp size={12} className="animate-bounce" />}
      {showIcon && direction === 'down' && <ArrowDown size={12} className="animate-bounce" />}
      
      <span className="font-mono tracking-tight">
        {isCurrency ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : `${value.toFixed(2)}%`}
      </span>
    </div>
  );
};