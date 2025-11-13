import React from 'react';

interface FinancialAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice: string;
  isLoading: boolean;
}

const FinancialAdviceModal: React.FC<FinancialAdviceModalProps> = ({
  isOpen,
  onClose,
  advice,
  isLoading,
}) => {
  if (!isOpen) return null;

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

          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center space-y-4 my-16">
                <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-300">Your AI coach is analyzing your finances...</p>
                <p className="text-sm text-slate-500">This may take a moment.</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
                 <div className="text-slate-300 whitespace-pre-wrap font-mono">{advice}</div>
            </div>
          )}

          <p className="text-xs text-slate-500 text-center mt-8">
            Disclaimer: This is AI-generated advice and should not be considered professional financial guidance.
          </p>

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
