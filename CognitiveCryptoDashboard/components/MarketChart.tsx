import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface Props {
  data: number[];
  color: string;
  className?: string;
}

export const MarketChart: React.FC<Props> = ({ data, color, className = "h-full w-full" }) => {
  if (!data || data.length === 0) return null;

  // Transform flat array into object array for Recharts
  const chartData = data.map((price, index) => ({
    index,
    price
  }));

  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);
  
  // Calculate buffer. If min === max (flat line), use a fallback percentage of the price
  let buffer = (maxPrice - minPrice) * 0.1;
  if (buffer === 0) buffer = maxPrice * 0.05;

  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`colorPrice-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <YAxis 
            hide 
            domain={[minPrice - buffer, maxPrice + buffer]} 
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#colorPrice-${color})`}
            isAnimationActive={false} // Disable animation for better performance on lists
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};