import React from 'react';
import { DataIntegrityStatus } from '../types';
import { Wifi, WifiOff, Clock, Database } from 'lucide-react';

interface Props {
  status: DataIntegrityStatus;
  lastFetch?: number;
}

export const StatusIndicator: React.FC<Props> = ({ status, lastFetch }) => {
  
  const getStatusConfig = () => {
    switch (status) {
      case DataIntegrityStatus.REALTIME:
        return {
          color: 'text-trade-up',
          bg: 'bg-trade-up/10',
          border: 'border-trade-up/30',
          icon: <Wifi size={10} />,
          pulse: true
        };
      case DataIntegrityStatus.RECENT:
        return {
          color: 'text-status-warn', // Amber
          bg: 'bg-status-warn/10',
          border: 'border-status-warn/30',
          icon: <Clock size={10} />,
          pulse: false
        };
      case DataIntegrityStatus.STALE:
        return {
          color: 'text-trade-down', // Red
          bg: 'bg-trade-down/10',
          border: 'border-trade-down/30',
          icon: <WifiOff size={10} />,
          pulse: false
        };
      case DataIntegrityStatus.HISTORICAL:
      default:
        return {
          color: 'text-status-offline', // Purple
          bg: 'bg-status-offline/10',
          border: 'border-status-offline/30',
          icon: <Database size={10} />,
          pulse: false
        };
    }
  };

  const config = getStatusConfig();
  
  const timeDisplay = lastFetch 
    ? new Date(lastFetch).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : '--:--:--';

  return (
    <div className="flex items-center gap-3">
      {/* Time Display (Explicit Freshness) */}
      <span className="hidden sm:block text-[10px] font-mono text-text-muted">
        SYNC: <span className="text-text-main">{timeDisplay}</span>
      </span>

      {/* Status Badge */}
      <div className={`flex items-center gap-2 px-2 py-1 rounded border text-[10px] font-bold uppercase tracking-wider transition-colors duration-500
          ${config.color} ${config.bg} ${config.border}
      `}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.color.replace('text-', 'bg-')} ${config.pulse ? 'animate-pulse' : ''}`}></div>
        <span className="flex items-center gap-1">
           {status}
        </span>
      </div>
    </div>
  );
};