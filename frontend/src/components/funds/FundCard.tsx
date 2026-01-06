import { Edit, Trash2, MoreVertical, DollarSign, Calendar, Percent, TrendingUp, ChevronRight } from 'lucide-react';
import { Fund } from '../../interfaces/fund';
import { cn } from '@/utils';
import { useNavigate } from 'react-router-dom';
import { setFundId } from '../../store/slices/persistedSlice';
import { useDispatch } from 'react-redux';

const FundCard = ({ fund, onEdit, onDelete }: { fund: Fund; onEdit: (fund: Fund) => void; onDelete: (fund: Fund) => void }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'OPEN': return 'bg-green-100 text-green-800 border-green-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'LIQUIDATED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const viewDetailsHandler = () => {
    dispatch(setFundId(fund.id));
    navigate(`/funds/${fund.id}/dashboard`)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {fund.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate">{fund.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('text-xs font-semibold px-2 py-1 rounded-full border', getStatusColor(fund.status))}>
                    {fund.status}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    Created {new Date(fund.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(fund)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={() => onDelete(fund)} className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>Fund Size</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatCurrency(fund.fundSize, fund.currency)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Vintage Year</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{fund.vintageYear}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Percent className="w-4 h-4" />
              <span>Management Fee</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{fund.managementFeePercent}%</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TrendingUp className="w-4 h-4" />
              <span>Carry</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{fund.carryPercent}%</p>
          </div>
        </div>
        {fund.description && (
          <div className="mb-5">
            <p className="text-sm text-gray-600 line-clamp-2">{fund.description}</p>
          </div>
        )}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Currency</div>
              <div className="text-sm font-semibold text-gray-900">{fund.currency}</div>
            </div>
            <div className="h-4 w-px bg-gray-300"></div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Last Updated</div>
              <div className="text-sm font-semibold text-gray-900">
                {new Date(fund.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 cursor-pointer" onClick={viewDetailsHandler}>
            View Details <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundCard;