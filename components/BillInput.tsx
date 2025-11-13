import React from 'react';
import type { Bill } from '../types';
import TrashIcon from './icons/TrashIcon';

interface BillInputProps {
  bill: Bill;
  onUpdate: (id: string, updatedBill: Partial<Bill>) => void;
  onRemove: (id:string) => void;
  currencySymbol: string;
}

const BillInput: React.FC<BillInputProps> = ({ bill, onUpdate, onRemove, currencySymbol }) => {
  return (
    <div className="flex items-center space-x-2 animate-fade-in-up">
      <input
        type="text"
        placeholder="Bill Name (e.g., Rent)"
        value={bill.name}
        onChange={(e) => onUpdate(bill.id, { name: e.target.value })}
        className="flex-grow bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
      />
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{currencySymbol}</span>
        <input
          type="number"
          placeholder="Amount"
          value={bill.amount || ''}
          onChange={(e) => onUpdate(bill.id, { amount: Math.max(0, parseFloat(e.target.value) || 0) })}
          min="0"
          className="w-36 bg-slate-700/50 border border-slate-600 rounded-md pl-7 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
        />
      </div>
      <button
        onClick={() => onRemove(bill.id)}
        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
        aria-label="Remove bill"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default BillInput;