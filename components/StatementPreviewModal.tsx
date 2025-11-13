import React, { useRef } from 'react';
import type { Bill } from '../types';
import ArrowDownTrayIcon from './icons/ArrowDownTrayIcon';

// TypeScript declarations for libraries loaded via CDN
declare const jspdf: any;
declare const html2canvas: any;

interface StatementPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bills: Bill[];
  profit: number;
  savings: number;
  totalExpenses: number;
  dailyEarnings: number;
  workingDays: number;
  currency: string;
  currencySymbol: string;
}

const StatementPreviewModal: React.FC<StatementPreviewModalProps> = ({
  isOpen,
  onClose,
  bills,
  profit,
  savings,
  totalExpenses,
  dailyEarnings,
  workingDays,
  currency,
  currencySymbol
}) => {
  const statementRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const input = statementRef.current;
    if (input) {
      // Temporarily remove the buttons from the DOM for the PDF capture
      const buttons = input.querySelector('.print-hide');
      if (buttons) (buttons as HTMLElement).style.display = 'none';

      html2canvas(input, {
        scale: 2,
        backgroundColor: '#1e293b',
        onclone: (document) => {
          // Add a print-only style to the cloned document
          const style = document.createElement('style');
          style.innerHTML = `
            @media print {
              .print-hide { display: none !important; }
            }
          `;
          document.head.appendChild(style);
        }
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`financial-statement-${new Date().toISOString().split('T')[0]}.pdf`);
        
        // Restore buttons
        if (buttons) (buttons as HTMLElement).style.display = 'flex';
      });
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={statementRef} className="p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-2 text-sky-400">Financial Statement</h2>
          <p className="text-center text-slate-400 mb-8">Summary for the current month</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-8">
             <p><strong className="text-slate-400">Currency:</strong> {currency}</p>
             <p><strong className="text-slate-400">Working Days:</strong> {workingDays}</p>
          </div>

          <h3 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Monthly Expenses</h3>
          <div className="space-y-2 mb-8">
            {bills.filter(b => b.name && b.amount > 0).map((bill) => (
              <div key={bill.id} className="flex justify-between">
                <span className="text-slate-300">{bill.name}</span>
                <span className="font-mono">{formatCurrency(bill.amount)}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold border-t border-slate-600 pt-2 mt-2">
              <span className="text-red-400">Total Expenses</span>
              <span className="font-mono text-red-400">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Goals</h3>
          <div className="space-y-2 mb-8">
            <div className="flex justify-between">
              <span className="text-slate-300">Desired Profit</span>
              <span className="font-mono text-green-400">{formatCurrency(profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Savings Goal</span>
              <span className="font-mono text-indigo-400">{formatCurrency(savings)}</span>
            </div>
          </div>
          
          <div className="bg-slate-900/50 rounded-lg p-6 text-center">
            <p className="text-slate-400">Required Daily Earnings</p>
            <p className="text-4xl font-bold text-sky-400 my-2">{formatCurrency(dailyEarnings)}</p>
            <p className="text-slate-400">per working day</p>
          </div>

          <div className="print-hide mt-8 flex justify-end space-x-4">
              <button
                  onClick={handleDownloadPdf}
                  className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg"
              >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Download as PDF</span>
              </button>
              <button
                  onClick={onClose}
                  className="bg-slate-600 hover:bg-slate-500 transition-colors text-white font-semibold py-2 px-4 rounded-lg"
              >
                  Close
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementPreviewModal;