import React from 'react';

interface LightInfoCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: 'blue' | 'sky' | 'cyan' | 'teal';
  fullHeight?: boolean;
}

export function LightInfoCard({
  title,
  children,
  icon,
  color = 'blue',
  fullHeight = false
}: LightInfoCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    sky: 'bg-sky-50 border-sky-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    teal: 'bg-teal-50 border-teal-200'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    sky: 'text-sky-600',
    cyan: 'text-cyan-600',
    teal: 'text-teal-600'
  };

  return (
    <div className={`rounded-xl border-2 ${colorClasses[color]} p-6 shadow-sm ${fullHeight ? 'h-full' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        {icon && <span className={`w-6 h-6 ${iconColorClasses[color]}`}>{icon}</span>}
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      {children}
    </div>
  );
}
