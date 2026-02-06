import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Check, Sparkles, TrendingUp, Home, CreditCard, ShoppingCart } from 'lucide-react';

interface OnboardingStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  reward: string;
  difficulty: 'easy' | 'medium';
}

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTutorial: (stepId: string) => void;
}

export default function OnboardingModal({ isOpen, onClose, onStartTutorial }: OnboardingModalProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 'create-account',
      icon: Sparkles,
      title: '创建账户',
      description: '完善个人信息,设置您的游戏角色',
      reward: '+50 XP',
      difficulty: 'easy'
    },
    {
      id: 'first-deposit',
      icon: TrendingUp,
      title: '首次投资',
      description: '在股票市场完成您的第一笔交易',
      reward: '+100 XP',
      difficulty: 'medium'
    },
    {
      id: 'buy-property',
      icon: Home,
      title: '购买房产',
      description: '在房地产市场购买您的第一套房产',
      reward: '+150 XP',
      difficulty: 'medium'
    },
    {
      id: 'open-bank',
      icon: CreditCard,
      title: '银行开户',
      description: '在银行开设账户并申请信用卡',
      reward: '+100 XP',
      difficulty: 'easy'
    },
    {
      id: 'first-purchase',
      icon: ShoppingCart,
      title: '首次购物',
      description: '在商场购买您的第一个商品',
      reward: '+50 XP',
      difficulty: 'easy'
    }
  ];

  const handleStepClick = (stepId: string) => {
    if (completedSteps.includes(stepId)) {
      return;
    }
    onStartTutorial(stepId);
    onClose();
  };

  if (!isOpen) return null;

  const completedCount = completedSteps.length;
  const totalReward = completedCount * 50 + completedSteps.filter(id => {
    const step = steps.find(s => s.id === id);
    return step?.difficulty === 'medium';
  }).length * 50;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">欢迎来到财商学堂!</CardTitle>
              <CardDescription className="text-white/90">
                完成新手任务,快速熟悉系统操作
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* 进度概览 */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-900">新手引导进度</h4>
                <p className="text-sm text-gray-600">
                  已完成 {completedCount} / {steps.length} 个任务
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {totalReward} XP
                </div>
                <div className="text-sm text-gray-600">已获得奖励</div>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 任务列表 */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.includes(step.id);
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white hover:border-blue-300 cursor-pointer'
                  }`}
                  onClick={() => handleStepClick(step.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {step.title}
                        </h4>
                        <Badge className={
                          step.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {step.difficulty === 'easy' ? '简单' : '中等'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="text-sm font-medium text-yellow-600">
                        {step.reward}
                      </div>
                    </div>

                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      size="sm"
                      disabled={isCompleted}
                    >
                      {isCompleted ? '已完成' : '开始'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 底部提示 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 提示: 完成所有新手任务后将解锁高级功能和专属奖励!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
