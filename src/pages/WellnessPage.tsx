import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSleepLogs, useAddSleepLog } from '@/hooks/useSleepLogs';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { Moon, Sun, Plus, Utensils, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const adaptivePlayIdeas = [
  { title: 'Sensory Bin Exploration', mobility: 'all', description: 'Fill a bin with rice, beans, or water beads for tactile play', icon: '🫧' },
  { title: 'Music Shaker Making', mobility: 'all', description: 'Fill containers with different materials to make shakers', icon: '🎵' },
  { title: 'Bubble Wrap Stomping', mobility: 'assisted', description: 'Secure bubble wrap on floor for satisfying pops with feet or wheels', icon: '💥' },
  { title: 'Painting with Adaptive Tools', mobility: 'all', description: 'Use chunky brushes, sponges, or even feet for art', icon: '🎨' },
  { title: 'Ball Pool Time', mobility: 'all', description: 'Create a mini ball pit in a tub or pool', icon: '⚽' },
  { title: 'Glow-in-Dark Play', mobility: 'all', description: 'Use glow sticks and toys in a dark room for visual stimulation', icon: '✨' },
];

const nutritionTips = [
  { title: 'Thickened Liquids', description: 'For dysphagia, add thickeners to make swallowing easier and safer', icon: '🥤' },
  { title: 'High-Calorie Additions', description: 'Add ghee, cream, or nut butters to boost calories without volume', icon: '🧈' },
  { title: 'Smooth Purees', description: 'Blend foods to smooth consistency while maintaining nutrition', icon: '🥣' },
  { title: 'Positioning During Meals', description: 'Keep upright at 90° with head slightly forward to prevent aspiration', icon: '🪑' },
  { title: 'Small Frequent Meals', description: 'Offer 5-6 smaller meals to reduce fatigue during feeding', icon: '🍽️' },
  { title: 'Iron-Rich Foods', description: 'Include spinach, lentils, and fortified cereals to prevent anemia', icon: '🥬' },
];

const WellnessPage = () => {
  const { user } = useAuth();
  const { activeChildId } = useAppStore();
  const { data: sleepLogs = [], isLoading } = useSleepLogs(activeChildId || undefined);
  const addSleepLog = useAddSleepLog();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    sleep_date: format(new Date(), 'yyyy-MM-dd'),
    bedtime: '21:00',
    wake_time: '07:00',
    quality: 3,
    night_wakings: 0,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bedHour = parseInt(formData.bedtime.split(':')[0]);
    const wakeHour = parseInt(formData.wake_time.split(':')[0]);
    const totalHours = wakeHour >= bedHour ? wakeHour - bedHour : (24 - bedHour) + wakeHour;
    
    addSleepLog.mutate({
      ...formData,
      child_id: activeChildId || undefined,
      total_hours: totalHours,
      quality: formData.quality,
    }, {
      onSuccess: () => {
        setDialogOpen(false);
      },
    });
  };

  const sleepChartData = sleepLogs.slice(0, 14).reverse().map(log => ({
    date: format(new Date(log.sleep_date), 'MMM d'),
    hours: log.total_hours || 0,
    quality: log.quality || 0,
  }));

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Child Wellness</h1>
        <p className="text-muted-foreground mt-1">
          Holistic care: sleep, nutrition, and play
        </p>
      </div>

      <Tabs defaultValue="sleep" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="sleep">
            <Moon className="h-4 w-4 mr-2" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="nutrition">
            <Utensils className="h-4 w-4 mr-2" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="play">
            <Sparkles className="h-4 w-4 mr-2" />
            Adaptive Play
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sleep" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Track sleep patterns to help doctors adjust routines</p>
            {user && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Sleep
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Sleep</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.sleep_date}
                        onChange={(e) => setFormData({ ...formData, sleep_date: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bedtime">Bedtime</Label>
                        <Input
                          id="bedtime"
                          type="time"
                          value={formData.bedtime}
                          onChange={(e) => setFormData({ ...formData, bedtime: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="wake">Wake Time</Label>
                        <Input
                          id="wake"
                          type="time"
                          value={formData.wake_time}
                          onChange={(e) => setFormData({ ...formData, wake_time: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Sleep Quality: {formData.quality}/5</Label>
                      <Slider
                        value={[formData.quality]}
                        onValueChange={([v]) => setFormData({ ...formData, quality: v })}
                        min={1}
                        max={5}
                        step={1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wakings">Night Wakings</Label>
                      <Input
                        id="wakings"
                        type="number"
                        min={0}
                        value={formData.night_wakings}
                        onChange={(e) => setFormData({ ...formData, night_wakings: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any observations..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={addSleepLog.isPending}>
                      {addSleepLog.isPending ? 'Saving...' : 'Save Sleep Log'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {sleepLogs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sleep Trends (Last 14 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sleepChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} name="Hours" />
                      <Line type="monotone" dataKey="quality" stroke="hsl(var(--success))" strokeWidth={2} name="Quality" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sleepLogs.slice(0, 6).map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{format(new Date(log.sleep_date), 'MMM d, yyyy')}</span>
                    <span className="text-lg font-bold text-primary">{log.total_hours}h</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Moon className="h-4 w-4" />
                      {log.bedtime?.slice(0, 5)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sun className="h-4 w-4" />
                      {log.wake_time?.slice(0, 5)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Quality:</span>
                    {'⭐'.repeat(log.quality || 0)}
                  </div>
                  {(log.night_wakings || 0) > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {log.night_wakings} night waking(s)
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-lg mb-2">Nutrition Tips for CP</h3>
              <p className="text-muted-foreground">Children with CP often have unique feeding challenges. Here are evidence-based tips.</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nutritionTips.map((tip) => (
              <Card key={tip.title} variant="interactive">
                <CardContent className="p-6">
                  <span className="text-3xl">{tip.icon}</span>
                  <CardTitle className="mt-4 text-lg">{tip.title}</CardTitle>
                  <CardDescription className="mt-2">{tip.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="play" className="space-y-6">
          <Card className="border-2 border-celebration/20 bg-celebration/5">
            <CardContent className="p-6">
              <h3 className="font-display font-bold text-lg mb-2">🎮 Weekly Adaptive Play Ideas</h3>
              <p className="text-muted-foreground">Fun activities modified for different mobility levels</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adaptivePlayIdeas.map((idea) => (
              <Card key={idea.title} variant="interactive">
                <CardContent className="p-6">
                  <span className="text-3xl">{idea.icon}</span>
                  <CardTitle className="mt-4 text-lg">{idea.title}</CardTitle>
                  <CardDescription className="mt-2">{idea.description}</CardDescription>
                  <span className="inline-block mt-3 px-2 py-1 text-xs rounded-full bg-muted">
                    {idea.mobility === 'all' ? 'All mobility levels' : 'Assisted mobility'}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WellnessPage;
