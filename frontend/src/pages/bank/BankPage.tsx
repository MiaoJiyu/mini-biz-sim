import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import bankService, { BankAccount, CreditCard, InvestmentProduct, UserInvestment, CreditScore } from '../../services/bankService';
import AccountOverview from './components/AccountOverview';
import AccountList from './components/AccountList';
import CreditCardList from './components/CreditCardList';
import InvestmentProducts from './components/InvestmentProducts';
import UserInvestments from './components/UserInvestments';
import CreditScoreDisplay from './components/CreditScoreDisplay';

const BankPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [creditCards, setCreditCards] = useState<CreditCard[]>([]);
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [accountsData, cardsData, productsData, investmentsData, scoreData] = await Promise.all([
        bankService.getUserAccounts(user!.id),
        bankService.getUserCreditCards(user!.id),
        bankService.getAvailableProducts(),
        bankService.getUserInvestments(user!.id),
        bankService.getCreditScore(user!.id)
      ]);
      
      setAccounts(accountsData);
      setCreditCards(cardsData);
      setProducts(productsData);
      setInvestments(investmentsData);
      setCreditScore(scoreData);
    } catch (error) {
      console.error('加载银行数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (accountNumber: string, amount: number) => {
    try {
      await bankService.deposit(accountNumber, amount);
      loadData();
    } catch (error) {
      console.error('存款失败:', error);
      alert('存款失败，请稍后重试');
    }
  };

  const handleWithdraw = async (accountNumber: string, amount: number) => {
    try {
      await bankService.withdraw(accountNumber, amount);
      loadData();
    } catch (error) {
      console.error('取款失败:', error);
      alert('取款失败，请稍后重试');
    }
  };

  const handleTransfer = async (fromAccount: string, toAccount: string, amount: number) => {
    try {
      await bankService.transfer(fromAccount, toAccount, amount);
      loadData();
    } catch (error) {
      console.error('转账失败:', error);
      alert('转账失败，请稍后重试');
    }
  };

  const handleCreditCardPayment = async (cardNumber: string, amount: number) => {
    try {
      await bankService.creditCardPayment(cardNumber, amount);
      loadData();
    } catch (error) {
      console.error('还款失败:', error);
      alert('还款失败，请稍后重试');
    }
  };

  const handlePurchaseProduct = async (productCode: string, amount: number) => {
    try {
      await bankService.purchaseProduct(user!.id, productCode, amount);
      loadData();
    } catch (error) {
      console.error('购买产品失败:', error);
      alert('购买产品失败，请稍后重试');
    }
  };

  const handleRedeemInvestment = async (investmentId: number) => {
    try {
      await bankService.redeemInvestment(investmentId);
      loadData();
    } catch (error) {
      console.error('赎回失败:', error);
      alert('赎回失败，请稍后重试');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载银行服务...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: '概览' },
    { id: 'accounts', label: '账户管理' },
    { id: 'credit-cards', label: '信用卡' },
    { id: 'investments', label: '理财产品' },
    { id: 'my-investments', label: '我的投资' },
    { id: 'credit-score', label: '信用评分' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 页头 */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                银行服务中心
              </h1>
              <p className="text-gray-600 mt-1">管理您的账户、信用卡和投资</p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              返回仪表盘
            </button>
          </div>
        </div>
      </div>

      {/* 标签导航 */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-2">
          <div className="flex space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {activeTab === 'overview' && (
            <AccountOverview
              accounts={accounts}
              creditCards={creditCards}
              investments={investments}
              creditScore={creditScore}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'accounts' && (
            <AccountList
              accounts={accounts}
              onDeposit={handleDeposit}
              onWithdraw={handleWithdraw}
              onTransfer={handleTransfer}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'credit-cards' && (
            <CreditCardList
              creditCards={creditCards}
              onPayment={handleCreditCardPayment}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'investments' && (
            <InvestmentProducts
              products={products}
              onPurchase={handlePurchaseProduct}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'my-investments' && (
            <UserInvestments
              investments={investments}
              onRedeem={handleRedeemInvestment}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'credit-score' && (
            <CreditScoreDisplay
              creditScore={creditScore}
              onUpdate={loadData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BankPage;
