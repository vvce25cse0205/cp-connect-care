import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Star, Flame, Activity, Target, Calendar, Award } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { achievements } from '@/data/sampleData';

const ScorecardPage = () => {
  const { userPoints } = useAppStore();
  const unlockedAchievements = achievements.filter(a => userPoints.totalPoints >= a.pointsRequired);

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
          <h2 className="font-display text-4xl font-bold">{userPoints.totalPoints}</h2>
          <p className="text-lg opacity-90">Total Points</p>
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{userPoints.level}</p>
              <p className="text-sm opacity-80">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userPoints.currentStreak}</p>
              <p className="text-sm opacity-80">Day Streak</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{userPoints.activitiesCompleted}</p>
              <p className="text-sm opacity-80">Activities</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Badges */}
      <section>
        <h2 className="font-display text-xl font-bold mb-4">Badges & Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const unlocked = userPoints.totalPoints >= achievement.pointsRequired;
            return (
              <Card key={achievement.id} className={unlocked ? '' : 'opacity-50'}>
                <CardContent className="pt-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl ${unlocked ? 'gradient-celebration' : 'bg-muted'}`}>
                    {achievement.icon}
                  </div>
                  <p className="font-semibold text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                  {!unlocked && (
                    <p className="text-xs text-primary mt-2">{achievement.pointsRequired} pts needed</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ScorecardPage;
