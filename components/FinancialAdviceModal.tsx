import React from 'react';
import type { FinancialAdvice } from '../types';
import SparklesIcon from './icons/SparklesIcon';
import LightBulbIcon from './icons/LightBulbIcon'; // Assuming this icon exists or will be created

interface FinancialAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice: FinancialAdvice | null;
  isLoading: boolean;
  currency: string;
}

// A simple fallback icon if LightBulbIcon is not created yet.
const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-1.125a6.01 6.01 0 0 0-3 0M12 12.75v-5.25m0 0a6.01 6.01 0 0 1-1.5-1.125a6.01 6.01 0 0 1 3 0m-3 3.375a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm0 0V12.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5Z" />
  </svg>
);


const FinancialAdviceModal: React.FC<FinancialAdviceModalProps> = ({
  isOpen,
  onClose,
  advice,
  isLoading,
  currency,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center space-y-4 my-16">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-300">Your AI coach is analyzing your finances...</p>
          <p className="text-sm text-slate-500">This may take a moment.</p>
        </div>
      );
    }

    if (advice?.error) {
      return (
        <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-6 space-y-4 text-red-300 whitespace-pre-wrap font-mono text-sm">
          {advice.error}
        </div>
      );
    }
    
    if (advice) {
       return (
        <div className="space-y-6">
          <p className="text-center text-lg text-slate-300 italic">"{advice.overallSummary}"</p>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><SparklesIcon className="w-5 h-5 text-green-400"/><span>Savings Suggestions</span></h3>
            <ul className="space-y-3">
              {advice.savingsSuggestions.map((item, index) => (
                <li key={index} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-slate-300 flex-1 pr-4">{item.suggestion}</span>
                  <span className="font-semibold text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-sm">~{formatCurrency(item.potentialSavings)}/mo</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3 flex items-center space-x-2"><LightBulbIcon className="w-5 h-5 text-yellow-400"/><span>Income Ideas</span></h3>
             <ul className="space-y-3">
              {advice.incomeSuggestions.map((item, index) => (
                 <li key={index} className="bg-slate-900/50 p-4 rounded-lg flex justify-between items-center">
                  <span className="text-slate-300 flex-1 pr-4">{item.idea}</span>
                  <span className="font-semibold text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-sm">~{formatCurrency(item.potentialIncome)}/mo</span>
                </li>
              ))}
            </ul>
          </div>
          
          <p className="text-center text-lg text-slate-300 italic pt-4">"{advice.encouragement}"</p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-white flex-grow">
          <h2 className="text-3xl font-bold text-center mb-2 text-amber-400">AI Financial Coach</h2>
          <p className="text-center text-slate-400 mb-8">Personalized tips to help you reach your goals</p>
          {renderContent()}
          {!isLoading && (
            <p className="text-xs text-slate-500 text-center mt-8">
              Disclaimer: This is AI-generated advice and should not be considered professional financial guidance.
            </p>
          )}
        </div>
        <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end sticky bottom-0">
          <button
            onClick={onClose}
            className="bg-slate-600 hover:bg-slate-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialAdviceModal;