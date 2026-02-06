import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Student {
  id: number;
  username: string;
  email: string;
  level: number;
  totalAssets: number;
  cashBalance: number;
  creditScore: number;
  riskLevel: string;
  lastActive: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'high-risk' | 'top-performers'>('all');

  useEffect(() => {
    // 模拟数据加载
    setStudents([
      {
        id: 1,
        username: '张三',
        email: 'zhangsan@example.com',
        level: 5,
        totalAssets: 25000,
        cashBalance: 15000,
        creditScore: 120,
        riskLevel: '低风险',
        lastActive: '10分钟前'
      },
      {
        id: 2,
        username: '李四',
        email: 'lisi@example.com',
        level: 3,
        totalAssets: 8000,
        cashBalance: 3000,
        creditScore: 85,
        riskLevel: '高风险',
        lastActive: '1小时前'
      },
      {
        id: 3,
        username: '王五',
        email: 'wangwu@example.com',
        level: 7,
        totalAssets: 42000,
        cashBalance: 20000,
        creditScore: 145,
        riskLevel: '低风险',
        lastActive: '30分钟前'
      }
    ]);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'high-risk') {
      return matchesSearch && student.riskLevel === '高风险';
    } else if (filter === 'top-performers') {
      return matchesSearch && student.totalAssets > 20000;
    }
    return matchesSearch;
  });

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case '低风险': return 'bg-green-100 text-green-800';
      case '中等风险': return 'bg-yellow-100 text-yellow-800';
      case '高风险': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">学生管理</h1>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          导出数据
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">学生总数</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">S</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均等级</p>
                <p className="text-2xl font-bold">Lv.5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">高风险学生</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.riskLevel === '高风险').length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均资产</p>
                <p className="text-2xl font-bold">
                  ¥{Math.round(students.reduce((acc, s) => acc + s.totalAssets, 0) / students.length).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="搜索学生姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                全部
              </Button>
              <Button
                variant={filter === 'high-risk' ? 'default' : 'outline'}
                onClick={() => setFilter('high-risk')}
              >
                高风险
              </Button>
              <Button
                variant={filter === 'top-performers' ? 'default' : 'outline'}
                onClick={() => setFilter('top-performers')}
              >
                优秀学生
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学生列表 */}
      <div className="space-y-4">
        {filteredStudents.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {student.username.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{student.username}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">等级</p>
                    <p className="font-bold text-blue-600">Lv.{student.level}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">总资产</p>
                    <p className="font-bold text-green-600">
                      ¥{student.totalAssets.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">信用分</p>
                    <p className="font-bold text-purple-600">{student.creditScore}</p>
                  </div>

                  <div>
                    <Badge className={getRiskLevelColor(student.riskLevel)}>
                      {student.riskLevel}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">最后活跃</p>
                    <p className="text-sm">{student.lastActive}</p>
                  </div>

                  <Button variant="outline" size="sm">
                    查看详情
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
