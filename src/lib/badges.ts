
import type { LucideIcon } from 'lucide-react';
import { Award, Star, Medal, Gem, Trophy, Shield, BrainCircuit, Dices, Sigma } from 'lucide-react';

export type BadgeCriteria = {
  type: 'levels_completed' | 'topic_completed' | 'grade_completed';
  count?: number; // for levels_completed
  topicId?: string; // for topic_completed
  grade?: number; // for grade_completed
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  criteria: BadgeCriteria;
};

export const badges: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first quiz level.',
    icon: Star,
    criteria: { type: 'levels_completed', count: 1 },
  },
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Complete 5 quiz levels.',
    icon: Award,
    criteria: { type: 'levels_completed', count: 5 },
  },
  {
    id: 'topic-explorer',
    name: 'Topic Explorer',
    description: 'Master your first topic by completing all its levels.',
    icon: Medal,
    criteria: { type: 'topic_completed' },
  },
  {
    id: 'algebra-ace',
    name: 'Algebra Ace',
    description: 'Complete the Grade 8 Algebra topic.',
    icon: BrainCircuit,
    criteria: { type: 'topic_completed', topicId: 'g8-topic9' },
  },
   {
    id: 'geometry-genius',
    name: 'Geometry Genius',
    description: 'Complete the Grade 7 Practical Geometry topic.',
    icon: Shield,
    criteria: { type: 'topic_completed', topicId: 'g7-topic10' },
  },
  {
    id: 'probability-pro',
    name: 'Probability Pro',
    description: 'Complete the Grade 9 Probability topic.',
    icon: Dices,
    criteria: { type: 'topic_completed', topicId: 'g9-topic15' },
  },
  {
    id: 'numbers-ninja',
    name: 'Numbers Ninja',
    description: 'Complete the Grade 10 Real Numbers topic.',
    icon: Sigma,
    criteria: { type: 'topic_completed', topicId: 'g10-topic1' },
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Complete 25 quiz levels.',
    icon: Gem,
    criteria: { type: 'levels_completed', count: 25 },
  },
  {
    id: 'grade-8-grad',
    name: 'Grade 8 Graduate',
    description: 'Complete all topics in Grade 8.',
    icon: Trophy,
    criteria: { type: 'grade_completed', grade: 8 },
  },
];
