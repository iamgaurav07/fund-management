import { Edit, Trash2, MoreVertical, Eye } from 'lucide-react';
import { Transaction } from '../../interfaces/transaction';
import { cn } from '@/utils';
import { Fund } from '../../interfaces/fund';

interface TransactionsTableProps {
  transactions: Transaction[];
  fund: Fund;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  isLoading?: boolean;
}

const TransactionsTable = ({ 
  transactions, 
  fund,
  onEdit, 
  onDelete, 
  isLoading = false 
}: TransactionsTableProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'CAPITAL_CALL':
        return 'bg-blue-100 text-blue-800';
      case 'INVESTMENT':
        return 'bg-green-100 text-green-800';
      case 'DISTRIBUTION':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'CAPITAL_CALL':
        return 'Capital Call';
      case 'INVESTMENT':
        return 'Investment';
      case 'DISTRIBUTION':
        return 'Distribution';
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
        <p className="text-center mt-4 text-gray-600">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
        <p className="text-gray-600">Create your first transaction to get started</p>
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
                Transaction
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction: Transaction) => (
              <tr 
                key={transaction._id} 
                className="hover:bg-gray-50 transition-colors duration-150 group"
              >
                {/* Transaction ID */}
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mr-3",
                      transaction.type === 'CAPITAL_CALL' ? 'bg-blue-500' :
                      transaction.type === 'INVESTMENT' ? 'bg-green-500' :
                      'bg-purple-500'
                    )}>
                      <span className="text-white font-bold text-sm">
                        {transaction.type.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        TX-{transaction._id.slice(-6).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="py-4 px-6">
                  <span className={cn(
                    "inline-flex px-3 py-1 rounded-full text-xs font-semibold",
                    getTransactionTypeColor(transaction.type)
                  )}>
                    {getTransactionTypeLabel(transaction.type)}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-4 px-6">
                  <div className="flex items-baseline">
                    <span className={cn(
                      "text-lg font-bold",
                      transaction.type === 'CAPITAL_CALL' ? 'text-blue-600' :
                      transaction.type === 'INVESTMENT' ? 'text-green-600' :
                      'text-purple-600'
                    )}>
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </div>
                </td>

                {/* Date */}
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900 font-medium">
                    {formatDate(transaction.date)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </td>

                {/* Description */}
                <td className="py-4 px-6">
                  <div className="max-w-xs">
                    <p className="text-sm text-gray-900 truncate">
                      {transaction.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated {formatDate(transaction.updatedAt)}
                    </p>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(transaction)}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{transactions.length}</span> transactions for {fund.name}
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

export default TransactionsTable;