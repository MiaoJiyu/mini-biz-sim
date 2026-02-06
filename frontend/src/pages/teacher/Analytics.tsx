import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, AlertTriangle } from 'lucide-react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week');

  // 资产增长数据
  const assetGrowthData = {
    labels: timeRange === 'week' ? ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] :
             timeRange === 'month' ? ['第1周', '第2周', '第3周', '第4周'] :
             ['第1月', '第2月', '第3月', '第4月', '第5月', '第6月'],
    datasets: [
      {
        label: '平均资产',
        data: timeRange === 'week' ? [12000, 13500, 14200, 13800, 15000, 16200, 17500] :
               timeRange === 'month' ? [10000, 15000, 20000, 25000] :
               [8000, 12000, 18000, 24000, 32000, 40000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: '最高资产',
        data: timeRange === 'week' ? [18000, 22000, 25000, 24000, 28000, 32000, 35000] :
               timeRange === 'month' ? [15000, 28000, 38000, 50000] :
               [12000, 20000, 32000, 45000, 60000, 80000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // 投资分布数据
  const investmentDistributionData = {
    labels: ['股票', '房产', '存款', '现金'],
    datasets: [
      {
        data: [35, 30, 20, 15],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  // 学习活动数据
  const activityData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '完成任务数',
        data: [45, 52, 48, 61, 55, 30, 25],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">数据分析</h1>
          <p className="text-sm text-gray-600">学生表现和教学效果分析</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'semester'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '本学期'}
            </Button>
          ))}
        </div>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">总学生</p>
                <p className="text-xl font-bold">45</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">活跃度</p>
                <p className="text-xl font-bold text-green-600">85%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">平均资产</p>
                <p className="text-xl font-bold">¥18.5K</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">任务完成</p>
                <p className="text-xl font-bold text-purple-600">78%</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">风险学生</p>
                <p className="text-xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">资产增长</p>
                <p className="text-xl font-bold text-green-600">+25%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="students">学生分析</TabsTrigger>
          <TabsTrigger value="tasks">任务分析</TabsTrigger>
          <TabsTrigger value="investment">投资分析</TabsTrigger>
        </TabsList>

        {/* 概览 */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>资产增长趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={assetGrowthData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } },
                  scales: { y: { beginAtZero: true } }
                }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>投资分布</CardTitle>
              </CardHeader>
              <CardContent>
                <Pie data={investmentDistributionData} options={{
                  responsive: true,
                  plugins: { legend: { position: 'bottom' } }
                }} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>学习活动</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar data={activityData} options={{
                responsive: true,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
              }} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 学生分析 */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>学生表现排名</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: '张三', assets: 42000, level: 7, change: '+12%' },
                  { rank: 2, name: '王五', assets: 38000, level: 6, change: '+8%' },
                  { rank: 3, name: '赵六', assets: 35000, level: 6, change: '+15%' },
                  { rank: 4, name: '孙七', assets: 28000, level: 5, change: '+5%' },
                  { rank: 5, name: '李四', assets: 25000, level: 5, change: '-3%' },
                ].map((student) => (
                  <div key={student.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        student.rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-gray-400'
                      }`}>
                        {student.rank}
                      </div>
                      <div>
                        <h4 className="font-semibold">{student.name}</h4>
                        <p className="text-sm text-gray-600">Lv.{student.level}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div>
                        <p className="text-xs text-gray-600">资产</p>
                        <p className="font-bold text-green-600">¥{student.assets.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">变化</p>
                        <p className={`font-bold ${student.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {student.change}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 任务分析 */}
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>任务完成情况</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: '股票投资入门', assigned: 45, completed: 38, rate: 84 },
                  { name: '风险管理挑战', assigned: 30, completed: 15, rate: 50 },
                  { name: '金融知识测试', assigned: 45, completed: 42, rate: 93 },
                  { name: '房地产投资', assigned: 25, completed: 18, rate: 72 },
                ].map((task, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{task.name}</span>
                      <span className="text-gray-600">{task.completed}/{task.assigned} ({task.rate}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          task.rate >= 80 ? 'bg-green-500' :
                          task.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${task.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 投资分析 */}
        <TabsContent value="investment">
          <Card>
            <CardHeader>
              <CardTitle>投资行为分析</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-4">投资偏好分布</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>保守型</span>
                      <span className="font-bold text-blue-600">35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>稳健型</span>
                      <span className="font-bold text-green-600">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>进取型</span>
                      <span className="font-bold text-yellow-600">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>激进型</span>
                      <span className="font-bold text-red-600">5%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">主要风险点</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <span>3名学生存在高风险投资行为</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5" />
                      <span>5名学生过度依赖杠杆交易</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <span>部分学生缺乏风险意识</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
