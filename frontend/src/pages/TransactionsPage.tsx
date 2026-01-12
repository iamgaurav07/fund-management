import { useState, useEffect, use } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  BarChart3,
  RefreshCw,
  ArrowLeft,
  Building,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import TransactionsTable from '@/components/transactions/TransactionsTable';
import TransactionDialog from '@/components/transactions/TransactionDialog';
import { Transaction, TransactionFormData } from '../interfaces/transaction';
import { Fund } from '../interfaces/fund';
import useAxios from 'axios-hooks';
import { createTransaction, getTransactions } from '@/apis/transaction';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setTransaction } from '../store/slices/transactionSlice';

// Mock funds data - In real app, this would come from API
const MOCK_FUNDS: Fund[] = [
  { _id: '1', name: 'Alpha Growth Fund I', currency: 'USD' },
  { _id: '2', name: 'Global Real Estate Income', currency: 'EUR' },
  { _id: '3', name: 'Tech Venture Capital Fund', currency: 'USD' },
  { _id: '4', name: 'Sustainable Energy Fund', currency: 'USD' },
];

// Mock transactions for fund ID 1
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    _id: '1',
    fundId: '1',
    type: 'CAPITAL_CALL',
    amount: 1000000,
    currency: 'USD',
    date: '2024-01-15',
    description: 'Q1 2024 capital call for new investments',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10',
  },
  {
    _id: '2',
    fundId: '1',
    type: 'INVESTMENT',
    amount: 5000000,
    currency: 'USD',
    date: '2024-01-10',
    description: 'Investment in commercial property in Berlin',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-05',
  },
  {
    _id: '3',
    fundId: '1',
    type: 'DISTRIBUTION',
    amount: 2500000,
    currency: 'USD',
    date: '2024-01-05',
    description: 'Quarterly distribution to investors',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '4',
    fundId: '1',
    type: 'CAPITAL_CALL',
    amount: 750000,
    currency: 'USD',
    date: '2024-01-02',
    description: 'Additional capital for follow-on investments',
    createdAt: '2023-12-28',
    updatedAt: '2023-12-28',
  },
  {
    _id: '5',
    fundId: '1',
    type: 'INVESTMENT',
    amount: 3000000,
    currency: 'USD',
    date: '2023-12-20',
    description: 'Solar farm project investment',
    createdAt: '2023-12-15',
    updatedAt: '2023-12-15',
  },
  {
    _id: '6',
    fundId: '1',
    type: 'DISTRIBUTION',
    amount: 1200000,
    currency: 'USD',
    date: '2023-12-15',
    description: 'Annual distribution from rental income',
    createdAt: '2023-12-10',
    updatedAt: '2023-12-10',
  },
  {
    _id: '7',
    fundId: '1',
    type: 'CAPITAL_CALL',
    amount: 2000000,
    currency: 'USD',
    date: '2023-12-01',
    description: 'Year-end capital call for portfolio companies',
    createdAt: '2023-11-25',
    updatedAt: '2023-11-25',
  },
  {
    _id: '8',
    fundId: '1',
    type: 'INVESTMENT',
    amount: 1500000,
    currency: 'USD',
    date: '2023-11-20',
    description: 'Series B investment in SaaS platform',
    createdAt: '2023-11-15',
    updatedAt: '2023-11-15',
  },
];

const TransactionsPage = () => {
  const { id: fundId } = useParams<{ fundId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<'ALL' | '7D' | '30D' | '90D'>(
    'ALL'
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Get selected fund (in real app, fetch from API based on fundId)
  const selectedFund =
    MOCK_FUNDS.find((f) => f._id === (fundId || '1')) || MOCK_FUNDS[0];

  const { transactionData } = useSelector(
    (state: RootState) => state.transactionSlice
  ) as { transactionData: Transaction[] };

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(transactionData);
  // Filter transactions for the selected fund
  const fundTransactions = transactionData.filter(
    (t) => t.fundId === selectedFund._id
  );

  // Calculate summary stats
  const totalTransactions = fundTransactions.length;
  const totalAmount = fundTransactions.reduce((sum, t) => sum + t.amount, 0);
  const capitalCalls = fundTransactions.filter(
    (t) => t.type === 'CAPITAL_CALL'
  ).length;
  const investments = fundTransactions.filter(
    (t) => t.type === 'INVESTMENT'
  ).length;
  const distributions = fundTransactions.filter(
    (t) => t.type === 'DISTRIBUTION'
  ).length;

  useEffect(() => {
    let result = fundTransactions;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(query) ||
          t._id.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (typeFilter !== 'ALL') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Apply date filter
    if (dateRange !== 'ALL') {
      const now = new Date();
      const cutoffDate = new Date();
      switch (dateRange) {
        case '7D':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '30D':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case '90D':
          cutoffDate.setDate(now.getDate() - 90);
          break;
      }
      result = result.filter((t) => new Date(t.date) >= cutoffDate);
    }

    // Sort by date (newest first)
    result = result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    console.log(result);

    // setFilteredTransactions(result);
  }, [fundTransactions, searchQuery, typeFilter, dateRange]);

  const [, executeCreateTransaction] = useAxios(createTransaction(), {
    manual: true,
  });
  const [, executeGetAllTransactions] = useAxios(getTransactions(), {
    manual: true,
  });

  useEffect(() => {
    executeGetAllTransactions().then((res) => {
      dispatch(setTransaction(res.data));
    });
  }, [dispatch, executeGetAllTransactions, selectedFund._id]);

  const handleCreateTransaction = async (formData: TransactionFormData) => {
    setIsLoading(true);
    console.log('Creating transaction with data:', {
      ...formData,
      fundId: fundId,
    });
    executeCreateTransaction({
      data: { ...formData, fundId: fundId, amount: Number(formData.amount) },
    })
      .then(() => {
        executeGetAllTransactions().then((res) => {
          dispatch(setTransaction(res.data));
        });
        setIsLoading(false);
        setIsDialogOpen(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alert('Failed to create transaction' + err);
      });
  };

  const handleUpdateTransaction = async (formData: TransactionFormData) => {
    if (!editingTransaction) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedTransaction: Transaction = {
      ...editingTransaction,
      ...formData,
      amount: Number(formData.amount),
      updatedAt: new Date().toISOString(),
    };

    setTransactions((prev) =>
      prev.map((t) =>
        t._id === editingTransaction._id ? updatedTransaction : t
      )
    );
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (transaction: Transaction) => {
    if (
      window.confirm(
        `Are you sure you want to delete transaction TX-${transaction.id.slice(-6).toUpperCase()}?`
      )
    ) {
      setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleExport = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    alert('Transactions exported successfully!');
    setIsExporting(false);
  };

  const typeOptions = [
    { value: 'ALL', label: 'All Types', count: fundTransactions.length },
    { value: 'CAPITAL_CALL', label: 'Capital Calls', count: capitalCalls },
    { value: 'INVESTMENT', label: 'Investments', count: investments },
    { value: 'DISTRIBUTION', label: 'Distributions', count: distributions },
  ];

  const dateOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: '7D', label: 'Last 7 Days' },
    { value: '30D', label: 'Last 30 Days' },
    { value: '90D', label: 'Last 90 Days' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedFund.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedFund.name} Transactions
              </h1>
              <p className="text-gray-600 mt-1">
                Manage all transactions for this fund
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
          <Button variant="primary" size="sm" onClick={handleAddTransaction}>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Transactions
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {totalTransactions}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4"></div>
            </div>
            <span className="text-xs text-gray-500">This month: +12%</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-2/3"></div>
            </div>
            <span className="text-xs text-gray-500">
              Avg: {formatCurrency(totalAmount / totalTransactions)}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capital Calls</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {capitalCalls}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-3">
            {formatCurrency(
              fundTransactions
                .filter((t) => t.type === 'CAPITAL_CALL')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Investments</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {investments}
              </p>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-3">
            {formatCurrency(
              fundTransactions
                .filter((t) => t.type === 'INVESTMENT')
                .reduce((sum, t) => sum + t.amount, 0)
            )}
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
                placeholder="Search by ID, description, or amount..."
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

        {/* Type Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="flex flex-wrap gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTypeFilter(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  typeFilter === option.value
                    ? option.value === 'ALL'
                      ? 'bg-gray-900 text-white'
                      : option.value === 'CAPITAL_CALL'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : option.value === 'INVESTMENT'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-purple-100 text-purple-800 border border-purple-200'
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

      {/* Transactions Table */}
      <TransactionsTable
        transactions={transactionData}
        fund={selectedFund}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
        isLoading={isLoading}
      />

      {/* Summary Footer */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing{' '}
          <span className="font-semibold text-gray-900">
            {filteredTransactions.length}
          </span>{' '}
          of{' '}
          <span className="font-semibold text-gray-900">
            {fundTransactions.length}
          </span>{' '}
          transactions
          {searchQuery && (
            <span className="ml-2 text-primary-600">for "{searchQuery}"</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Capital Calls</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Investments</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Distributions</span>
          </div>
        </div>
      </div>

      {/* Transaction Dialog */}
      <TransactionDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={
          editingTransaction ? handleUpdateTransaction : handleCreateTransaction
        }
        transaction={editingTransaction}
        fund={selectedFund}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionsPage;
