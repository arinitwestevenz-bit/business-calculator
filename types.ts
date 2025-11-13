
export interface Bill {
  id: string;
  name: string;
  amount: number;
}

export interface SavingsSuggestion {
  suggestion: string;
  potentialSavings: number;
}

export interface IncomeSuggestion {
  idea: string;
  potentialIncome: number;
}

export interface FinancialAdvice {
  overallSummary: string;
  savingsSuggestions: SavingsSuggestion[];
  incomeSuggestions: IncomeSuggestion[];
  encouragement: string;
  error?: string;
}
