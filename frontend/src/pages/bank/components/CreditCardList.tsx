import { CreditCard } from '../../../services/bankService';
import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import bankService from '../../../services/bankService';

interface CreditCardListProps {
  creditCards: CreditCard[];
  onPayment: (cardNumber: string, amount: number) => void;
  onRefresh: () => void;
}

const CreditCardList = ({ creditCards, onPayment, onRefresh }: CreditCardListProps) => {
  const { user } = useAuth();
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyForCard = async () => {
    if (!user) return;
    
    setApplying(true);
    try {
      await bankService.applyForCreditCard(user.id, user.name || '用户');
      alert('信用卡申请成功！');
      onRefresh();
    } catch (error) {
      console.error('申请信用卡失败:', error);
      alert('申请信用卡失败，请稍后重试');
    } finally {
      setApplying(false);
    }
  };

  const handlePayment = () => {
    if (!selectedCard || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的还款金额');
      return;
    }

    onPayment(selectedCard.cardNumber, amount);
    setPaymentAmount('');
    setSelectedCard(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' });
  };

  const getCardStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'FROZEN': return 'text-blue-600 bg-blue-50';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50';
      case 'BLOCKED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCardStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '活跃';
      case 'FROZEN': return '冻结';
      case 'CANCELLED': return '已取消';
      case 'BLOCKED': return '封锁';
      default: return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">信用卡管理</h2>
        <div className="flex gap-3">
          {creditCards.length === 0 && (
            <button
              onClick={handleApplyForCard}
              disabled={applying}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {applying ? '申请中...' : '申请信用卡'}
            </button>
          )}
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            刷新数据
          </button>
        </div>
      </div>

      {creditCards.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <p className="text-gray-600 mb-4">您还没有信用卡</p>
          <button
            onClick={handleApplyForCard}
            disabled={applying}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            申请您的第一张信用卡
          </button>
        </div>
      ) : (
        <>
          {/* 信用卡列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {creditCards.map(card => (
              <div
                key={card.id}
                className={`bg-gradient-to-br ${card.status === 'ACTIVE' ? 'from-purple-600 to-pink-600' : 'from-gray-400 to-gray-500'} rounded-xl p-6 text-white shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm opacity-80 mb-1">持卡人</div>
                    <div className="font-bold text-lg">{card.cardHolder}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCardStatusColor(card.status)}`}>
                    {getCardStatusText(card.status)}
                  </span>
                </div>

                <div className="text-2xl font-mono tracking-wider mb-6">
                  {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs opacity-80 mb-1">有效期</div>
                    <div className="font-medium">{formatDate(card.expiryDate)}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-80 mb-1">CVV</div>
                    <div className="font-medium">{card.cvv}</div>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-xs opacity-80">信用额度</div>
                      <div className="font-bold text-lg">¥{card.creditLimit.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">已用额度</div>
                      <div className="font-medium">¥{card.usedLimit.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(card.usedLimit / card.creditLimit) * 100}%` }}
                  ></div>
                </div>

                <div className="mt-4 flex justify-between text-sm">
                  <span className="opacity-80">可用额度</span>
                  <span className="font-bold">¥{card.availableLimit.toLocaleString()}</span>
                </div>

                {card.status === 'ACTIVE' && (
                  <button
                    onClick={() => setSelectedCard(card)}
                    className="w-full mt-4 px-4 py-2 bg-white text-purple-600 font-medium rounded-lg hover:bg-purple-50 transition-all duration-300"
                  >
                    立即还款
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* 还款面板 */}
          {selectedCard && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                还款 - {selectedCard.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
              </h3>

              <div className="max-w-md">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">当前欠款</div>
                    <div className="text-xl font-bold text-red-600">¥{selectedCard.currentBalance.toLocaleString()}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">最低还款</div>
                    <div className="text-xl font-bold text-blue-600">¥{selectedCard.minimumPayment.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">还款金额</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="输入还款金额"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    确认还款
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCard(null);
                      setPaymentAmount('');
                    }}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-300"
                  >
                    取消
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreditCardList;
