import React, { useState, useMemo } from 'react';
import TagIcon from './icons/TagIcon';
import CubeIcon from './icons/CubeIcon';
import DollarSignIcon from './icons/DollarSignIcon';
import ChartBarIcon from './icons/ChartBarIcon';

interface PricingCalculatorProps {
    currencySymbol: string;
    currency: string;
}

const PricingCalculator: React.FC<PricingCalculatorProps> = ({ currencySymbol, currency }) => {
    const [productName, setProductName] = useState('50kg Bag of Rice');
    const [totalCost, setTotalCost] = useState(200000);
    const [totalItems, setTotalItems] = useState(50);
    const [desiredProfit, setDesiredProfit] = useState(40000);
    const [unit, setUnit] = useState('kg');

    const costPerItemValue = useMemo(() => {
        return totalItems > 0 ? totalCost / totalItems : 0;
    }, [totalCost, totalItems]);

    const { profitPerItem, sellingPrice } = useMemo(() => {
        if (totalItems <= 0) {
            return { profitPerItem: 0, sellingPrice: costPerItemValue };
        }

        const calculatedProfitPerItem = desiredProfit / totalItems;
        const calculatedSellingPrice = costPerItemValue + calculatedProfitPerItem;

        return {
            profitPerItem: calculatedProfitPerItem,
            sellingPrice: calculatedSellingPrice
        };
    }, [costPerItemValue, totalItems, desiredProfit]);

    const formatCurrency = (value: number) => {
        return value.toLocaleString(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
        });
    };
    
    const formatCurrencySummary = (value: number) => {
         return value.toLocaleString(undefined, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }

    const singularUnit = useMemo(() => {
        if (!unit) return 'Item';
        const lowerUnit = unit.toLowerCase();
        // A simple way to singularize, works for "pieces" -> "piece", "liters" -> "liter"
        return lowerUnit.endsWith('s') && lowerUnit.length > 1 ? unit.slice(0, -1) : unit;
    }, [unit]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
            <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8 backdrop-blur-sm space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3"><CubeIcon className="w-6 h-6" /><span>Bulk Product Details</span></h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-slate-400 mb-2">Product Name</label>
                            <input
                                id="productName"
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="e.g., Bag of rice"
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="totalCost" className="block text-sm font-medium text-slate-400 mb-2">Total Bulk Cost</label>
                                <div className="flex items-center w-full bg-slate-700/50 border border-slate-600 rounded-md focus-within:ring-2 focus-within:ring-sky-500 hover:border-slate-500 transition-all">
                                    <span className="pl-3 pr-2 text-slate-400 select-none">{currencySymbol}</span>
                                    <input
                                        id="totalCost"
                                        type="number"
                                        value={totalCost || ''}
                                        onChange={(e) => setTotalCost(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        className="w-full bg-transparent pr-3 py-2 text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="totalItems" className="block text-sm font-medium text-slate-400 mb-2">Total Quantity in Bulk</label>
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="totalItems"
                                        type="number"
                                        value={totalItems || ''}
                                        onChange={(e) => setTotalItems(parseInt(e.target.value, 10) || 0)}
                                        min="0"
                                        className="w-2/3 bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all"
                                        aria-label="Total quantity"
                                    />
                                    <input
                                        id="unit"
                                        type="text"
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        placeholder="unit"
                                        className="w-1/3 bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 hover:border-slate-500 transition-all"
                                        aria-label="Unit of measurement"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3"><ChartBarIcon className="w-6 h-6" /><span>Profit Goal</span></h2>
                    <div>
                        <label htmlFor="desiredProfit" className="block text-sm font-medium text-slate-400 mb-2">Desired Total Profit from Bulk</label>
                         <div className="flex items-center w-full bg-slate-700/50 border border-slate-600 rounded-md focus-within:ring-2 focus-within:ring-sky-500 hover:border-slate-500 transition-all">
                            <span className="pl-3 pr-2 text-slate-400 select-none">{currencySymbol}</span>
                            <input
                                id="desiredProfit"
                                type="number"
                                value={desiredProfit || ''}
                                onChange={(e) => setDesiredProfit(parseFloat(e.target.value) || 0)}
                                min="0"
                                className="w-full bg-transparent pr-3 py-2 text-white focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 lg:p-8 space-y-8 backdrop-blur-sm sticky top-8">
                    <div className="text-center">
                         {productName && <h3 className="text-xl font-bold text-white truncate mb-2">{productName}</h3>}
                        <p className="text-slate-400 text-sm">Recommended Price Per {singularUnit}</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mt-2">
                            {formatCurrencySummary(sellingPrice)}
                        </h2>
                        <p className="text-slate-400 text-lg">to reach your profit goal</p>
                    </div>

                    <div className="space-y-4">
                        <SummaryItem
                            icon={<DollarSignIcon className="w-6 h-6 text-slate-400" />}
                            label={`Cost Per ${singularUnit}`}
                            value={formatCurrency(costPerItemValue)}
                            color="text-slate-300"
                        />
                        <SummaryItem
                            icon={<ChartBarIcon className="w-6 h-6 text-green-400" />}
                            label={`Profit Per ${singularUnit}`}
                            value={formatCurrency(profitPerItem)}
                            color="text-green-400"
                        />
                        <div className="border-t border-slate-700 my-4"></div>
                        <SummaryItem
                            icon={<TagIcon className="w-6 h-6 text-sky-400" />}
                            label="Desired Total Profit"
                            value={formatCurrencySummary(desiredProfit)}
                            color="text-sky-400"
                            isBold={true}
                        />
                    </div>
                </div>
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


export default PricingCalculator;