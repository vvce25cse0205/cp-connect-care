import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Calendar, 
  Target, 
  TrendingUp, 
  Star, 
  ArrowRight,
  Clock,
  Trophy,
  Heart,
  Sparkles,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { sampleActivities } from '@/data/sampleData';
import { OnboardingTour } from '@/components/OnboardingTour';

const HomePage = () => {
  const { userPoints, children, activityLogs, therapySessions, milestones } = useAppStore();

  const stats = [
    { 
      label: 'Activities Done', 
      value: activityLogs.length, 
      icon: Activity, 
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    { 
      label: 'Therapy Sessions', 
      value: therapySessions.filter(s => s.completed).length, 
      icon: Calendar, 
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: 'Milestones', 
      value: milestones.filter(m => m.celebrated).length, 
      icon: Target, 
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    { 
      label: 'Current Streak', 
      value: `${userPoints.currentStreak} days`, 
      icon: TrendingUp, 
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
  ];

  const quickActions = [
    { label: 'Log Activity', path: '/activities', icon: Activity, color: 'bg-success' },
    { label: 'Watch Videos', path: '/videos', icon: Play, color: 'bg-primary' },
    { label: 'Find Hospitals', path: '/hospitals', icon: Heart, color: 'bg-accent' },
    { label: 'Play Games', path: '/games', icon: Sparkles, color: 'bg-warning' },
  ];

  // Get recommended activities (first 3 for demo)
  const recommendedActivities = sampleActivities.slice(0, 3);

  return (
    <>
      <OnboardingTour />
      <div className="container py-8 space-y-8">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-primary-foreground">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-6 h-6" />
              <span className="text-sm font-medium opacity-90">Namaste! 🙏</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Welcome to Health Hustlers
            </h1>
            <p className="text-lg opacity-90 max-w-xl">
              Your child's progress journey starts here. Every small step is a big victory!
            </p>
            
            {/* Level Progress */}
            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">{userPoints.totalPoints} Points</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20">
                <Star className="w-5 h-5" />
                <span className="font-bold">Level {userPoints.level}</span>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary-foreground/10" />
          <div className="absolute -right-10 -bottom-20 w-48 h-48 rounded-full bg-primary-foreground/5" />
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} variant="stats" className={stat.bgColor}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <Card variant="interactive" className="h-full">
                  <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                    <div className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center`}>
                      <action.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <span className="font-semibold">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Recommended Activities */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Recommended For You</h2>
            <Link to="/activities">
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedActivities.map((activity) => (
              <Card key={activity.id} variant="interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                      ${activity.category === 'motor' ? 'bg-success/20 text-success' : ''}
                      ${activity.category === 'communication' ? 'bg-primary/20 text-primary' : ''}
                      ${activity.category === 'sensory' ? 'bg-celebration/20 text-celebration' : ''}
                      ${activity.category === 'cognitive' ? 'bg-warning/20 text-warning' : ''}
                      ${activity.category === 'social' ? 'bg-accent/20 text-accent' : ''}
                    `}>
                      {activity.category}
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.duration} min
                    </span>
                  </div>
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {activity.benefits.slice(0, 2).map((benefit, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Daily Tip */}
        <section>
          <Card variant="warm">
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-secondary-foreground mb-1">
                    Daily Tip for Caregivers
                  </h3>
                  <p className="text-secondary-foreground/80">
                    Take 10 minutes for yourself today. Your well-being matters too! 
                    A relaxed caregiver provides better care. Try deep breathing or a short walk. 🧘
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
};

export default HomePage;
