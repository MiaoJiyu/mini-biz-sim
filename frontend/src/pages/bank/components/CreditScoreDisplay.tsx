import { CreditScore } from '../../../services/bankService';
import bankService from '../../../services/bankService';
import { useAuth } from '../../../contexts/AuthContext';
import { useState } from 'react';

interface CreditScoreDisplayProps {
  creditScore: CreditScore | null;
  onUpdate: () => void;
}

const CreditScoreDisplay = ({ creditScore, onUpdate }: CreditScoreDisplayProps) => {
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);

  const handleUpdateScore = async () => {
    if (!user) return;
    
    setUpdating(true);
    try {
      await bankService.updateCreditScore(user.id);
      onUpdate();
      alert('信用评分更新成功！');
    } catch (error) {
      console.error('更新信用评分失败:', error);
      alert('更新信用评分失败，请稍后重试');
    } finally {
      setUpdating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 800) return 'from-green-500 to-green-600';
    if (score >= 750) return 'from-blue-500 to-blue-600';
    if (score >= 700) return 'from-cyan-500 to-cyan-600';
    if (score >= 650) return 'from-yellow-500 to-yellow-600';
    if (score >= 600) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getRatingText = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return '优秀';
      case 'VERY_GOOD': return '很好';
      case 'GOOD': return '良好';
      case 'FAIR': return '一般';
      case 'POOR': return '较差';
      case 'VERY_POOR': return '很差';
      default: return rating;
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'EXCELLENT': return 'text-green-600 bg-green-50';
      case 'VERY_GOOD': return 'text-blue-600 bg-blue-50';
      case 'GOOD': return 'text-cyan-600 bg-cyan-50';
      case 'FAIR': return 'text-yellow-600 bg-yellow-50';
      case 'POOR': return 'text-orange-600 bg-orange-50';
      case 'VERY_POOR': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  if (!creditScore) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-600 mb-4">暂无信用评分数据</p>
        <button
          onClick={onUpdate}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
        >
          刷新数据
        </button>
      </div>
    );
  }

  const score = creditScore.score;
  const percentage = ((score - 300) / 550) * 100;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">信用评分</h2>
        <button
          onClick={handleUpdateScore}
          disabled={updating}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
        >
          {updating ? '更新中...' : '更新评分'}
        </button>
      </div>

      {/* 信用评分展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className={`bg-gradient-to-br ${getScoreColor(score)} rounded-2xl p-8 text-white shadow-2xl`}>
          <div className="text-center">
            <div className="text-8xl font-bold mb-2">{score}</div>
            <div className="text-2xl font-medium mb-4">{getRatingText(creditScore.rating)}</div>
            
            {/* 进度条 */}
            <div className="bg-white/20 rounded-full h-4 mb-4">
              <div
                className="bg-white rounded-full h-4 transition-all duration-1000"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm text-white/80">
              <span>300</span>
              <span>575</span>
              <span>850</span>
            </div>
          </div>
        </div>

        {/* 评分详情 */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">评分详情</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">还款历史</span>
                <span className="font-bold text-blue-600">{creditScore.paymentHistory}/150</span>
              </div>
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(creditScore.paymentHistory / 150) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">信用利用率</span>
                <span className="font-bold text-green-600">{creditScore.creditUtilization}/150</span>
              </div>
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-green-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(creditScore.creditUtilization / 150) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">信用年龄</span>
                <span className="font-bold text-purple-600">{creditScore.creditAge}/100</span>
              </div>
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(creditScore.creditAge / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">信用组合</span>
                <span className="font-bold text-orange-600">{creditScore.creditMix}/100</span>
              </div>
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-orange-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(creditScore.creditMix / 100) * 100}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600">新信用</span>
                <span className="font-bold text-red-600">{creditScore.newCredit}/100</span>
              </div>
              <div className="bg-white rounded-full h-2">
                <div
                  className="bg-red-600 rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(creditScore.newCredit / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 信用评分等级说明 */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-4">信用评分等级说明</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-800">优秀</span>
            </div>
            <div className="text-sm text-gray-600">800-850</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="font-medium text-gray-800">很好</span>
            </div>
            <div className="text-sm text-gray-600">750-799</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="font-medium text-gray-800">良好</span>
            </div>
            <div className="text-sm text-gray-600">700-749</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="font-medium text-gray-800">一般</span>
            </div>
            <div className="text-sm text-gray-600">650-699</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="font-medium text-gray-800">较差</span>
            </div>
            <div className="text-sm text-gray-600">600-649</div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="font-medium text-gray-800">很差</span>
            </div>
            <div className="text-sm text-gray-600">300-599</div>
          </div>
        </div>
      </div>

      {/* 更新时间 */}
      <div className="mt-6 text-center text-sm text-gray-500">
        最后更新时间: {formatDate(creditScore.lastUpdated)}
      </div>
    </div>
  );
};

export default CreditScoreDisplay;
