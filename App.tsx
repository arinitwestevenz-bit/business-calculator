import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Bill, FinancialAdvice } from './types';
import BillInput from './components/BillInput';
import SummaryCard from './components/SummaryCard';
import StatementPreviewModal from './components/StatementPreviewModal';
import FinancialAdviceModal from './components/FinancialAdviceModal';
import PlusIcon from './components/icons/PlusIcon';
import CalendarDaysIcon from './components/icons/CalendarDaysIcon';
import GlobeAltIcon from './components/icons/GlobeAltIcon';
import MagnifyingGlassIcon from './components/icons/MagnifyingGlassIcon';
import GoalInput from './components/GoalInput';
import ChartBarIcon from './components/icons/ChartBarIcon';
import BankIcon from './components/icons/BankIcon';
import ChevronDownIcon from './components/icons/ChevronDownIcon';
import PricingCalculator from './components/PricingCalculator';
import WalletIcon from './components/icons/WalletIcon';
import TagIcon from './components/icons/TagIcon';

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

const DEFAULT_BILLS: Bill[] = [
    { id: crypto.randomUUID(), name: 'Monthly Rent', amount: 1200 },
    { id: crypto.randomUUID(), name: 'Electricity Bill', amount: 75 },
    { id: crypto.randomUUID(), name: 'Internet', amount: 60 },
    { id: crypto.randomUUID(), name: 'Transport', amount: 150 },
];

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            return JSON.parse(storedValue);
        }
    } catch (error) {
        console.error(`Error reading from localStorage for key "${key}":`, error);
    }
    return defaultValue;
};

const App: React.FC = () => {
    const [activeView, setActiveView] = useState<'daily' | 'pricing'>('daily');
    const [bills, setBills] = useState<Bill[]>(() => getInitialState('bills', DEFAULT_BILLS));
    const [profit, setProfit] = useState<number>(() => getInitialState('profit', 1000));
    const [savings, setSavings] = useState<number>(() => getInitialState('savings', 500));
    const [offDays, setOffDays] = useState<number>(() => getInitialState('offDays', 8));
    const [currency, setCurrency] = useState<string>(() => getInitialState('currency', 'USD'));
    const [currencySearchTerm, setCurrencySearchTerm] = useState<string>('');
    const [isStatementVisible, setIsStatementVisible] = useState(false);
    const [isAdviceVisible, setIsAdviceVisible] = useState(false);
    const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
    const [isAdviceLoading, setIsAdviceLoading] = useState(false);

    useEffect(() => { localStorage.setItem('bills', JSON.stringify(bills)); }, [bills]);
    useEffect(() => { localStorage.setItem('profit', JSON.stringify(profit)); }, [profit]);
    useEffect(() => { localStorage.setItem('savings', JSON.stringify(savings)); }, [savings]);
    useEffect(() => { localStorage.setItem('offDays', JSON.stringify(offDays)); }, [offDays]);
    useEffect(() => { localStorage.setItem('currency', JSON.stringify(currency)); }, [currency]);

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
        const totalGoal = expenses + (profit || 0) + (savings || 0);
        
        const daily = workingDays > 0 ? totalGoal / workingDays : 0;

        return {
            totalExpenses: expenses,
            dailyEarnings: daily > 0 ? daily : 0,
            workingDays,
            daysInMonth
        };
    }, [bills, profit, savings, offDays]);
    
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

    const handleSavingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSavings(Math.max(0, parseFloat(e.target.value) || 0));
    };

    const handleOffDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            setOffDays(0);
        } else {
            setOffDays(Math.max(0, Math.min(value, daysInMonth)));
        }
    };

    const filteredCurrencies = useMemo(() => {
        if (!currencySearchTerm) {
            return CURRENCIES;
        }
        const lowercasedFilter = currencySearchTerm.toLowerCase();
        return CURRENCIES.filter(c =>
            c.code.toLowerCase().includes(lowercasedFilter) ||
            c.name.toLowerCase().includes(lowercasedFilter)
        );
    }, [currencySearchTerm]);

    const getFinancialAdvice = async () => {
        setIsAdviceVisible(true);
        setIsAdviceLoading(true);
        setAdvice(null);

        const formatCurrency = (value: number) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency,
            }).format(value);
        };

        const billsSummary = bills
            .filter(b => b.name && b.amount > 0)
            .map(b => `- ${b.name}: ${formatCurrency(b.amount)}`)
            .join('\n');

        const prompt = `You are a helpful and friendly financial coach. Analyze the following financial data and provide actionable, encouraging, and personalized advice in a JSON format. The user wants to find ways to save money and reach their goals faster.

Here is the user's financial data for the month:
- Currency: ${currency}
- Total Monthly Expenses: ${formatCurrency(totalExpenses)}
- Breakdown of Expenses:
${billsSummary || 'No expenses listed.'}
- Desired Monthly Profit Goal: ${formatCurrency(profit)}
- Monthly Savings Goal: ${formatCurrency(savings)}
- Number of working days in the month: ${workingDays}
- Required daily earnings to meet goals: ${formatCurrency(dailyEarnings)}

Based on this, provide some tips.`;
        
        const adviceSchema = {
            type: Type.OBJECT,
            properties: {
                overallSummary: {
                    type: Type.STRING,
                    description: "A brief, 1-2 sentence encouraging summary of the user's financial situation.",
                },
                savingsSuggestions: {
                    type: Type.ARRAY,
                    description: "An array of 2-4 specific, actionable suggestions for cutting costs based on their listed expenses or general categories.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            suggestion: {
                                type: Type.STRING,
                                description: "A concise description of the saving suggestion.",
                            },
                            potentialSavings: {
                                type: Type.NUMBER,
                                description: "An estimated monthly savings amount in the user's currency. Be realistic.",
                            },
                        },
                        required: ['suggestion', 'potentialSavings'],
                    },
                },
                incomeSuggestions: {
                    type: Type.ARRAY,
                    description: "An array of 2-3 general ideas for increasing income.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            idea: {
                                type: Type.STRING,
                                description: "A concise description of the income-generating idea.",
                            },
                            potentialIncome: {
                                type: Type.NUMBER,
                                description: "An estimated potential monthly income in the user's currency. Provide a reasonable range or average.",
                            },
                        },
                        required: ['idea', 'potentialIncome'],
                    },
                },
                encouragement: {
                    type: Type.STRING,
                    description: "A final positive and motivating 1-2 sentence message to the user.",
                },
            },
            required: ['overallSummary', 'savingsSuggestions', 'incomeSuggestions', 'encouragement'],
        };

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: adviceSchema,
                },
            });

            let jsonStr = response.text.trim();
            const parsedAdvice = JSON.parse(jsonStr);
            setAdvice(parsedAdvice);

        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setAdvice({
                error: `Sorry, the AI coach couldn't generate advice right now. Please try again later.\n\nDetails: ${errorMessage}`,
                overallSummary: '',
                savingsSuggestions: [],
                incomeSuggestions: [],
                encouragement: '',
            });
        } finally {
            setIsAdviceLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 bg-gradient-to-br from-slate-900 to-sky-900/50 p-4 sm:p-6 lg:p-8">
            <main className="max-w-7xl mx-auto">
                <header className="text-center mb-6">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
                        {activeView === 'daily' ? <>Daily Earnings <span className="text-sky-400">Calculator</span></> : <>Retail Product <span className="text-sky-400">Pricer</span></>}
                    </h1>
                    <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                         {activeView === 'daily' ? 'Calculate the daily income you need to cover expenses and hit your profit target.' : 'Determine the best selling price for your products to meet profit goals.'}
                    </p>
                </header>

                <nav className="flex justify-center mb-10">
                    <div className="flex space-x-2 p-1.5 bg-slate-800/60 rounded-xl border border-slate-700 backdrop-blur-sm">
                        <NavButton
                            label="Daily Earnings"
                            icon={<WalletIcon className="w-5 h-5" />}
                            isActive={activeView === 'daily'}
                            onClick={() => setActiveView('daily')}
                        />
                        <NavButton
                            label="Product Pricer"
                            icon={<TagIcon className="w-5 h-5" />}
                            isActive={activeView === 'pricing'}
                            onClick={() => setActiveView('pricing')}
                        />
                    </div>
                </nav>

                {activeView === 'daily' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
                        <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8 backdrop-blur-sm space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="currency" className="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                                        <div className="relative mb-2">
                                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <input
                                                type="text"
                                                placeholder="Search currency..."
                                                value={currencySearchTerm}
                                                onChange={(e) => setCurrencySearchTerm(e.target.value)}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all"
                                            />
                                        </div>
                                        <div className="relative">
                                            <GlobeAltIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                            <select
                                                id="currency"
                                                value={currency}
                                                onChange={(e) => setCurrency(e.target.value)}
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-10 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all appearance-none"
                                            >
                                                {filteredCurrencies.map(c => <option key={c.code} value={c.code}>{c.code} - {c.name}</option>)}
                                            </select>
                                            <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
                                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md pl-10 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Monthly Expenses</h2>
                                <div className="space-y-3">
                                    {bills.map(bill => (
                                        <BillInput key={bill.id} bill={bill} onUpdate={updateBill} onRemove={removeBill} currencySymbol={currencySymbol}/>
                                    ))}
                                </div>
                                <button
                                    onClick={addBill}
                                    className="mt-4 flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors font-semibold"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span>Add Another Bill</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <GoalInput 
                                    label="Profit Goal"
                                    description="Set your desired take-home profit for the month after all expenses are paid."
                                    value={profit}
                                    onChange={handleProfitChange}
                                    currencySymbol={currencySymbol}
                                    icon={<ChartBarIcon className="w-6 h-6 text-green-400" />}
                                />
                                <GoalInput 
                                    label="Savings Goal"
                                    description="Set an amount to put aside for savings or investments this month."
                                    value={savings}
                                    onChange={handleSavingsChange}
                                    currencySymbol={currencySymbol}
                                    icon={<BankIcon className="w-6 h-6 text-indigo-400" />}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                           <SummaryCard 
                                totalExpenses={totalExpenses}
                                profit={profit}
                                savings={savings}
                                dailyEarnings={dailyEarnings}
                                workingDays={workingDays}
                                currency={currency}
                                onPreviewStatement={() => setIsStatementVisible(true)}
                                onGetAdvice={getFinancialAdvice}
                           />
                        </div>
                    </div>
                ) : (
                    <PricingCalculator currency={currency} currencySymbol={currencySymbol} />
                )}
            </main>
            
            {isStatementVisible && (
                <StatementPreviewModal
                    isOpen={isStatementVisible}
                    onClose={() => setIsStatementVisible(false)}
                    bills={bills}
                    profit={profit}
                    savings={savings}
                    totalExpenses={totalExpenses}
                    dailyEarnings={dailyEarnings}
                    workingDays={workingDays}
                    currency={currency}
                    currencySymbol={currencySymbol}
                />
            )}
            {isAdviceVisible && (
                <FinancialAdviceModal
                    isOpen={isAdviceVisible}
                    onClose={() => setIsAdviceVisible(false)}
                    advice={advice}
                    isLoading={isAdviceLoading}
                    currency={currency}
                />
            )}
        </div>
    );
};

interface NavButtonProps {
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
            isActive
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-slate-300 hover:bg-slate-700/50'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

export default App;