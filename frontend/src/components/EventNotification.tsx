import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, X } from 'lucide-react';

interface EventNotificationProps {
  onOpenEvents: () => void;
}

export function EventNotification({ onOpenEvents }: EventNotificationProps) {
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const checkEvents = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id) {
          const res = await fetch(`http://localhost:8085/api/user-events/user/${currentUser.id}/count`);
          const count = await res.json();

          if (count > 0 && count !== pendingCount) {
            setPendingCount(count);
            setShowNotification(true);
          }
        }
      } catch (error) {
        console.error('Failed to check events:', error);
      }
    };

    checkEvents();
    const interval = setInterval(checkEvents, 30000);

    return () => clearInterval(interval);
  }, [pendingCount]);

  if (!showNotification || pendingCount === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-right">
      <Alert className="bg-orange-50 border-orange-200 shadow-lg">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <div className="flex items-start justify-between w-full">
          <div className="flex-1">
            <AlertDescription className="text-orange-800 font-medium">
              新事件待处理!
            </AlertDescription>
            <p className="text-sm text-orange-700 mt-1">
              您有 {pendingCount} 个待处理事件需要关注
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setShowNotification(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              onOpenEvents();
              setShowNotification(false);
            }}
          >
            查看事件
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNotification(false)}
          >
            稍后
          </Button>
        </div>
      </Alert>
    </div>
  );
}

export function EventBadge({ onClick }: { onClick: () => void }) {
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const checkEvents = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id) {
          const res = await fetch(`http://localhost:8085/api/user-events/user/${currentUser.id}/count`);
          const count = await res.json();
          setPendingCount(count);
        }
      } catch (error) {
        console.error('Failed to check events:', error);
      }
    };

    checkEvents();
    const interval = setInterval(checkEvents, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-md hover:bg-gray-100 transition-colors"
    >
      <Bell className="w-5 h-5 text-gray-600" />
      {pendingCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {pendingCount > 9 ? '9+' : pendingCount}
        </span>
      )}
    </button>
  );
}
