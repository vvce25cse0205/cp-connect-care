import { Activity, Hospital, ExerciseVideo, Game, Resource, Achievement } from '@/types';

export const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'गेंद पकड़ना (Ball Catching)',
    description: 'Improve hand-eye coordination and grip strength with soft ball exercises',
    category: 'motor',
    duration: 15,
    difficulty: 'easy',
    instructions: [
      'Sit facing your child at arm\'s length',
      'Use a soft, lightweight ball',
      'Gently toss the ball toward their hands',
      'Celebrate each attempt, successful or not',
      'Gradually increase distance as skill improves'
    ],
    benefits: ['Improves hand-eye coordination', 'Strengthens grip', 'Builds confidence']
  },
  {
    id: '2',
    title: 'Picture Storytelling',
    description: 'Enhance communication through visual storytelling activities',
    category: 'communication',
    duration: 20,
    difficulty: 'easy',
    instructions: [
      'Choose colorful picture cards or a story book',
      'Point to pictures and name objects',
      'Ask simple questions about the images',
      'Encourage any form of response',
      'Create a simple story together'
    ],
    benefits: ['Improves vocabulary', 'Encourages expression', 'Builds connection']
  },
  {
    id: '3',
    title: 'Texture Exploration',
    description: 'Sensory play with different textures to improve tactile awareness',
    category: 'sensory',
    duration: 15,
    difficulty: 'easy',
    instructions: [
      'Gather items with different textures (soft cloth, rough sponge, smooth stone)',
      'Let your child touch each item',
      'Describe the texture: "This is soft", "This is bumpy"',
      'Watch for their reactions and preferences',
      'Create a texture box for regular play'
    ],
    benefits: ['Develops sensory processing', 'Reduces tactile sensitivity', 'Encourages exploration']
  },
  {
    id: '4',
    title: 'Assisted Standing',
    description: 'Weight-bearing exercise to strengthen legs and improve balance',
    category: 'motor',
    duration: 10,
    difficulty: 'medium',
    instructions: [
      'Ensure you have a stable support surface',
      'Hold your child securely at the hips',
      'Help them bear weight on their legs',
      'Start with 30 seconds, gradually increase',
      'Make it fun with songs or rhymes'
    ],
    benefits: ['Strengthens leg muscles', 'Improves bone density', 'Prepares for walking']
  },
  {
    id: '5',
    title: 'Matching Colors',
    description: 'Cognitive exercise to learn colors and improve concentration',
    category: 'cognitive',
    duration: 15,
    difficulty: 'easy',
    instructions: [
      'Use colorful blocks or cards',
      'Start with 2-3 basic colors',
      'Ask child to match same colors together',
      'Name colors as you play',
      'Celebrate correct matches enthusiastically'
    ],
    benefits: ['Teaches color recognition', 'Improves focus', 'Develops sorting skills']
  },
  {
    id: '6',
    title: 'Social Greetings Practice',
    description: 'Practice saying hello, goodbye, and basic social interactions',
    category: 'social',
    duration: 10,
    difficulty: 'easy',
    instructions: [
      'Practice waving hello and goodbye',
      'Use dolls or puppets to role-play',
      'Include family members in greetings practice',
      'Reward attempts with smiles and praise',
      'Make it a daily routine'
    ],
    benefits: ['Builds social skills', 'Increases confidence', 'Improves communication']
  }
];

export const indianHospitals: Hospital[] = [
  {
    id: '1',
    name: 'AIIMS Delhi - Pediatric Neurology',
    address: 'Ansari Nagar, New Delhi',
    city: 'New Delhi',
    state: 'Delhi',
    phone: '+91-11-26588500',
    specializations: ['Pediatric Neurology', 'Cerebral Palsy', 'Rehabilitation'],
    rating: 4.8,
    latitude: 28.5672,
    longitude: 77.2100
  },
  {
    id: '2',
    name: 'NIMHANS - Child Development Centre',
    address: 'Hosur Road, Bangalore',
    city: 'Bangalore',
    state: 'Karnataka',
    phone: '+91-80-26995000',
    specializations: ['Child Development', 'Cerebral Palsy', 'Occupational Therapy'],
    rating: 4.7,
    latitude: 12.9387,
    longitude: 77.5969
  },
  {
    id: '3',
    name: 'CMC Vellore - Pediatric Rehabilitation',
    address: 'Ida Scudder Road, Vellore',
    city: 'Vellore',
    state: 'Tamil Nadu',
    phone: '+91-416-2281000',
    specializations: ['Pediatric Rehab', 'Physical Therapy', 'Speech Therapy'],
    rating: 4.9,
    latitude: 12.9165,
    longitude: 79.1325
  },
  {
    id: '4',
    name: 'SRMC Chennai - Child Development Unit',
    address: 'Porur, Chennai',
    city: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-44-24768027',
    specializations: ['Developmental Pediatrics', 'Cerebral Palsy Care'],
    rating: 4.6,
    latitude: 13.0382,
    longitude: 80.1667
  },
  {
    id: '5',
    name: 'PGIMER Chandigarh - Pediatric Neurology',
    address: 'Sector 12, Chandigarh',
    city: 'Chandigarh',
    state: 'Chandigarh',
    phone: '+91-172-2756565',
    specializations: ['Neurology', 'Rehabilitation Medicine', 'Therapy Services'],
    rating: 4.7,
    latitude: 30.7640,
    longitude: 76.7771
  },
  {
    id: '6',
    name: 'Kokilaben Hospital - Child Development',
    address: 'Andheri West, Mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    phone: '+91-22-30999999',
    specializations: ['Pediatric Care', 'Rehabilitation', 'Therapy'],
    rating: 4.5,
    latitude: 19.1307,
    longitude: 72.8253
  }
];

export const exerciseVideos: ExerciseVideo[] = [
  {
    id: '1',
    title: 'Gentle Stretching for Spastic CP',
    description: 'Safe stretching exercises to reduce muscle tightness',
    category: 'stretching',
    duration: 12,
    difficulty: 'beginner',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Reduces muscle stiffness', 'Improves flexibility', 'Prevents contractures']
  },
  {
    id: '2',
    title: 'Core Strengthening Exercises',
    description: 'Build trunk stability for better sitting and movement',
    category: 'strengthening',
    duration: 15,
    difficulty: 'intermediate',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Improves posture', 'Better balance', 'Supports movement']
  },
  {
    id: '3',
    title: 'Balance Ball Activities',
    description: 'Fun exercises using therapy balls for balance improvement',
    category: 'balance',
    duration: 10,
    difficulty: 'beginner',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Develops balance', 'Strengthens core', 'Improves coordination']
  },
  {
    id: '4',
    title: 'Hand-Eye Coordination Games',
    description: 'Playful activities to improve coordination and motor planning',
    category: 'coordination',
    duration: 15,
    difficulty: 'beginner',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Better hand control', 'Improved focus', 'Fine motor skills']
  },
  {
    id: '5',
    title: 'Sensory Integration Activities',
    description: 'Calming sensory exercises for regulation',
    category: 'sensory',
    duration: 20,
    difficulty: 'beginner',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Reduces sensory issues', 'Promotes calm', 'Improves focus']
  },
  {
    id: '6',
    title: 'Speech and Oral Motor Exercises',
    description: 'Exercises to strengthen mouth muscles for speech',
    category: 'speech',
    duration: 10,
    difficulty: 'beginner',
    thumbnail: '/placeholder.svg',
    videoUrl: '#',
    benefits: ['Clearer speech', 'Better swallowing', 'Oral strength']
  }
];

export const games: Game[] = [
  {
    id: '1',
    title: 'Color Match Magic',
    description: 'Match colorful objects to learn colors and patterns',
    category: 'cognitive',
    ageRange: '2-8 years',
    accessibilityFeatures: ['Large touch targets', 'Audio feedback', 'Simple gestures'],
    icon: '🎨'
  },
  {
    id: '2',
    title: 'Memory Garden',
    description: 'Find matching pairs of flowers and animals',
    category: 'cognitive',
    ageRange: '3-10 years',
    accessibilityFeatures: ['Adjustable difficulty', 'Voice prompts', 'High contrast'],
    icon: '🌸'
  },
  {
    id: '3',
    title: 'Puzzle Pals',
    description: 'Complete fun puzzles with friendly characters',
    category: 'motor',
    ageRange: '2-8 years',
    accessibilityFeatures: ['Snap assistance', 'Large pieces', 'Celebration sounds'],
    icon: '🧩'
  },
  {
    id: '4',
    title: 'Music Maker',
    description: 'Create music by touching colorful instruments',
    category: 'sensory',
    ageRange: '1-10 years',
    accessibilityFeatures: ['Eye-gaze support', 'Switch access', 'Visual feedback'],
    icon: '🎵'
  },
  {
    id: '5',
    title: 'Count with Animals',
    description: 'Learn numbers with cute animal friends',
    category: 'cognitive',
    ageRange: '2-7 years',
    accessibilityFeatures: ['Large numbers', 'Audio counting', 'Rewards'],
    icon: '🐾'
  },
  {
    id: '6',
    title: 'Bubble Pop Fun',
    description: 'Pop bubbles to improve motor skills and reaction time',
    category: 'motor',
    ageRange: '1-8 years',
    accessibilityFeatures: ['Adjustable speed', 'Large bubbles', 'Haptic feedback'],
    icon: '🫧'
  }
];

export const resources: Resource[] = [
  {
    id: '1',
    title: 'Daily Therapy Tips for Parents',
    description: 'Simple exercises you can do at home with your child',
    category: 'therapy',
    icon: '💪'
  },
  {
    id: '2',
    title: 'Assistive Equipment Guide',
    description: 'Understanding wheelchairs, walkers, and other mobility aids',
    category: 'equipment',
    icon: '🦽'
  },
  {
    id: '3',
    title: 'Education Rights in India',
    description: 'Know your child\'s rights under RPWD Act 2016',
    category: 'education',
    icon: '📚'
  },
  {
    id: '4',
    title: 'Government Schemes & Benefits',
    description: 'Financial assistance available for families in India',
    category: 'financial',
    icon: '💰'
  },
  {
    id: '5',
    title: 'Parent Support Groups',
    description: 'Connect with other CP families across India',
    category: 'support',
    icon: '🤝'
  },
  {
    id: '6',
    title: 'Nutrition for CP Children',
    description: 'Feeding tips and dietary recommendations',
    category: 'nutrition',
    icon: '🍎'
  },
  {
    id: '7',
    title: 'Caregiver Mental Health',
    description: 'Taking care of yourself while caring for your child',
    category: 'mental-health',
    icon: '🧘'
  },
  {
    id: '8',
    title: 'Communication Aids (AAC)',
    description: 'Alternative ways for your child to communicate',
    category: 'equipment',
    icon: '💬'
  }
];

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first activity',
    icon: '🌟',
    pointsRequired: 10,
    category: 'activity'
  },
  {
    id: '2',
    title: 'Consistency Champion',
    description: 'Log activities for 7 days in a row',
    icon: '🔥',
    pointsRequired: 100,
    category: 'streak'
  },
  {
    id: '3',
    title: 'Milestone Maker',
    description: 'Celebrate your first milestone',
    icon: '🏆',
    pointsRequired: 50,
    category: 'milestone'
  },
  {
    id: '4',
    title: 'Therapy Star',
    description: 'Complete 5 therapy sessions',
    icon: '⭐',
    pointsRequired: 75,
    category: 'therapy'
  },
  {
    id: '5',
    title: 'Super Caregiver',
    description: 'Reach 500 total points',
    icon: '🦸',
    pointsRequired: 500,
    category: 'special'
  },
  {
    id: '6',
    title: 'Activity Master',
    description: 'Complete 50 activities',
    icon: '👑',
    pointsRequired: 250,
    category: 'activity'
  },
  {
    id: '7',
    title: 'Month of Care',
    description: 'Log activities for 30 days',
    icon: '📅',
    pointsRequired: 300,
    category: 'streak'
  },
  {
    id: '8',
    title: 'Explorer',
    description: 'Try activities from all categories',
    icon: '🧭',
    pointsRequired: 150,
    category: 'special'
  }
];
