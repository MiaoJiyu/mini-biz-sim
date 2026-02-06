import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, CheckCircle, Clock, Users } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  type: 'tutorial' | 'challenge' | 'quiz';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeLimit: number;
  assignedCount: number;
  completedCount: number;
  status: 'draft' | 'published' | 'archived';
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: '股票投资入门',
      description: '学习基础股票知识,完成首次买卖',
      type: 'tutorial',
      difficulty: 'easy',
      xpReward: 100,
      timeLimit: 60,
      assignedCount: 45,
      completedCount: 38,
      status: 'published'
    },
    {
      id: 2,
      title: '风险管理挑战',
      description: '在不损失超过10%的情况下获得15%收益',
      type: 'challenge',
      difficulty: 'medium',
      xpReward: 200,
      timeLimit: 120,
      assignedCount: 30,
      completedCount: 15,
      status: 'published'
    },
    {
      id: 3,
      title: '金融知识测试',
      description: '回答10道金融知识选择题',
      type: 'quiz',
      difficulty: 'easy',
      xpReward: 50,
      timeLimit: 30,
      assignedCount: 45,
      completedCount: 42,
      status: 'published'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'tutorial' as Task['type'],
    difficulty: 'easy' as Task['difficulty'],
    xpReward: 100,
    timeLimit: 60
  });

  const getDifficultyColor = (difficulty: Task['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeIcon = (type: Task['type']) => {
    switch (type) {
      case 'tutorial': return <Clock className="w-4 h-4" />;
      case 'challenge': return <CheckCircle className="w-4 h-4" />;
      case 'quiz': return <Users className="w-4 h-4" />;
    }
  };

  const handleCreateTask = () => {
    const task: Task = {
      id: tasks.length + 1,
      ...newTask,
      assignedCount: 0,
      completedCount: 0,
      status: 'draft'
    };
    setTasks([...tasks, task]);
    setShowCreateModal(false);
    setNewTask({
      title: '',
      description: '',
      type: 'tutorial',
      difficulty: 'easy',
      xpReward: 100,
      timeLimit: 60
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">任务管理</h1>
          <p className="text-sm text-gray-600">发布和管理学生任务</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          创建任务
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <div className="text-sm text-gray-600">总任务数</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'published').length}
            </div>
            <div className="text-sm text-gray-600">已发布</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter(t => t.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-600">草稿中</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(tasks.reduce((acc, t) => acc + (t.completedCount / Math.max(t.assignedCount, 1)), 0) / tasks.length * 100)}%
            </div>
            <div className="text-sm text-gray-600">平均完成率</div>
          </CardContent>
        </Card>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(task.type)}
                    <h3 className="font-semibold text-lg">{task.title}</h3>
                    <Badge className={getDifficultyColor(task.difficulty)}>
                      {task.difficulty}
                    </Badge>
                    <Badge variant="outline">{task.type}</Badge>
                    <Badge className={task.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {task.status === 'published' ? '已发布' : task.status === 'draft' ? '草稿' : '已归档'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-gray-500">XP奖励:</span>
                      <span className="font-medium ml-1 text-yellow-600">+{task.xpReward}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">时间限制:</span>
                      <span className="font-medium ml-1">{task.timeLimit}分钟</span>
                    </div>
                    <div>
                      <span className="text-gray-500">分配:</span>
                      <span className="font-medium ml-1">{task.assignedCount}人</span>
                    </div>
                    <div>
                      <span className="text-gray-500">完成:</span>
                      <span className="font-medium ml-1 text-green-600">{task.completedCount}人</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  {task.status === 'published' && (
                    <Button variant="outline" size="sm">
                      查看进度
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 创建任务弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>创建新任务</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>任务标题</Label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="输入任务标题"
                />
              </div>

              <div className="space-y-2">
                <Label>任务描述</Label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="输入任务描述"
                  className="w-full p-3 border rounded-md min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>任务类型</Label>
                  <select
                    value={newTask.type}
                    onChange={(e) => setNewTask({...newTask, type: e.target.value as Task['type']})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="tutorial">教程</option>
                    <option value="challenge">挑战</option>
                    <option value="quiz">测验</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>难度等级</Label>
                  <select
                    value={newTask.difficulty}
                    onChange={(e) => setNewTask({...newTask, difficulty: e.target.value as Task['difficulty']})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>XP奖励</Label>
                  <Input
                    type="number"
                    value={newTask.xpReward}
                    onChange={(e) => setNewTask({...newTask, xpReward: Number(e.target.value)})}
                    min={0}
                  />
                </div>

                <div className="space-y-2">
                  <Label>时间限制(分钟)</Label>
                  <Input
                    type="number"
                    value={newTask.timeLimit}
                    onChange={(e) => setNewTask({...newTask, timeLimit: Number(e.target.value)})}
                    min={1}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateTask}>
                  创建任务
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
