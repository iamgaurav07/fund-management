import { Edit, Trash2, MoreVertical, DollarSign, Calendar, Tag, Building } from 'lucide-react';
import { Transaction } from '../../interfaces/transaction';
import { cn } from '@/utils';
import { Fund } from '../../interfaces/fund';

interface TransactionCardProps {
  transaction: Transaction;
  fund: Fund;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
}

const TransactionCard = ({ transaction, fund, onEdit, onDelete }: TransactionCardProps) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'CAPITAL_CALL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INVESTMENT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'DISTRIBUTION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'CAPITAL_CALL':
        return '💰';
      case 'INVESTMENT':
        return '📈';
      case 'DISTRIBUTION':
        return '💸';
      default:
        return '📊';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                transaction.type === 'CAPITAL_CALL' ? 'bg-blue-500' :
                transaction.type === 'INVESTMENT' ? 'bg-green-500' :
                'bg-purple-500'
              )}>
                <span className="text-white text-lg">
                  {getTransactionTypeIcon(transaction.type)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-lg truncate">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </h3>
                  <span className={cn(
                    'text-xs font-semibold px-2 py-1 rounded-full border',
                    getTransactionTypeColor(transaction.type)
                  )}>
                    {transaction.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{fund.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600">{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
              title="Edit Transaction"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(transaction)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
              title="Delete Transaction"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Tag className="w-4 h-4" />
              <span>Type</span>
            </div>
            <p className="text-base font-semibold text-gray-900 capitalize">
              {transaction.type.toLowerCase().replace('_', ' ')}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Currency</span>
            </div>
            <p className="text-base font-semibold text-gray-900">{transaction.currency}</p>
          </div>
        </div>

        {/* Description */}
        {transaction.description && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">{transaction.description}</p>
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Transaction ID</div>
              <div className="text-sm font-semibold text-gray-900 font-mono">
                {transaction.id.slice(-8).toUpperCase()}
              </div>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(transaction.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs text-gray-500">Created</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;