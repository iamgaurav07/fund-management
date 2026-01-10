/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Fund, FundFormData, Currency, FundStatus } from '../../interfaces/fund';
// FundDialog Component
const FundDialog = ({ isOpen, onClose, onSubmit, fund, isLoading = false }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: FundFormData) => Promise<void>; 
  fund?: Fund | null; 
  isLoading?: boolean; 
}) => {
  const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
  const STATUS_OPTIONS: FundStatus[] = ['DRAFT', 'OPEN', 'CLOSED', 'LIQUIDATED'];
  const CURRENT_YEAR = new Date().getFullYear();
  const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR + i - 20);

  const [formData, setFormData] = useState<FundFormData>({
    name: '',
    fundSize: '',
    currency: 'USD',
    vintageYear: CURRENT_YEAR,
    managementFeePercent: '',
    carryPercent: '',
    status: 'DRAFT',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fund) {
      setFormData({
        name: fund.name,
        fundSize: fund.fundSize,
        currency: fund.currency,
        vintageYear: fund.vintageYear,
        managementFeePercent: fund.managementFeePercent,
        carryPercent: fund.carryPercent,
        status: fund.status,
        description: fund.description || '',
      });
    } else {
      setFormData({
        name: '',
        fundSize: '',
        currency: 'USD',
        vintageYear: CURRENT_YEAR,
        managementFeePercent: '',
        carryPercent: '',
        status: 'DRAFT',
        description: '',
      });
    }
    setErrors({});
  }, [CURRENT_YEAR, fund, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Fund name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Fund name must be at least 3 characters';
    }

    if (!formData.fundSize) {
      newErrors.fundSize = 'Fund size is required';
    } else if (Number(formData.fundSize) <= 0) {
      newErrors.fundSize = 'Fund size must be greater than 0';
    }

    if (!formData.vintageYear) {
      newErrors.vintageYear = 'Vintage year is required';
    } else if (Number(formData.vintageYear) < 2000 || Number(formData.vintageYear) > CURRENT_YEAR + 10) {
      newErrors.vintageYear = 'Please enter a valid vintage year';
    }

    if (!formData.managementFeePercent && formData.managementFeePercent !== 0) {
      newErrors.managementFeePercent = 'Management fee is required';
    } else if (Number(formData.managementFeePercent) < 0 || Number(formData.managementFeePercent) > 100) {
      newErrors.managementFeePercent = 'Management fee must be between 0 and 100%';
    }

    if (!formData.carryPercent && formData.carryPercent !== 0) {
      newErrors.carryPercent = 'Carry is required';
    } else if (Number(formData.carryPercent) < 0 || Number(formData.carryPercent) > 100) {
      newErrors.carryPercent = 'Carry must be between 0 and 100%';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' && value !== '' ? Number(value) : value,
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const formatCurrencyInput = (value: number | '') => {
    if (value === '') return '';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {fund ? 'Edit Fund' : 'Create New Fund'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {fund ? 'Update fund details' : 'Add a new fund to your portfolio'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={isLoading}>
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fund Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                      errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    placeholder="e.g., Alpha Growth Fund I"
                    disabled={isLoading}
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, currency }));
                          if (errors.currency) setErrors(prev => ({ ...prev, currency: '' }));
                        }}
                        className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium bg-white text-gray-900 ${
                          formData.currency === currency
                            ? 'border-primary-500 bg-primary-50 text-primary-700 ring-1 ring-primary-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        disabled={isLoading}
                      >
                        {currency}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Financial Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fund Size (Target Commitment) *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      {formData.currency}
                    </div>
                    <input
                      type="text"
                      name="fundSize"
                      value={formatCurrencyInput(formData.fundSize)}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^0-9]/g, '');
                        setFormData(prev => ({ ...prev, fundSize: numericValue === '' ? '' : Number(numericValue) }));
                        if (errors.fundSize) setErrors(prev => ({ ...prev, fundSize: '' }));
                      }}
                      className={`w-full pl-14 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                        errors.fundSize ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                      }`}
                      placeholder="10,000,000"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.fundSize && <p className="mt-2 text-sm text-red-600">{errors.fundSize}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vintage Year *</label>
                  <select
                    name="vintageYear"
                    value={formData.vintageYear}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 ${
                      errors.vintageYear ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Select Year</option>
                    {YEARS.map((year) => (
                      <option key={year} value={year} className="text-gray-900">
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.vintageYear && <p className="mt-2 text-sm text-red-600">{errors.vintageYear}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Management Fee (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="managementFeePercent"
                      value={formData.managementFeePercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                        errors.managementFeePercent ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                      }`}
                      placeholder="2.0"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</div>
                  </div>
                  {errors.managementFeePercent && <p className="mt-2 text-sm text-red-600">{errors.managementFeePercent}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Carry (%) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="carryPercent"
                      value={formData.carryPercent}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className={`w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-offset-1 bg-white text-gray-900 placeholder:text-gray-500 ${
                        errors.carryPercent ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'
                      }`}
                      placeholder="20"
                      disabled={isLoading}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</div>
                  </div>
                  {errors.carryPercent && <p className="mt-2 text-sm text-red-600">{errors.carryPercent}</p>}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Status & Details</h3>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fund Status *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, status }));
                          if (errors.status) setErrors(prev => ({ ...prev, status: '' }));
                        }}
                        className={`px-3 py-3 rounded-lg border transition-all duration-200 text-sm font-medium bg-white text-gray-900 ${
                          formData.status === status
                            ? status === 'DRAFT' ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500' :
                              status === 'OPEN' ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500' :
                              status === 'CLOSED' ? 'border-gray-500 bg-gray-50 text-gray-700 ring-1 ring-gray-500' :
                              'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                        disabled={isLoading}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 placeholder:text-gray-500 resize-none"
                    placeholder="Add details about the fund strategy, focus areas, or notes..."
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" isLoading={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {fund ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {fund ? 'Update Fund' : 'Create Fund'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundDialog;