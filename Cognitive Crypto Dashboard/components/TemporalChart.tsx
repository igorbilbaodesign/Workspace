
import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { CryptoData } from '../types';
import { CurveType } from 'recharts/types/shape/Curve';

interface Props {
  data: any[];
  activeAssets: CryptoData[];
  colors: string[];
  isLoading: boolean;
  curveType?: CurveType; // Allow dynamic curve interpolation
}

export const TemporalChart: React.FC<Props> = ({ 
  data, 
  activeAssets, 
  colors, 
  isLoading, 
  curveType = 'monotone' 
}) => {
  
  // Memoize gradients to avoid re-rendering defs constantly
  const gradients = useMemo(() => (
    <defs>
      {activeAssets.map((asset, idx) => (
        <linearGradient key={asset.id} id={`grad-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors[idx % colors.length]} stopOpacity={0.15}/>
          <stop offset="95%" stopColor={colors[idx % colors.length]} stopOpacity={0}/>
        </linearGradient>
      ))}
    </defs>
  ), [activeAssets, colors]);

  if (data.length === 0 && !isLoading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center text-text-muted text-xs font-mono">
            WAITING FOR DATA STREAM...
        </div>
      );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
        {gradients}
        
        <XAxis hide />
        <YAxis 
            tick={{fill: '#64748b', fontSize: 10, fontFamily: 'monospace'}} 
            tickFormatter={(val) => `${val > 0 ? '+' : ''}${val.toFixed(0)}%`}
            axisLine={false}
            tickLine={false}
        />
        <ReferenceLine y={0} stroke="#2a3441" strokeDasharray="3 3" />
        <Tooltip 
            contentStyle={{ backgroundColor: '#0b0e11', borderColor: '#2a3441', fontSize: '12px' }}
            itemStyle={{ padding: 0 }}
            formatter={(value: number) => [`${value > 0 ? '+' : ''}${value.toFixed(2)}%`]}
            labelFormatter={() => ''}
        />
        
        {activeAssets.map((asset, idx) => {
           // Safety check: ensure this asset key exists in the data point
           if (data.length > 0 && data[0][asset.id] === undefined) return null;

           return (
            <Area 
              key={asset.id}
              type={curveType} 
              dataKey={asset.id} 
              stroke={colors[idx % colors.length]} 
              fill={`url(#grad-${asset.id})`}
              strokeWidth={2.5}
              name={asset.name}
              isAnimationActive={true}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
           );
        })}
      </AreaChart>
    </ResponsiveContainer>
  );
};
