import { InvestmentProduct } from '../../../services/bankService';
import { useState } from 'react';

interface InvestmentProductsProps {
  products: InvestmentProduct[];
  onPurchase: (productCode: string, amount: number) => void;
  onRefresh: () => void;
}

const InvestmentProducts = ({ products, onPurchase, onRefresh }: InvestmentProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<InvestmentProduct | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'return' | 'risk' | 'term'>('return');

  const getFilteredAndSortedProducts = () => {
    let filtered = filterType === 'all' 
      ? products 
      : products.filter(p => p.productType === filterType);
    
    return filtered.sort((a, b) => {
      if (sortOrder === 'return') return b.expectedReturnRate - a.expectedReturnRate;
      if (sortOrder === 'risk') return a.riskLevel - b.riskLevel;
      if (sortOrder === 'term') return a.termDays - b.termDays;
      return 0;
    });
  };

  const handlePurchase = () => {
    if (!selectedProduct || !purchaseAmount) return;

    const amount = parseFloat(purchaseAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的投资金额');
      return;
    }

    if (amount < selectedProduct.minInvestmentAmount) {
      alert(`最低投资金额为 ¥${selectedProduct.minInvestmentAmount.toLocaleString()}`);
      return;
    }

    if (amount > selectedProduct.maxInvestmentAmount) {
      alert(`最高投资金额为 ¥${selectedProduct.maxInvestmentAmount.toLocaleString()}`);
      return;
    }

    onPurchase(selectedProduct.productCode, amount);
    setPurchaseAmount('');
    setSelectedProduct(null);
  };

  const getProductTypeName = (type: string) => {
    switch (type) {
      case 'FIXED_INCOME': return '固定收益';
      case 'FUND': return '基金';
      case 'STRUCTURED': return '结构性';
      case 'HYBRID': return '混合型';
      default: return type;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'FIXED_INCOME': return 'from-green-500 to-green-600';
      case 'FUND': return 'from-blue-500 to-blue-600';
      case 'STRUCTURED': return 'from-purple-500 to-purple-600';
      case 'HYBRID': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRiskLevelColor = (level: number) => {
    if (level <= 3) return 'text-green-600';
    if (level <= 5) return 'text-yellow-600';
    if (level <= 7) return 'text-orange-600';
    return 'text-red-600';
  };

  const getRiskLevelText = (level: number) => {
    if (level <= 3) return '低风险';
    if (level <= 5) return '中等风险';
    if (level <= 7) return '较高风险';
    return '高风险';
  };

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">理财产品</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          刷新数据
        </button>
      </div>

      {/* 筛选和排序 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">产品类型</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部</option>
              <option value="FIXED_INCOME">固定收益</option>
              <option value="FUND">基金</option>
              <option value="STRUCTURED">结构性产品</option>
              <option value="HYBRID">混合型</option>
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">排序方式</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="return">预期收益率</option>
              <option value="risk">风险等级</option>
              <option value="term">投资期限</option>
            </select>
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* 产品类型标签 */}
            <div className={`bg-gradient-to-r ${getProductTypeColor(product.productType)} px-4 py-2`}>
              <span className="text-white font-medium">{getProductTypeName(product.productType)}</span>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{product.productName}</h3>
              <p className="text-sm text-gray-600 mb-4">{product.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-600">预期收益</div>
                  <div className="text-2xl font-bold text-green-600">{product.expectedReturnRate}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">风险等级</div>
                  <div className={`text-lg font-bold ${getRiskLevelColor(product.riskLevel)}`}>
                    {getRiskLevelText(product.riskLevel)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">投资期限</span>
                  <span className="font-medium">{product.termDays} 天</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">最低投资</span>
                  <span className="font-medium">¥{product.minInvestmentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">最高投资</span>
                  <span className="font-medium">¥{product.maxInvestmentAmount.toLocaleString()}</span>
                </div>
              </div>

              {product.earlyWithdrawalPenalty > 0 && (
                <div className="text-xs text-gray-500 mb-4">
                  提前赎回手续费: {product.earlyWithdrawalPenalty}%
                </div>
              )}

              <button
                onClick={() => setSelectedProduct(product)}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
              >
                立即购买
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 购买面板 */}
      {selectedProduct && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            购买 - {selectedProduct.productName}
          </h3>

          <div className="max-w-md">
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">预期年化收益</span>
                <span className="font-bold text-green-600">{selectedProduct.expectedReturnRate}%</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">投资期限</span>
                <span className="font-medium">{selectedProduct.termDays} 天</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">风险等级</span>
                <span className={`font-medium ${getRiskLevelColor(selectedProduct.riskLevel)}`}>
                  {getRiskLevelText(selectedProduct.riskLevel)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">投资金额</label>
              <input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder={`¥${selectedProduct.minInvestmentAmount.toLocaleString()} - ¥${selectedProduct.maxInvestmentAmount.toLocaleString()}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="text-sm text-gray-500 mt-1">
                预期收益: ¥{purchaseAmount ? (parseFloat(purchaseAmount) * selectedProduct.expectedReturnRate / 100 * selectedProduct.termDays / 365).toFixed(2) : '0.00'}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePurchase}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                确认购买
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setPurchaseAmount('');
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentProducts;
