import { Edit, Trash2, MoreVertical, TrendingUp, TrendingDown, Building } from 'lucide-react';
import { Investment, Fund } from '../../interfaces/investment';
import { cn } from '@/utils';

interface InvestmentsTableProps {
  investments: Investment[];
  fund: Fund;
  onEdit: (investment: Investment) => void;
  onDelete: (investment: Investment) => void;
  isLoading?: boolean;
}

const InvestmentsTable = ({ 
  investments, 
  fund,
  onEdit, 
  onDelete, 
  isLoading = false 
}: InvestmentsTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculatePerformance = (investment: Investment) => {
    const amount = investment.currentValue - investment.investedAmount;
    const percentage = (amount / investment.investedAmount) * 100;
    return { amount, percentage };
  };

  const getInitials = (companyName: string) => {
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading investments...</p>
      </div>
    );
  }

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No investments found</h3>
        <p className="text-gray-600">Create your first investment to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Company
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Invested
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Current Value
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Performance
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {investments.map((investment) => {
              const performance = calculatePerformance(investment);
              const isPositive = performance.percentage >= 0;
              const initials = getInitials(investment.companyName);

              return (
                <tr 
                  key={investment.id} 
                  className="hover:bg-gray-50 transition-colors duration-150 group"
                >
                  {/* Company */}
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                        isPositive ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
                      )}>
                        <span className="text-white font-bold text-sm">
                          {initials}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {investment.companyName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {investment.description?.split(' ').slice(0, 5).join(' ')}...
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Invested Amount */}
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(investment.investedAmount, fund.currency)}
                    </div>
                  </td>

                  {/* Current Value */}
                  <td className="py-4 px-6">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(investment.currentValue, fund.currency)}
                    </div>
                  </td>

                  {/* Performance */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <div className={cn(
                          "text-sm font-bold",
                          isPositive ? "text-green-600" : "text-red-600"
                        )}>
                          {isPositive ? '+' : ''}{formatPercentage(performance.percentage)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCurrency(Math.abs(performance.amount), fund.currency)}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900 font-medium">
                      {formatDate(investment.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(investment.date).toLocaleDateString('en-US', { year: 'numeric' })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(investment)}
                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(investment)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{investments.length}</span> investments in {fund.name}
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Previous
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-white bg-primary-600 rounded-lg">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                3
              </button>
              <span className="text-gray-500">...</span>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                10
              </button>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentsTable;