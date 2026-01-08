import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { useSuccessStories, useAddSuccessStory } from '@/hooks/useSuccessStories';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, Plus, Trophy, Calendar, MessageCircle, Users, Star, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

const categoryLabels: Record<string, string> = {
  milestone: '🏆 Milestone',
  therapy: '💪 Therapy Win',
  daily_win: '⭐ Daily Win',
  equipment: '🦽 Equipment',
  other: '💝 Other',
};

const CommunityPage = () => {
  const { user } = useAuth();
  const { data: stories = [], isLoading } = useSuccessStories();
  const addStory = useAddSuccessStory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    story: '',
    category: 'daily_win',
    is_anonymous: false,
    display_name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStory.mutate(formData, {
      onSuccess: () => {
        setDialogOpen(false);
        setFormData({ title: '', story: '', category: 'daily_win', is_anonymous: false, display_name: '' });
      },
    });
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold">Community & Support</h1>
          <p className="text-muted-foreground mt-1">
            Connect, share, and celebrate together
          </p>
        </div>
      </div>

      <Tabs defaultValue="wins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="wins">
            <Trophy className="h-4 w-4 mr-2" />
            Wall of Wins
          </TabsTrigger>
          <TabsTrigger value="groups">
            <Users className="h-4 w-4 mr-2" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="qa">
            <MessageCircle className="h-4 w-4 mr-2" />
            Expert Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wins" className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">Celebrate small and large milestones with our community!</p>
            {user && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4 mr-2" />
                    Share a Win
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Your Win 🎉</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., First independent steps!"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="story">Your Story *</Label>
                      <Textarea
                        id="story"
                        value={formData.story}
                        onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                        placeholder="Tell us about this wonderful moment..."
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(categoryLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="display_name">Display Name</Label>
                      <Input
                        id="display_name"
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="How you'd like to be called"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.is_anonymous}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_anonymous: !!checked })}
                      />
                      <Label htmlFor="anonymous" className="text-sm">Post anonymously</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={addStory.isPending}>
                      {addStory.isPending ? 'Sharing...' : 'Share Your Win! 🎉'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 h-40 bg-muted/50" />
                </Card>
              ))}
            </div>
          ) : stories.length === 0 ? (
            <Card className="text-center p-12">
              <Sparkles className="h-12 w-12 mx-auto text-warning mb-4" />
              <CardTitle className="mb-2">Be the First to Share!</CardTitle>
              <CardDescription>Share your wins to inspire other families.</CardDescription>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <Card key={story.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{categoryLabels[story.category || 'other']}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(story.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {story.is_anonymous ? 'Anonymous' : story.display_name || 'A caring parent'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{story.story}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="ghost" size="sm" className="text-celebration">
                        <Heart className="h-4 w-4 mr-1" />
                        {story.likes_count || 0}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Parents of Spastic CP', members: 1240, icon: '💪' },
              { name: 'Delhi NCR CP Support', members: 856, icon: '📍' },
              { name: 'Feeding & Nutrition Tips', members: 2100, icon: '🍎' },
              { name: 'Therapy at Home Ideas', members: 1876, icon: '🏠' },
              { name: 'School & Education Rights', members: 945, icon: '📚' },
              { name: 'Equipment & Mobility', members: 1432, icon: '🦽' },
            ].map((group) => (
              <Card key={group.name} variant="interactive">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl">{group.icon}</span>
                  <CardTitle className="mt-4 text-lg">{group.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-1 mt-2">
                    <Users className="h-4 w-4" />
                    {group.members.toLocaleString()} members
                  </CardDescription>
                  <Button className="mt-4 w-full" variant="outline">
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-6">
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary text-primary-foreground">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">Upcoming Live Q&A Sessions</h3>
                  <p className="text-muted-foreground">Ask questions directly to specialists</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { expert: 'Dr. Priya Sharma', role: 'Pediatric Neurologist', date: 'Jan 15, 2026', time: '7:00 PM IST', topic: 'Managing Spasticity at Home' },
              { expert: 'Anita Krishnan', role: 'Occupational Therapist', date: 'Jan 22, 2026', time: '6:00 PM IST', topic: 'Adaptive Equipment Selection' },
              { expert: 'Dr. Rahul Mehta', role: 'Pediatric Orthopedist', date: 'Jan 29, 2026', time: '7:30 PM IST', topic: 'Surgery: When and Why' },
            ].map((session) => (
              <Card key={session.date} variant="interactive">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-full bg-accent/10">
                      <Star className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{session.topic}</h4>
                      <p className="text-sm text-muted-foreground">{session.expert} • {session.role}</p>
                      <p className="text-sm font-medium text-primary mt-2">{session.date} at {session.time}</p>
                      <Button size="sm" className="mt-3">Set Reminder</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityPage;
