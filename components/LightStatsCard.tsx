import React from 'react';

interface LightStatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: 'blue' | 'sky' | 'cyan' | 'purple' | 'green';
  trend?: { direction: 'up' | 'down'; percentage: number };
}

export function LightStatsCard({
  title,
  value,
  icon,
  color = 'blue',
  trend
}: LightStatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    sky: 'bg-sky-50 border-sky-200 text-sky-900',
    cyan: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    green: 'bg-green-50 border-green-200 text-green-900'
  };

  const iconColorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    sky: 'bg-sky-100 text-sky-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600'
  };

  return (
    <div className={`rounded-xl border-2 p-6 shadow-sm hover:shadow-md transition-shadow ${colorClasses[color]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium opacity-75 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            {trend && (
              <span className={`text-sm font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.direction === 'up' ? '+' : '-'}{trend.percentage}%
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColorClasses[color]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
