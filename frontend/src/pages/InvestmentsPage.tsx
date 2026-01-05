import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, Download, TrendingUp, DollarSign, Calendar, RefreshCw, ArrowLeft, Target, PieChart, Globe, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import InvestmentsTable from '@/components/investments/InvestmentsTable';
import InvestmentDialog from '@/components/investments/InvestmentDialog';
import { Investment, InvestmentFormData } from '../interfaces/investment';
import { Fund } from '../interfaces/fund';
import { cn } from '@/utils';

// Mock funds data
const MOCK_FUNDS: Fund[] = [
  {
      id: '1',
      name: 'Alpha Growth Fund I',
      fundSize: 10000000,
      currency: 'USD',
      vintageYear: 2024,
      managementFeePercent: 2,
      carryPercent: 20,
      status: 'OPEN',
      description: 'Early-stage technology investments focusing on SaaS and AI companies.',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      name: 'Global Real Estate Income',
      fundSize: 50000000,
      currency: 'EUR',
      vintageYear: 2023,
      managementFeePercent: 1.5,
      carryPercent: 15,
      status: 'OPEN',
      description: 'Commercial real estate investments across Europe with focus on sustainable properties.',
      createdAt: '2023-06-20',
      updatedAt: '2023-12-10',
    },
];

// Mock investments data
const MOCK_INVESTMENTS: Investment[] = [
  {
    id: '1',
    fundId: '1',
    companyName: 'TechCorp Solutions',
    investedAmount: 5000000,
    currentValue: 7500000,
    date: '2023-01-15',
    description: 'Enterprise SaaS platform for financial services',
  },
  {
    id: '2',
    fundId: '1',
    companyName: 'GreenEnergy Inc',
    investedAmount: 3000000,
    currentValue: 4200000,
    date: '2023-03-20',
    description: 'Renewable energy infrastructure company',
  },
  {
    id: '3',
    fundId: '1',
    companyName: 'MediTech Labs',
    investedAmount: 2000000,
    currentValue: 3500000,
    date: '2023-06-10',
    description: 'Medical device manufacturer',
  },
  {
    id: '4',
    fundId: '1',
    companyName: 'LogiChain AI',
    investedAmount: 4000000,
    currentValue: 3800000,
    date: '2023-09-05',
    description: 'AI-powered supply chain optimization',
  },
  {
    id: '5',
    fundId: '1',
    companyName: 'FinTech Global',
    investedAmount: 6000000,
    currentValue: 8500000,
    date: '2023-11-15',
    description: 'Digital banking platform',
  },
  {
    id: '6',
    fundId: '1',
    companyName: 'BioPharma Research',
    investedAmount: 3500000,
    currentValue: 2800000,
    date: '2024-01-20',
    description: 'Biotechnology research and development',
  },
  {
    id: '7',
    fundId: '1',
    companyName: 'SmartCity IoT',
    investedAmount: 2500000,
    currentValue: 3100000,
    date: '2024-02-10',
    description: 'IoT solutions for smart cities',
  },
  {
    id: '8',
    fundId: '1',
    companyName: 'AgriTech Innovations',
    investedAmount: 1800000,
    currentValue: 2200000,
    date: '2024-03-01',
    description: 'Agricultural technology solutions',
  },
];

const InvestmentsPage = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  
  const [investments, setInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>(MOCK_INVESTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'GAIN' | 'LOSS'>('ALL');
  const [dateRange, setDateRange] = useState<'ALL' | '1Y' | '2Y' | '3Y'>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get selected fund
  const selectedFund = MOCK_FUNDS.find(f => f.id === (fundId || '1')) || MOCK_FUNDS[0];

  // Filter investments for the selected fund
  const fundInvestments = investments.filter(t => t.fundId === selectedFund.id);

  // Calculate summary stats
  const totalInvested = fundInvestments.reduce((sum, t) => sum + t.investedAmount, 0);
  const totalCurrentValue = fundInvestments.reduce((sum, t) => sum + t.currentValue, 0);
  const totalGain = totalCurrentValue - totalInvested;
  const totalROI = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const performingInvestments = fundInvestments.filter(t => t.currentValue > t.investedAmount).length;
  const underperformingInvestments = fundInvestments.filter(t => t.currentValue < t.investedAmount).length;

  useEffect(() => {
    let result = fundInvestments;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.companyName.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.id.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(t => 
        statusFilter === 'GAIN' ? t.currentValue > t.investedAmount : t.currentValue < t.investedAmount
      );
    }

    // Apply date filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const cutoffDate = new Date();
      switch (dateRange) {
        case '1Y': cutoffDate.setFullYear(now.getFullYear() - 1); break;
        case '2Y': cutoffDate.setFullYear(now.getFullYear() - 2); break;
        case '3Y': cutoffDate.setFullYear(now.getFullYear() - 3); break;
      }
      result = result.filter(t => new Date(t.date) >= cutoffDate);
    }

    // Sort by performance (best first)
    result = result.sort((a, b) => {
      const perfA = (b.currentValue - b.investedAmount) / b.investedAmount;
      const perfB = (a.currentValue - a.investedAmount) / a.investedAmount;
      return perfB - perfA;
    });

    setFilteredInvestments(result);
  }, [fundInvestments, searchQuery, statusFilter, dateRange]);

  const handleCreateInvestment = async (formData: InvestmentFormData) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newInvestment: Investment = {
      id: `INV${Date.now()}`,
      ...formData,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
    };

    setInvestments(prev => [newInvestment, ...prev]);
    setIsLoading(false);
    setIsDialogOpen(false);
  };

  const handleUpdateInvestment = async (formData: InvestmentFormData) => {
    if (!editingInvestment) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const updatedInvestment: Investment = {
      ...editingInvestment,
      ...formData,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
    };

    setInvestments(prev => prev.map(t => 
      t.id === editingInvestment.id ? updatedInvestment : t
    ));
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingInvestment(null);
  };

  const handleDeleteInvestment = (investment: Investment) => {
    if (window.confirm(`Are you sure you want to delete investment in ${investment.companyName}?`)) {
      setInvestments(prev => prev.filter(t => t.id !== investment.id));
    }
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setIsDialogOpen(true);
  };

  const handleAddInvestment = () => {
    setEditingInvestment(null);
    setIsDialogOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert('Investments exported successfully!');
    setIsExporting(false);
  };

  const statusOptions = [
    { value: 'ALL', label: 'All Investments', count: fundInvestments.length },
    { value: 'GAIN', label: 'Performing', count: performingInvestments },
    { value: 'LOSS', label: 'Underperforming', count: underperformingInvestments },
  ];

  const dateOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: '1Y', label: 'Last Year' },
    { value: '2Y', label: 'Last 2 Years' },
    { value: '3Y', label: 'Last 3 Years' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedFund.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value) + '%';
  };

  const handleBackToFunds = () => {
    navigate('/funds');
  };

  return (
    <div className="space-y-6">
      {/* Header with Fund Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={handleBackToFunds}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedFund.name} Investments
              </h1>
              <p className="text-gray-600 mt-1">
                Portfolio performance and investment details
                <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                  {selectedFund.currency}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-gray-300"
            onClick={handleExport}
            isLoading={isExporting}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={handleAddInvestment}>
            <Plus className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalInvested)}</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
            <span className="text-xs text-gray-500">{fundInvestments.length} companies</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(totalCurrentValue)}</p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-full"></div>
            </div>
            <span className="text-xs text-gray-500">Portfolio Value</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Gain/Loss</p>
              <p className={cn(
                "text-2xl font-bold mt-2",
                totalGain >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(totalGain)}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              totalGain >= 0 ? "bg-green-50" : "bg-red-50"
            )}>
              {totalGain >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-600" />
              )}
            </div>
          </div>
          <p className={cn(
            "text-sm font-medium mt-3",
            totalROI >= 0 ? "text-green-600" : "text-red-600"
          )}>
            {totalROI >= 0 ? '+' : ''}{formatPercentage(totalROI)} ROI
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Performance</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {performingInvestments}/{fundInvestments.length}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-3">
            {((performingInvestments / fundInvestments.length) * 100).toFixed(0)}% performing
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          {/* Search */}
          <div className="lg:w-1/3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="search"
                placeholder="Search by company, description, or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Date Range and Refresh */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button variant="outline" size="sm" className="border-gray-300">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Investment Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value as any)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  statusFilter === option.value
                    ? option.value === 'ALL' ? 'bg-gray-900 text-white' :
                      option.value === 'GAIN' ? 'bg-green-100 text-green-800 border border-green-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{option.label}</span>
                <span className="text-xs opacity-80 bg-white/30 px-1.5 py-0.5 rounded">
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <InvestmentsTable
        investments={filteredInvestments}
        fund={selectedFund}
        onEdit={handleEditInvestment}
        onDelete={handleDeleteInvestment}
        isLoading={isLoading}
      />

      {/* Summary Footer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredInvestments.length}</span> of{' '}
          <span className="font-semibold text-gray-900">{fundInvestments.length}</span> investments
          {searchQuery && (
            <span className="ml-2 text-primary-600">
              for "{searchQuery}"
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Performing (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Underperforming (-)</span>
          </div>
          <div className="text-xs text-gray-500">
            Avg ROI: <span className={cn("font-semibold", totalROI >= 0 ? "text-green-600" : "text-red-600")}>
              {totalROI >= 0 ? '+' : ''}{formatPercentage(totalROI)}
            </span>
          </div>
        </div>
      </div>

      {/* Investment Dialog */}
      <InvestmentDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingInvestment(null);
        }}
        onSubmit={editingInvestment ? handleUpdateInvestment : handleCreateInvestment}
        investment={editingInvestment}
        fund={selectedFund}
        isLoading={isLoading}
      />
    </div>
  );
};

export default InvestmentsPage;