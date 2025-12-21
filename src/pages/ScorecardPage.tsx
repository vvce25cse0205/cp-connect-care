import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Flame, Activity, Target, Calendar, Award, TrendingUp } from 'lucide-react';
import { useUserPoints } from '@/hooks/useUserPoints';
import { useActivities } from '@/hooks/useActivities';
import { useTherapySessions } from '@/hooks/useTherapySessions';
import { useAuth } from '@/contexts/AuthContext';
import { achievements } from '@/data/sampleData';
import { Link } from 'react-router-dom';

const ScorecardPage = () => {
  const { user } = useAuth();
  const { data: userPointsData } = useUserPoints();
  const { data: activities = [] } = useActivities();
  const { data: sessions = [] } = useTherapySessions();

  const userPoints = userPointsData || {
    total_points: 0,
    activities_completed: 0,
    sessions_logged: 0,
    milestones_achieved: 0,
    streak_days: 0
  };

  const level = Math.floor((userPoints.total_points || 0) / 100) + 1;
  const pointsInLevel = (userPoints.total_points || 0) % 100;
  const unlockedAchievements = achievements.filter(a => (userPoints.total_points || 0) >= a.pointsRequired);

  // Calculate weekly stats
  const thisWeekActivities = activities.filter(a => {
    const actDate = new Date(a.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return actDate >= weekAgo;
  }).length;

  const completedSessions = sessions.filter(s => s.status === 'completed').length;

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Track Your Progress</h2>
            <p className="text-muted-foreground mb-4">Sign in to see your caregiving achievements</p>
            <Link to="/auth" className="text-primary underline">Sign in</Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Caregiver Scorecard</h1>
        <p className="text-muted-foreground mt-1">Your family's care journey achievements</p>
      </div>

      {/* Points Overview */}
      <Card className="overflow-hidden">
        <div className="gradient-primary p-8 text-primary-foreground text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="font-display text-5xl font-bold">{userPoints.total_points || 0}</h2>
          <p className="text-lg opacity-90">Total Points</p>
          
          {/* Level Progress */}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <Progress value={pointsInLevel} className="h-3 bg-primary-foreground/20" />
            <p className="text-xs mt-1 opacity-80">{100 - pointsInLevel} points to next level</p>
          </div>

          <div className="flex justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{level}</p>
              <p className="text-xs opacity-80">Level</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-2">
                <Flame className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{userPoints.streak_days || 0}</p>
              <p className="text-xs opacity-80">Day Streak</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-2">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{userPoints.activities_completed || 0}</p>
              <p className="text-xs opacity-80">Activities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold">{userPoints.sessions_logged || 0}</p>
              <p className="text-xs opacity-80">Sessions</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-success mb-2" />
            <p className="text-2xl font-bold">{thisWeekActivities}</p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="text-2xl font-bold">{userPoints.milestones_achieved || 0}</p>
            <p className="text-sm text-muted-foreground">Milestones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="w-8 h-8 mx-auto text-accent mb-2" />
            <p className="text-2xl font-bold">{completedSessions}</p>
            <p className="text-sm text-muted-foreground">Completed Sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 mx-auto text-celebration mb-2" />
            <p className="text-2xl font-bold">{unlockedAchievements.length}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Badges & Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const unlocked = (userPoints.total_points || 0) >= achievement.pointsRequired;
            const progress = Math.min(100, ((userPoints.total_points || 0) / achievement.pointsRequired) * 100);
            
            return (
              <Card key={achievement.id} className={unlocked ? '' : 'opacity-60'}>
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl ${unlocked ? 'gradient-celebration' : 'bg-muted'}`}>
                    {achievement.icon}
                  </div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  
                  {!unlocked && (
                    <div className="mt-3">
                      <Progress value={progress} className="h-1.5" />
                      <p className="text-xs text-primary mt-1">
                        {achievement.pointsRequired - (userPoints.total_points || 0)} pts to unlock
                      </p>
                    </div>
                  )}
                  
                  {unlocked && (
                    <p className="text-xs text-success mt-2 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3" /> Unlocked!
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Encouragement */}
      <Card variant="warm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-foreground/10 flex items-center justify-center flex-shrink-0">
              💪
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-secondary-foreground mb-1">
                Keep Up the Great Work!
              </h3>
              <p className="text-secondary-foreground/80">
                Every activity you log, every session you attend, and every milestone you celebrate 
                brings your child closer to their goals. You're doing an amazing job! 🌟
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScorecardPage;
