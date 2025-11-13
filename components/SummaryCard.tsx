import React from 'react';
import DollarSignIcon from './icons/DollarSignIcon';
import TargetIcon from './icons/TargetIcon';
import ChartBarIcon from './icons/ChartBarIcon';

interface SummaryCardProps {
    totalExpenses: number;
    profit: number;
    dailyEarnings: number;
    workingDays: number;
    currency: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ totalExpenses, profit, dailyEarnings, workingDays, currency }) => {

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: currency,
        });
    };
    
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8 space-y-8 backdrop-blur-sm sticky top-8">
            <div className="text-center">
                <p className="text-slate-400 text-sm">To meet your goals over {workingDays} working days, you need to earn:</p>
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mt-2">
                    {formatCurrency(dailyEarnings)}
                </h2>
                <p className="text-slate-400 text-lg">per working day</p>
            </div>
            
            <div className="space-y-4">
                <SummaryItem 
                    icon={<DollarSignIcon className="w-6 h-6 text-red-400"/>}
                    label="Total Monthly Expenses"
                    value={formatCurrency(totalExpenses)}
                    color="text-red-400"
                />
                 <SummaryItem 
                    icon={<ChartBarIcon className="w-6 h-6 text-green-400"/>}
                    label="Desired Monthly Profit"
                    value={formatCurrency(profit)}
                    color="text-green-400"
                />
                <div className="border-t border-slate-700 my-4"></div>
                <SummaryItem 
                    icon={<TargetIcon className="w-6 h-6 text-sky-400"/>}
                    label="Total Monthly Goal"
                    value={formatCurrency(totalExpenses + profit)}
                    color="text-sky-400"
                    isBold={true}
                />
            </div>
        </div>
    );
};

interface SummaryItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: string;
    isBold?: boolean;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, label, value, color, isBold = false }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
            {icon}
            <span className="text-slate-300">{label}</span>
        </div>
        <span className={`${color} ${isBold ? 'font-bold text-lg' : 'font-medium'}`}>{value}</span>
    </div>
);

export default SummaryCard;
