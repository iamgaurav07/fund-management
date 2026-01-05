import {
  Users, 
  DollarSign, 
  PieChart, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Filter,
  Eye,
  RefreshCw,
  Shield,
  BarChart3
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const DashboardPage = () => {
  // Stats Data
  const stats = [
    {
      title: 'Total AUM',
      value: '$124.8M',
      change: '+12.5%',
      trend: 'up',
      icon: <DollarSign className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
    },
    {
      title: 'Active Investors',
      value: '1,248',
      change: '+8.2%',
      trend: 'up',
      icon: <Users className="w-5 h-5" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: 'Portfolio Yield',
      value: '9.8%',
      change: '+1.2%',
      trend: 'up',
      icon: <PieChart className="w-5 h-5" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
    },
    {
      title: 'Risk Score',
      value: 'Medium',
      change: 'Stable',
      trend: 'neutral',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
    },
  ];

  // Recent Funds
  const recentFunds = [
    { 
      name: 'Growth Equity Fund', 
      aum: '$45.2M', 
      return: '+18.2%', 
      risk: 'Medium',
      color: 'bg-blue-500'
    },
    { 
      name: 'Income Fund', 
      aum: '$32.8M', 
      return: '+8.5%', 
      risk: 'Low',
      color: 'bg-green-500'
    },
    { 
      name: 'Venture Capital', 
      aum: '$28.4M', 
      return: '+24.7%', 
      risk: 'High',
      color: 'bg-purple-500'
    },
    { 
      name: 'Real Estate Fund', 
      aum: '$18.6M', 
      return: '+6.8%', 
      risk: 'Low',
      color: 'bg-orange-500'
    },
  ];

  // Recent Transactions
  const recentTransactions = [
    { 
      investor: 'Sarah Johnson', 
      amount: '$250,000', 
      type: 'Subscription', 
      date: '2 hours ago', 
      status: 'Completed',
      avatarColor: 'bg-blue-100'
    },
    { 
      investor: 'Michael Chen', 
      amount: '$500,000', 
      type: 'Redemption', 
      date: '4 hours ago', 
      status: 'Pending',
      avatarColor: 'bg-green-100'
    },
    { 
      investor: 'Global Investments LLC', 
      amount: '$1,200,000', 
      type: 'Subscription', 
      date: '1 day ago', 
      status: 'Completed',
      avatarColor: 'bg-purple-100'
    },
    { 
      investor: 'Robert Williams', 
      amount: '$75,000', 
      type: 'Subscription', 
      date: '2 days ago', 
      status: 'Completed',
      avatarColor: 'bg-orange-100'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">Welcome back, John. Here's what's happening with your funds today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-gray-300">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm" className="border-gray-300">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="primary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1.5 mt-3">
                  {stat.trend === 'up' ? (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  ) : stat.trend === 'down' ? (
                    <div className="flex items-center gap-1 bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      <span className="text-xs font-medium">{stat.change}</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-500">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
                <div className="text-white">{stat.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Funds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
              <p className="text-sm text-gray-600">Last 12 months returns</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Chart */}
          <div className="relative h-64">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 25, 50, 75, 100].map((line) => (
                <div key={line} className="border-t border-gray-100"></div>
              ))}
            </div>
            
            {/* Bars */}
            <div className="absolute inset-0 flex items-end gap-3 px-4">
              {[65, 85, 50, 75, 95, 90, 80, 100, 70, 90, 75, 85].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-primary-400 to-primary-600 rounded-t-lg transition-all duration-300 hover:opacity-90 cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Chart Footer */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600">Avg. Monthly Return</p>
              <p className="text-lg font-semibold text-gray-900">+1.8%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Performing</p>
              <p className="text-lg font-semibold text-gray-900">Venture Capital</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">YTD Return</p>
              <p className="text-lg font-semibold text-green-600">+18.4%</p>
            </div>
          </div>
        </Card>

        {/* Fund Performance */}
        <Card className="p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Funds</h3>
              <p className="text-sm text-gray-600">Sorted by YTD returns</p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-300">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentFunds.map((fund, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 ${fund.color} rounded-xl flex items-center justify-center`}>
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{fund.name}</p>
                    <p className={`text-sm font-bold ${
                      fund.return.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {fund.return}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600">AUM: {fund.aum}</p>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      fund.risk === 'High' ? 'bg-red-100 text-red-800' :
                      fund.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {fund.risk} Risk
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <p className="text-sm text-gray-600">Latest investor activities</p>
          </div>
          <Button variant="outline" size="sm" className="border-gray-300">
            View All Transactions
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Investor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${transaction.avatarColor} rounded-full flex items-center justify-center`}>
                        <span className="text-xs font-bold text-gray-700">
                          {transaction.investor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{transaction.investor}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-gray-900">{transaction.amount}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      transaction.type === 'Subscription' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600">{transaction.date}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      transaction.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;