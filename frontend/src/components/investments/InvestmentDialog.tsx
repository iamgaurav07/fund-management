/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { X, Save, Loader2, Calendar, DollarSign, FileText, Building, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Investment, InvestmentFormData } from '../../interfaces/investment';
import { cn } from '@/utils';
import { Fund } from '../../interfaces/fund';

interface InvestmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InvestmentFormData) => Promise<void>;
  investment?: Investment | null;
  fund: Fund;
  isLoading?: boolean;
}

const InvestmentDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  investment, 
  fund,
  isLoading = false 
}: InvestmentDialogProps) => {
  const [formData, setFormData] = useState<InvestmentFormData>({
    fundId: fund.id,
    companyName: '',
    investedAmount: '',
    currentValue: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (investment) {
      setFormData({
        fundId: investment.fundId,
        companyName: investment.companyName,
        investedAmount: investment.investedAmount,
        currentValue: investment.currentValue,
        date: investment.date.split('T')[0],
        description: investment.description || '',
      });
    } else {
      setFormData({
        fundId: fund.id,
        companyName: '',
        investedAmount: '',
        currentValue: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
    }
    setErrors({});
  }, [investment, fund, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.investedAmount || Number(formData.investedAmount) <= 0) {
      newErrors.investedAmount = 'Invested amount must be greater than 0';
    }

    if (!formData.currentValue || Number(formData.currentValue) < 0) {
      newErrors.currentValue = 'Current value must be 0 or greater';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const formatCurrency = (value: number | '') => {
    if (value === '') return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const parseCurrency = (value: string) => {
    return value.replace(/[^0-9.]/g, '');
  };

  const calculatePerformance = () => {
    const invested = Number(formData.investedAmount) || 0;
    const current = Number(formData.currentValue) || 0;
    
    if (invested === 0) return { percentage: 0, amount: 0 };
    
    const amount = current - invested;
    const percentage = (amount / invested) * 100;
    
    return { percentage, amount };
  };

  if (!isOpen) return null;

  const performance = calculatePerformance();
  const hasPerformance = formData.investedAmount && formData.currentValue;
  const isPositive = performance.percentage >= 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {investment ? 'Edit Investment' : 'New Investment'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {investment ? 'Update investment details' : 'Add a new investment to the portfolio'}
            </p>
            {/* Fund Info */}
            <div className="flex items-center gap-2 mt-2 p-2 bg-primary-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded flex items-center justify-center">
                <Building className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary-800">{fund.name}</p>
                <p className="text-xs text-primary-600">Currency: {fund.currency}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="p-6 space-y-5">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                    errors.companyName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="Enter company name"
                  disabled={isLoading}
                />
              </div>
              {errors.companyName && (
                <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
              )}
            </div>

            {/* Invested Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invested Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <span className="text-sm font-medium text-gray-700">{fund.currency}</span>
                  </div>
                </div>
                <input
                  type="text"
                  name="investedAmount"
                  value={formatCurrency(formData.investedAmount)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    setFormData(prev => ({ ...prev, investedAmount: numericValue === '' ? '' : Number(numericValue) }));
                    if (errors.investedAmount) setErrors(prev => ({ ...prev, investedAmount: '' }));
                  }}
                  className={`w-full pl-10 pr-20 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                    errors.investedAmount
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              {errors.investedAmount && (
                <p className="mt-2 text-sm text-red-600">{errors.investedAmount}</p>
              )}
            </div>

            {/* Current Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Value *
              </label>
              <div className="relative">
                <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                    <span className="text-sm font-medium text-gray-700">{fund.currency}</span>
                  </div>
                </div>
                <input
                  type="text"
                  name="currentValue"
                  value={formatCurrency(formData.currentValue)}
                  onChange={(e) => {
                    const numericValue = parseCurrency(e.target.value);
                    setFormData(prev => ({ ...prev, currentValue: numericValue === '' ? '' : Number(numericValue) }));
                    if (errors.currentValue) setErrors(prev => ({ ...prev, currentValue: '' }));
                  }}
                  className={`w-full pl-10 pr-20 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                    errors.currentValue
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="0.00"
                  disabled={isLoading}
                />
              </div>
              {errors.currentValue && (
                <p className="mt-2 text-sm text-red-600">{errors.currentValue}</p>
              )}
            </div>

            {/* Performance Preview */}
            {hasPerformance && (
              <div className={cn(
                "p-3 rounded-lg border",
                isPositive 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">Performance</span>
                  </div>
                  <div className={cn(
                    "text-sm font-bold",
                    isPositive ? "text-green-700" : "text-red-700"
                  )}>
                    {isPositive ? '+' : ''}{performance.percentage.toFixed(1)}%
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {isPositive ? 'Gain' : 'Loss'} of {formatCurrency(Math.abs(performance.amount))}
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 ${
                    errors.date
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  disabled={isLoading}
                />
              </div>
              {errors.date && (
                <p className="mt-2 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-500 resize-none"
                  placeholder="Add investment details, notes, or industry..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {investment ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {investment ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentDialog;