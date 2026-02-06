import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
}

interface TourGuideProps {
  steps: TourStep[];
  onComplete: () => void;
  onClose: () => void;
  show: boolean;
}

export function TourGuide({ steps, onComplete, onClose, show }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!show) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('tour-highlight');

      return () => {
        element.classList.remove('tour-highlight');
      };
    }
  }, [currentStep, steps, show]);

  if (!show) return null;

  const step = steps[currentStep];

  const handleNext = () => {
    if (step.action) {
      step.action();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="max-w-md w-full mx-4 animate-in slide-in-from-bottom">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-600">
                步骤 {currentStep + 1} / {steps.length}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-gray-700 mb-6">{step.description}</p>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full ${
                    index === currentStep
                      ? 'bg-blue-500 w-6'
                      : index < currentStep
                      ? 'bg-green-500 w-2'
                      : 'bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              <Button onClick={handleNext}>
                {currentStep === steps.length - 1 ? '完成' : '下一步'}
                {currentStep < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface TutorialProgressProps {
  completed: number;
  total: number;
}

export function TutorialProgress({ completed, total }: TutorialProgressProps) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">新手引导进度</h4>
            <p className="text-sm opacity-90">已完成 {completed}/{total} 个任务</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-bold">{percentage}%</span>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default TourGuide;
