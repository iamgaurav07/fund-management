/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  Search,
  Download,
  TrendingUp,
  DollarSign,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { Fund, FundFormData } from '../interfaces/fund';
import FundCard from '@/components/funds/FundCard';
import FundDialog from '@/components/funds/FundDialog';
import useAxios from 'axios-hooks';
import { createFund, getFunds } from '@/apis/fund';
import { setFund } from '../store/slices/fundSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';

// Main FundsPage Component
const FundsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [filteredFunds, setFilteredFunds] = useState<Fund[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFund, setEditingFund] = useState<Fund | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { fundData } = useSelector((state: RootState) => state.fundSlice) as {
    fundData: Fund[];
  };

  const [, executeFetchFunds] = useAxios(getFunds(), { manual: true });

  useEffect(() => {
    executeFetchFunds().then(res => {
      dispatch(setFund(res.data));
      let result = res.data;
    if (searchQuery) {
      result = result.filter(
        (fund: Fund) =>
          fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          fund.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'ALL') {
      result = result.filter((fund: Fund) => fund.status === statusFilter);
    }
    setFilteredFunds(result);
    })
    
  }, [dispatch, executeFetchFunds, searchQuery, statusFilter]);

  const [, executeCreateFund] = useAxios(createFund(), { manual: true });

  const handleCreateFund = async (formData: FundFormData) => {
    setIsLoading(true);
    executeCreateFund({ data: formData })
      .then((res) => {
        dispatch(setFund(res.data));
        setIsLoading(false);
        setIsDialogOpen(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateFund = async (formData: FundFormData) => {
    if (!editingFund) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('---update fund', { ...editingFund, ...formData });
    setIsLoading(false);
    setIsDialogOpen(false);
    setEditingFund(null);
  };

  const handleDeleteFund = (fund: Fund) => {
    if (window.confirm(`Are you sure you want to delete "${fund.name}"?`)) {
      console.log('---delete fund', fund);
    }
  };

  const handleEditFund = (fund: Fund) => {
    setEditingFund(fund);
    setIsDialogOpen(true);
  };

  const handleAddFund = () => {
    setEditingFund(null);
    setIsDialogOpen(true);
  };

  const totalAUM = fundData.reduce((sum, fund) => sum + fund.fundSize, 0);
  const activeFunds = fundData.filter((fund) => fund.status === 'OPEN').length;
  const avgManagementFee =
    fundData.reduce((sum, fund) => sum + fund.managementFeePercent, 0) /
    fundData.length;

  const statusOptions = [
    { value: 'ALL', label: 'All Status', count: fundData.length },
    {
      value: 'DRAFT',
      label: 'Draft',
      count: fundData.filter((f) => f.status === 'DRAFT').length,
    },
    {
      value: 'OPEN',
      label: 'Open',
      count: fundData.filter((f) => f.status === 'OPEN').length,
    },
    {
      value: 'CLOSED',
      label: 'Closed',
      count: fundData.filter((f) => f.status === 'CLOSED').length,
    },
    {
      value: 'LIQUIDATED',
      label: 'Liquidated',
      count: fundData.filter((f) => f.status === 'LIQUIDATED').length,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Fund Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your investment funds portfolio
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </button>
              <Button variant="outline" size="sm" className="border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddFund}>
                <Plus className="w-4 h-4 mr-2" />
                New Fund
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AUM</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {formatCurrency(totalAUM)}
                </p>
              </div>
              <DollarSign className="w-10 h-10 text-primary-600 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Across {fundData.length} funds
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Funds
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {activeFunds}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-600 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {((activeFunds / fundData.length) * 100).toFixed(0)}% of portfolio
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Management Fee
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {avgManagementFee.toFixed(2)}%
                </p>
              </div>
              <PieChart className="w-10 h-10 text-purple-600 opacity-80" />
            </div>
            <p className="text-xs text-gray-500 mt-3">Industry avg: 2.0%</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="lg:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="search"
                  placeholder="Search funds by name or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm text-gray-900 bg-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Status:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === option.value
                        ? option.value === 'ALL'
                          ? 'bg-gray-900 text-white'
                          : option.value === 'DRAFT'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : option.value === 'OPEN'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : option.value === 'CLOSED'
                                ? 'bg-gray-100 text-gray-800 border border-gray-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <span className="ml-1.5 text-xs opacity-80">
                      ({option.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Funds Grid */}
        {filteredFunds.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredFunds.map((fund) => (
              <FundCard
                key={fund.id}
                fund={fund}
                onEdit={handleEditFund}
                onDelete={handleDeleteFund}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No funds found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'ALL'
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by creating your first fund'}
            </p>
            <Button variant="primary" onClick={handleAddFund}>
              <Plus className="w-4 h-4 mr-2" />
              Create First Fund
            </Button>
          </div>
        )}

        {/* Dialog */}
        <FundDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setEditingFund(null);
          }}
          onSubmit={editingFund ? handleUpdateFund : handleCreateFund}
          fund={editingFund}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default FundsPage;
