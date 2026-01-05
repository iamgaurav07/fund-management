import { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText, Building, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Taxtarea';
import { Badge } from '@/components/ui/Badge';
import { Transaction, TransactionFormData, TransactionType, Fund } from '@/interfaces/transaction';

interface TransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  transaction?: Transaction | null;
  fund: Fund;
  isLoading?: boolean;
}

const TRANSACTION_TYPES: { 
  value: TransactionType; 
  label: string; 
  description: string;
  badgeColor: 'blue' | 'green' | 'purple';
}[] = [
  { 
    value: 'CAPITAL_CALL', 
    label: 'Capital Call', 
    description: 'Request for additional funds from investors',
    badgeColor: 'blue'
  },
  { 
    value: 'INVESTMENT', 
    label: 'Investment', 
    description: 'Capital deployment into assets',
    badgeColor: 'green'
  },
  { 
    value: 'DISTRIBUTION', 
    label: 'Distribution', 
    description: 'Return of capital to investors',
    badgeColor: 'purple'
  },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];

const TransactionDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction, 
  fund,
  isLoading = false 
}: TransactionDialogProps) => {
  const [formData, setFormData] = useState<TransactionFormData>({
    fundId: fund.id,
    type: 'CAPITAL_CALL',
    amount: '',
    currency: fund.currency,
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        fundId: transaction.fundId,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date.split('T')[0],
        description: transaction.description || '',
      });
    } else {
      setFormData({
        fundId: fund.id,
        type: 'CAPITAL_CALL',
        amount: '',
        currency: fund.currency,
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
    setTouched({});
  }, [transaction, fund, isOpen]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'amount':
        if (!value) return 'Amount is required';
        if (Number(value) <= 0) return 'Amount must be greater than 0';
        if (Number(value) > 1000000000) return 'Amount exceeds maximum limit';
        return '';
      
      case 'date':
        if (!value) return 'Date is required';
        if (new Date(value) > new Date()) return 'Date cannot be in the future';
        return '';
      
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== 'fundId' && key !== 'description') {
        const error = validateField(key, formData[key as keyof TransactionFormData]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      await onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? value : value,
    }));

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof TransactionFormData]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const formatAmount = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    return numericValue;
  };

  const getCurrencySymbol = (currency: string): string => {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CAD: 'C$',
    };
    return symbols[currency] || currency;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {transaction ? 'Edit Transaction' : 'New Transaction'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {fund.name} • {fund.currency}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-6">
            {/* Transaction Type */}
            <div>
              <Label htmlFor="type" className="mb-3 block">
                Transaction Type *
              </Label>
              <div className="space-y-3">
                {TRANSACTION_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, type: type.value }));
                      if (errors.type) setErrors(prev => ({ ...prev, type: '' }));
                    }}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      formData.type === type.value
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          formData.type === type.value 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{type.label}</span>
                            <Badge variant={type.badgeColor} size="sm">
                              {type.value.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                        </div>
                      </div>
                      {formData.type === type.value && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="amount" className="mb-2 block">
                  Amount *
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {getCurrencySymbol(formData.currency)}
                    </span>
                  </div>
                  <Input
                    id="amount"
                    name="amount"
                    type="text"
                    value={formData.amount}
                    onChange={(e) => {
                      const formatted = formatAmount(e.target.value);
                      setFormData(prev => ({ ...prev, amount: formatted }));
                      if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
                    }}
                    onBlur={() => handleBlur('amount')}
                    placeholder="0.00"
                    className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                    disabled={isLoading}
                  />
                  {touched.amount && errors.amount && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">{errors.amount}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="currency" className="mb-2 block">
                  Currency
                </Label>
                <div className="relative">
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    disabled={isLoading}
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency} ({getCurrencySymbol(currency)})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Defaults to fund currency: {fund.currency}
                </p>
              </div>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date" className="mb-2 block">
                Transaction Date *
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={() => handleBlur('date')}
                  max={new Date().toISOString().split('T')[0]}
                  className={`pl-10 ${errors.date ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {touched.date && errors.date && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600">{errors.date}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2 block">
                Description
                <span className="text-gray-500 font-normal ml-1">(Optional)</span>
              </Label>
              <div className="relative">
                <div className="absolute top-3 left-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                </div>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add notes or details about this transaction..."
                  className="pl-10 min-h-[100px] resize-none"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Add any relevant details or reference numbers
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              disabled={isLoading}
              className="px-5 min-w-[120px]"
            >
              {transaction ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionDialog;