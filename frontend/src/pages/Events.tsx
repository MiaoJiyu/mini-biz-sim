import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Zap,
  Bell,
  CheckCircle,
  RefreshCw,
  Flame,
  DollarSign,
  Briefcase,
  Heart,
  Globe
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  category: string;
  effects: any;
}

interface UserEvent {
  id: number;
  userId: number;
  title: string;
  description: string;
  type: string;
  severity: string;
  effects: any;
  triggeredAt: string;
  resolvedAt?: string;
  resolved: boolean;
  userChoice?: string;
  outcome?: string;
}

interface EventChoice {
  id: number;
  eventId: number;
  choiceText: string;
  description: string;
  consequences: any;
  requiredLevel: number;
  financialImpact: number;
}

export default function EventsPage() {
  const [activeEvents, setActiveEvents] = useState<UserEvent[]>([]);
  const [historyEvents, setHistoryEvents] = useState<UserEvent[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
  const [eventChoices, setEventChoices] = useState<EventChoice[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    fetchData();
    setupWebSocket();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, historyRes, countRes] = await Promise.all([
        fetch(`http://localhost:8085/api/user-events/user/${currentUser.id}/pending`),
        fetch(`http://localhost:8085/api/user-events/user/${currentUser.id}`),
        fetch(`http://localhost:8085/api/user-events/user/${currentUser.id}/count`)
      ]);

      const pendingData = await pendingRes.json();
      const historyData = await historyRes.json();
      const count = await countRes.json();

      setActiveEvents(pendingData);
      setHistoryEvents(historyData);
      setPendingCount(count);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket('ws://localhost:8085/ws/events');

    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === 'EVENT') {
        handleNewEvent(data);
      }
    };

    return () => ws.close();
  };

  const handleNewEvent = async (notification: any) => {
    await fetch(`http://localhost:8085/api/events/${notification.eventId}/trigger?userId=${currentUser.id}`, {
      method: 'POST'
    });
    fetchData();
  };

  const handleViewChoices = async (event: UserEvent) => {
    setSelectedEvent(event);
    try {
      const res = await fetch(`http://localhost:8085/api/events/${event.eventId}/choices`);
      const choices = await res.json();
      setEventChoices(choices);
    } catch (error) {
      console.error('Failed to fetch choices:', error);
    }
  };

  const handleMakeChoice = async (choiceId: number, choiceText: string) => {
    if (!selectedEvent) return;

    try {
      await fetch(`http://localhost:8085/api/user-events/${selectedEvent.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: choiceText })
      });
      setSelectedEvent(null);
      setEventChoices([]);
      fetchData();
    } catch (error) {
      console.error('Failed to resolve event:', error);
    }
  };

  const handleTriggerRandom = async () => {
    try {
      await fetch(`http://localhost:8085/api/events/random/${currentUser.id}`, {
        method: 'POST'
      });
      fetchData();
    } catch (error) {
      console.error('Failed to trigger random event:', error);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Flame className="w-5 h-5 text-red-600" />;
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'MEDIUM':
        return <Zap className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.includes('MARKET') || type.includes('FINANCIAL')) {
      return <DollarSign className="w-5 h-5" />;
    } else if (type.includes('CAREER')) {
      return <Briefcase className="w-5 h-5" />;
    } else if (type.includes('HEALTH')) {
      return <Heart className="w-5 h-5" />;
    } else {
      return <Globe className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    if (type === 'POSITIVE') return 'bg-green-100 text-green-800';
    if (type === 'NEGATIVE') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">事件中心</h1>
          <p className="text-muted-foreground mt-1">管理并响应各种随机事件</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {pendingCount > 0 ? (
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <span className="text-sm font-medium">
              {pendingCount} 个待处理事件
            </span>
          </div>
          <Button onClick={handleTriggerRandom} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            触发随机事件
          </Button>
        </div>
      </div>

      {pendingCount > 0 && (
        <Alert className="bg-orange-50 border-orange-200">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            您有 {pendingCount} 个待处理事件需要立即响应!
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            待处理事件 {pendingCount > 0 && `(${pendingCount})`}
          </TabsTrigger>
          <TabsTrigger value="history">历史记录</TabsTrigger>
          <TabsTrigger value="all">所有事件</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : activeEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">没有待处理事件</h3>
                <p className="text-muted-foreground text-center">
                  太棒了!您当前没有需要处理的事件。系统会自动生成新事件,或者您可以点击"触发随机事件"按钮。
                </p>
              </CardContent>
            </Card>
          ) : (
            activeEvents.map((event) => (
              <Card key={event.id} className="border-2">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(event.severity)}
                      <div>
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <Badge className={getTypeColor(event.type)}>
                            {getTypeIcon(event.type)}
                            <span className="ml-1">{event.type}</span>
                          </Badge>
                          <Badge variant="outline">
                            {new Date(event.triggeredAt).toLocaleString('zh-CN')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {selectedEvent?.id !== event.id && (
                      <Button onClick={() => handleViewChoices(event)}>
                        查看选项
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{event.description}</p>

                  {selectedEvent?.id === event.id && eventChoices.length > 0 && (
                    <div className="space-y-3 mt-4 pt-4 border-t">
                      <h4 className="font-semibold">请选择您的应对方案:</h4>
                      {eventChoices.map((choice) => (
                        <div key={choice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="font-medium">{choice.choiceText}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {choice.description}
                              </div>
                              <div className="flex gap-2 mt-2">
                                {choice.financialImpact !== 0 && (
                                  <Badge variant={choice.financialImpact > 0 ? "default" : "destructive"}>
                                    {choice.financialImpact > 0 ? '+' : ''}
                                    ¥{choice.financialImpact.toFixed(2)}
                                  </Badge>
                                )}
                                {choice.requiredLevel > 0 && (
                                  <Badge variant="outline">
                                    需要等级: {choice.requiredLevel}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              onClick={() => handleMakeChoice(choice.id, choice.choiceText)}
                              className="ml-4"
                            >
                              选择此方案
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {historyEvents.map((event) => (
            <Card key={event.id} className={event.resolved ? 'opacity-70' : ''}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getSeverityIcon(event.severity)}
                  <div className="flex-1">
                    <CardTitle>{event.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                      <Badge className={getTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                      {event.resolved && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已解决
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.triggeredAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-2">{event.description}</p>
                {event.userChoice && (
                  <div className="mt-3 pt-3 border-t text-sm">
                    <div><span className="font-medium">您的选择:</span> {event.userChoice}</div>
                    {event.resolvedAt && (
                      <div><span className="font-medium">处理时间:</span> {new Date(event.resolvedAt).toLocaleString('zh-CN')}</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>所有可用事件</CardTitle>
              <CardDescription>系统中定义的所有事件模板</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                这里显示所有可触发的事件类型。每个事件都有一定的概率被触发。
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
