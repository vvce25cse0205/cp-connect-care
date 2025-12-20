import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Activity, Trophy, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const steps = [
  {
    title: 'Welcome to Health Hustlers! 🙏',
    description: 'Your trusted companion for supporting children with Cerebral Palsy. Made with love for Indian families.',
    icon: Heart,
    color: 'bg-primary'
  },
  {
    title: 'Track Activities & Exercises',
    description: 'Log daily activities, watch exercise videos, and follow personalized recommendations for your child\'s progress.',
    icon: Activity,
    color: 'bg-success'
  },
  {
    title: 'Earn Points & Badges',
    description: 'Stay motivated with our gamified system! Earn points for activities, milestones, and therapy sessions.',
    icon: Trophy,
    color: 'bg-warning'
  },
  {
    title: 'Find Hospitals Nearby',
    description: 'Locate CP-specialized hospitals across India with our location-based search feature.',
    icon: Calendar,
    color: 'bg-accent'
  }
];

export const OnboardingTour = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { onboardingComplete, completeOnboarding } = useAppStore();

  useEffect(() => {
    if (!onboardingComplete) {
      setOpen(true);
    }
  }, [onboardingComplete]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
      setOpen(false);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    setOpen(false);
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className={`w-20 h-20 rounded-full ${step.color} flex items-center justify-center animate-bounce-gentle`}>
              <Icon className="w-10 h-10 text-primary-foreground" />
            </div>
            <DialogTitle className="font-display text-2xl">{step.title}</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-4">
          <p className="text-muted-foreground">{step.description}</p>
          
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-6 bg-primary'
                    : index < currentStep
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleSkip} className="flex-1">
              Skip
            </Button>
            <Button onClick={handleNext} className="flex-1" variant="hero">
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
