import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Activity, Target, Calendar, Award, BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const ProgressPage = () => {
  const { userPoints, activityLogs, therapySessions, milestones } = useAppStore();

  // Calculate activity frequency by category
  const activityByWeek = [
    { name: 'Week 1', activities: Math.floor(Math.random() * 10) + activityLogs.length },
    { name: 'Week 2', activities: Math.floor(Math.random() * 12) + 2 },
    { name: 'Week 3', activities: Math.floor(Math.random() * 8) + 3 },
    { name: 'Week 4', activities: activityLogs.length + 5 },
  ];

  // Engagement distribution
  const engagementData = [
    { name: 'High (4-5)', value: 40, color: 'hsl(var(--success))' },
    { name: 'Medium (3)', value: 35, color: 'hsl(var(--warning))' },
    { name: 'Low (1-2)', value: 25, color: 'hsl(var(--accent))' },
  ];

  // Progress trend
  const progressTrend = [
    { month: 'Jan', points: 50 },
    { month: 'Feb', points: 120 },
    { month: 'Mar', points: 200 },
    { month: 'Apr', points: 350 },
    { month: 'May', points: userPoints.totalPoints + 400 },
  ];

  // Milestone categories
  const milestoneCats = [
    { category: 'Motor', achieved: milestones.filter(m => m.category === 'motor' && m.celebrated).length, total: 5 },
    { category: 'Communication', achieved: milestones.filter(m => m.category === 'communication' && m.celebrated).length, total: 5 },
    { category: 'Cognitive', achieved: milestones.filter(m => m.category === 'cognitive' && m.celebrated).length, total: 5 },
    { category: 'Social', achieved: milestones.filter(m => m.category === 'social' && m.celebrated).length, total: 5 },
    { category: 'Self-Care', achieved: milestones.filter(m => m.category === 'self-care' && m.celebrated).length, total: 5 },
  ];

  const stats = [
    { 
      label: 'Total Points', 
      value: userPoints.totalPoints, 
      icon: Award, 
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      description: 'Keep earning!'
    },
    { 
      label: 'Activities Completed', 
      value: userPoints.activitiesCompleted, 
      icon: Activity, 
      color: 'text-success',
      bgColor: 'bg-success/10',
      description: 'Great consistency!'
    },
    { 
      label: 'Milestones Achieved', 
      value: userPoints.milestonesAchieved, 
      icon: Target, 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      description: 'Celebrate wins!'
    },
    { 
      label: 'Therapy Sessions', 
      value: userPoints.therapySessionsAttended, 
      icon: Calendar, 
      color: 'text-celebration',
      bgColor: 'bg-celebration/10',
      description: 'Stay on track!'
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Progress Tracking</h1>
        <p className="text-muted-foreground mt-1">Visualize your child's journey and celebrate growth</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} variant="stats">
            <CardContent className="pt-6">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Activity Frequency */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Number of activities completed each week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityByWeek}>
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="activities" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Engagement Levels
            </CardTitle>
            <CardDescription>How engaged is your child during activities?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Points Growth Over Time
          </CardTitle>
          <CardDescription>Your family's progress journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressTrend}>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="points" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Milestones by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-celebration" />
            Milestones by Category
          </CardTitle>
          <CardDescription>Track progress across different developmental areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-5 gap-4">
            {milestoneCats.map((cat) => (
              <div key={cat.category} className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="hsl(var(--muted))"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="35"
                      stroke="hsl(var(--primary))"
                      strokeWidth="6"
                      fill="none"
                      strokeDasharray={`${(cat.achieved / cat.total) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{cat.achieved}/{cat.total}</span>
                  </div>
                </div>
                <p className="text-sm font-medium">{cat.category}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPage;
