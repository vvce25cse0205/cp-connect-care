import { Child, ActivityLog, TherapySession, Milestone, UserPoints } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  children: Child[];
  activeChildId: string | null;
  activityLogs: ActivityLog[];
  therapySessions: TherapySession[];
  milestones: Milestone[];
  userPoints: UserPoints;
  onboardingComplete: boolean;
  
  // Actions
  addChild: (child: Child) => void;
  setActiveChild: (id: string) => void;
  logActivity: (log: ActivityLog) => void;
  addTherapySession: (session: TherapySession) => void;
  completeTherapySession: (id: string) => void;
  addMilestone: (milestone: Milestone) => void;
  celebrateMilestone: (id: string) => void;
  addPoints: (points: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeOnboarding: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      children: [],
      activeChildId: null,
      activityLogs: [],
      therapySessions: [],
      milestones: [],
      userPoints: {
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
        activitiesCompleted: 0,
        milestonesAchieved: 0,
        therapySessionsAttended: 0,
        level: 1,
        achievements: []
      },
      onboardingComplete: false,

      addChild: (child) => set((state) => ({
        children: [...state.children, child],
        activeChildId: state.activeChildId || child.id
      })),

      setActiveChild: (id) => set({ activeChildId: id }),

      logActivity: (log) => set((state) => {
        const newLogs = [...state.activityLogs, log];
        const newPoints = state.userPoints.totalPoints + log.pointsEarned;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        return {
          activityLogs: newLogs,
          userPoints: {
            ...state.userPoints,
            totalPoints: newPoints,
            activitiesCompleted: state.userPoints.activitiesCompleted + 1,
            level: newLevel
          }
        };
      }),

      addTherapySession: (session) => set((state) => ({
        therapySessions: [...state.therapySessions, session]
      })),

      completeTherapySession: (id) => set((state) => ({
        therapySessions: state.therapySessions.map(s =>
          s.id === id ? { ...s, completed: true } : s
        ),
        userPoints: {
          ...state.userPoints,
          totalPoints: state.userPoints.totalPoints + 25,
          therapySessionsAttended: state.userPoints.therapySessionsAttended + 1
        }
      })),

      addMilestone: (milestone) => set((state) => ({
        milestones: [...state.milestones, milestone]
      })),

      celebrateMilestone: (id) => set((state) => ({
        milestones: state.milestones.map(m =>
          m.id === id ? { ...m, celebrated: true, achievedAt: new Date().toISOString() } : m
        ),
        userPoints: {
          ...state.userPoints,
          totalPoints: state.userPoints.totalPoints + 50,
          milestonesAchieved: state.userPoints.milestonesAchieved + 1
        }
      })),

      addPoints: (points) => set((state) => ({
        userPoints: {
          ...state.userPoints,
          totalPoints: state.userPoints.totalPoints + points
        }
      })),

      unlockAchievement: (achievementId) => set((state) => ({
        userPoints: {
          ...state.userPoints,
          achievements: [...state.userPoints.achievements, achievementId]
        }
      })),

      completeOnboarding: () => set({ onboardingComplete: true })
    }),
    {
      name: 'health-hustlers-storage'
    }
  )
);
