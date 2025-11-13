import React, { useState, useMemo } from 'react';
import type { Bill } from './types';
import BillInput from './components/BillInput';
import SummaryCard from './components/SummaryCard';
import PlusIcon from './components/icons/PlusIcon';
import CalendarDaysIcon from './components/icons/CalendarDaysIcon';
import GlobeAltIcon from './components/icons/GlobeAltIcon';

const CURRENCIES = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' },
    // --- Alphabetical from here ---
    { code: 'AED', name: 'UAE Dirham' },
    { code: 'ARS', name: 'Argentine Peso' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'BGN', name: 'Bulgarian Lev' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CLP', name: 'Chilean Peso' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'COP', name: 'Colombian Peso' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'DZD', name: 'Algerian Dinar' },
    { code: 'EGP', name: 'Egyptian Pound' },
    { code: 'ETB', name: 'Ethiopian Birr' },
    { code: 'GHS', name: 'Ghanaian Cedi' },
    { code: 'HKD', name: 'Hong Kong Dollar' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'IDR', name: 'Indonesian Rupiah' },
    { code: 'ILS', name: 'Israeli New Shekel' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'ISK', name: 'Icelandic Króna' },
    { code: 'KES', name: 'Kenyan Shilling' },
    { code: 'KRW', name: 'South Korean Won' },
    { code: 'KZT', name: 'Kazakhstani Tenge' },
    { code: 'MAD', name: 'Moroccan Dirham' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'MYR', name: 'Malaysian Ringgit' },
    { code: 'NGN', name: 'Nigerian Naira' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'PEN', name: 'Peruvian Sol' },
    { code: 'PHP', name: 'Philippine Peso' },
    { code: 'PKR', name: 'Pakistani Rupee' },
    { code: 'PLN', name: 'Polish Złoty' },
    { code: 'RON', name: 'Romanian Leu' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'SAR', name: 'Saudi Riyal' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'THB', name: 'Thai Baht' },
    { code: 'TRY', name: 'Turkish Lira' },
    { code: 'TZS', name: 'Tanzanian Shilling' },
    { code: 'TWD', name: 'New Taiwan Dollar' },
    { code: 'UAH', name: 'Ukrainian Hryvnia' },
    { code: 'UGX', name: 'Ugandan Shilling' },
    { code: 'XAF', name: 'CFA Franc BEAC' },
    { code: 'XOF', name: 'CFA Franc BCEAO' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'ZMW', name: 'Zambian Kwacha' },
];

const App: React.FC = () => {
    const [bills, setBills] = useState<Bill[]>([
        { id: crypto.randomUUID(), name: 'Monthly Rent', amount: 1200 },
        { id: crypto.randomUUID(), name: 'Electricity Bill', amount: 75 },
        { id: crypto.randomUUID(), name: 'Internet', amount: 60 },
        { id: crypto.randomUUID(), name: 'Transport', amount: 150 },
    ]);
    const [profit, setProfit] = useState<number>(1000);
    const [offDays, setOffDays] = useState<number>(8);
    const [currency, setCurrency] = useState<string>('USD');

    const addBill = () => {
        setBills([...bills, { id: crypto.randomUUID(), name: '', amount: 0 }]);
    };

    const updateBill = (id: string, updatedBill: Partial<Bill>) => {
        setBills(bills.map(bill => bill.id === id ? { ...bill, ...updatedBill } : bill));
    };

    const removeBill = (id: string) => {
        setBills(bills.filter(bill => bill.id !== id));
    };

    const { totalExpenses, dailyEarnings, workingDays, daysInMonth } = useMemo(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const actualOffDays = Math.min(offDays >= 0 ? offDays : 0, daysInMonth);
        const workingDays = daysInMonth - actualOffDays;

        const expenses = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
        const totalGoal = expenses + (profit || 0);
        
        const daily = workingDays > 0 ? totalGoal / workingDays : 0;

        return {
            totalExpenses: expenses,
            dailyEarnings: daily > 0 ? daily : 0,
            workingDays,
            daysInMonth
        };
    }, [bills, profit, offDays]);
    
    const currencySymbol = useMemo(() => {
        try {
            const parts = new Intl.NumberFormat(undefined, { style: 'currency', currency: currency }).formatToParts(1);
            return parts.find(part => part.type === 'currency')?.value || '$';
        } catch (e) {
            return '$';
        }
    }, [currency]);
    
    const handleProfitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfit(Math.max(0, parseFloat(e.target.value) || 0));
    };

    const handleOffDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            setOffDays(0);
        } else {
            setOffDays(Math.max(0, Math.min(value, daysInMonth)));
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-sky-900/50 p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">Daily Earnings <span className="text-sky-400">Calculator</span></h1>
                    <p className="text-slate-400 mt-2 max-w-2xl mx-auto">Calculate the daily income you need to cover expenses and hit your profit target.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8 backdrop-blur-sm space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="currency" className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                                    <div className="relative">
                                        <GlobeAltIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <select
                                            id="currency"
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all appearance-none"
                                        >
                                            {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="offDays" className="block text-sm font-medium text-slate-400 mb-2">Days Off This Month</label>
                                    <div className="relative">
                                        <CalendarDaysIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        <input
                                            id="offDays"
                                            type="number"
                                            value={offDays}
                                            onChange={handleOffDaysChange}
                                            min="0"
                                            max={daysInMonth}
                                            className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-slate-700"></div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6">Your Monthly Expenses</h2>
                            <div className="space-y-4 mb-8">
                                {bills.map((bill) => (
                                    <BillInput key={bill.id} bill={bill} onUpdate={updateBill} onRemove={removeBill} currencySymbol={currencySymbol}/>
                                ))}
                            </div>
                            <button 
                                onClick={addBill}
                                className="w-full flex items-center justify-center space-x-2 border-2 border-dashed border-slate-600 text-slate-400 hover:bg-slate-700/50 hover:text-sky-400 hover:border-sky-500 transition-all rounded-lg py-3"
                            >
                               <PlusIcon className="w-5 h-5" />
                               <span>Add Another Bill</span>
                            </button>
                        </div>

                        <div className="border-t border-slate-700"></div>

                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">Desired Profit</h2>
                            <p className="text-slate-400 mb-4">How much extra would you like to earn this month after all bills are paid?</p>
                             <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">{currencySymbol}</span>
                                <input
                                type="number"
                                placeholder="Profit Goal"
                                value={profit || ''}
                                onChange={handleProfitChange}
                                min="0"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-8 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                        <SummaryCard 
                            totalExpenses={totalExpenses}
                            profit={profit}
                            dailyEarnings={dailyEarnings}
                            workingDays={workingDays}
                            currency={currency}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;