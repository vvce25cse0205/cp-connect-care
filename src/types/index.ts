export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  cpType: 'spastic' | 'dyskinetic' | 'ataxic' | 'mixed';
  mobilityLevel: 'independent' | 'assisted' | 'wheelchair' | 'limited';
  communicationLevel: 'verbal' | 'limited-verbal' | 'non-verbal' | 'aac-user';
  goals: string[];
  avatar?: string;
  notes?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: 'motor' | 'communication' | 'cognitive' | 'social' | 'self-care' | 'sensory' | 'aac' | 'gait-analysis' | 'smart-monitoring';
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  instructions: string[];
  benefits: string[];
  image?: string;
}

export interface ActivityLog {
  id: string;
  childId: string;
  activityId: string;
  completedAt: string;
  duration: number;
  engagementLevel: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  pointsEarned: number;
}

export interface TherapySession {
  id: string;
  childId: string;
  therapistName: string;
  therapyType: 'physical' | 'occupational' | 'speech' | 'behavioral' | 'aquatic';
  date: string;
  time: string;
  location: string;
  notes?: string;
  homeExercises?: string[];
  completed: boolean;
}

export interface Milestone {
  id: string;
  childId: string;
  title: string;
  description: string;
  category: 'motor' | 'communication' | 'cognitive' | 'social' | 'self-care';
  achievedAt?: string;
  targetDate?: string;
  celebrated: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  specializations: string[];
  rating: number;
  distance?: number;
  latitude: number;
  longitude: number;
}

export interface ExerciseVideo {
  id: string;
  title: string;
  description: string;
  category: 'stretching' | 'strengthening' | 'balance' | 'coordination' | 'sensory' | 'speech';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  videoUrl: string;
  benefits: string[];
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: 'cognitive' | 'motor' | 'sensory' | 'communication' | 'social';
  ageRange: string;
  accessibilityFeatures: string[];
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  category: 'activity' | 'milestone' | 'therapy' | 'streak' | 'special';
  unlockedAt?: string;
}

export interface UserPoints {
  totalPoints: number;
  currentStreak: number;
  longestStreak: number;
  activitiesCompleted: number;
  milestonesAchieved: number;
  therapySessionsAttended: number;
  level: number;
  achievements: string[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'therapy' | 'equipment' | 'education' | 'financial' | 'support' | 'nutrition' | 'mental-health';
  link?: string;
  content?: string;
  icon: string;
}
