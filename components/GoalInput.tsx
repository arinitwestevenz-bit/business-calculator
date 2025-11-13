import React from 'react';

interface GoalInputProps {
  label: string;
  description: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currencySymbol: string;
  icon: React.ReactNode;
}

const GoalInput: React.FC<GoalInputProps> = ({ label, description, value, onChange, currencySymbol, icon }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
        {icon}
        <span>{label}</span>
      </h2>
      <p className="text-slate-400 mb-4">{description}</p>
      <div className="flex items-center w-full bg-slate-700/50 border border-slate-600 rounded-md focus-within:ring-2 focus-within:ring-sky-500 hover:border-slate-500 transition-all text-lg">
        <span className="pl-4 pr-2 text-slate-400 select-none">{currencySymbol}</span>
        <input
          type="number"
          placeholder={`${label} Goal`}
          value={value || ''}
          onChange={onChange}
          min="0"
          className="w-full bg-transparent pr-4 py-3 text-white focus:outline-none"
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default GoalInput;