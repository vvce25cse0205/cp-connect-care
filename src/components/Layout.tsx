import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Activity, 
  Calendar, 
  Target, 
  BookOpen, 
  Gamepad2, 
  TrendingUp, 
  MapPin, 
  Video, 
  Trophy,
  Heart,
  Menu,
  X,
  Pill,
  MessageCircle,
  Users,
  Stethoscope,
  Wrench,
  Moon,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPoints } from '@/hooks/useUserPoints';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/child-profile', icon: User, label: 'Child Profile' },
  { path: '/care-team', icon: Stethoscope, label: 'Care Team' },
  { path: '/activities', icon: Activity, label: 'Activities' },
  { path: '/therapy', icon: Calendar, label: 'Therapy' },
  { path: '/medicine', icon: Pill, label: 'Medicine' },
  { path: '/medical-records', icon: FileText, label: 'Medical Records' },
  { path: '/milestones', icon: Target, label: 'Milestones' },
  { path: '/wellness', icon: Moon, label: 'Wellness' },
  { path: '/equipment', icon: Wrench, label: 'Equipment' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/videos', icon: Video, label: 'Exercise Videos' },
  { path: '/games', icon: Gamepad2, label: 'Games' },
  { path: '/hospitals', icon: MapPin, label: 'Hospitals' },
  { path: '/resources', icon: BookOpen, label: 'Resources' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/self-care', icon: Sparkles, label: 'Self-Care' },
  { path: '/ai-chat', icon: MessageCircle, label: 'AI Assistant' },
  { path: '/scorecard', icon: Trophy, label: 'Scorecard' },
];

export const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const { data: pointsData } = useUserPoints();
  const userPoints = pointsData || { total_points: 0, streak_days: 0 };
  const level = Math.floor((userPoints.total_points || 0) / 100) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">
                Health Hustlers
              </h1>
              <p className="text-xs text-muted-foreground">CP Care Companion</p>
            </div>
          </Link>

          {/* Points Display */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
              <Trophy className="h-4 w-4 text-warning" />
              <span className="font-semibold text-sm">{userPoints.total_points || 0} pts</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10">
              <span className="text-sm font-medium">Level {level}</span>
            </div>
            {!user && (
              <Link to="/auth">
                <Button variant="hero" size="sm">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="flex-1 space-y-1 p-4 pb-8">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div 
              className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="absolute left-0 top-16 bottom-0 w-72 bg-sidebar border-r animate-slide-up overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
              <nav className="flex-1 space-y-1 p-4 pb-8">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};
