export interface Question {
  id: string;
  section: string;
  type: 'mcq' | 'open';
  marks: number;
  question: string;
  options?: string[];
  answer?: number;
}

export interface AssessmentState {
  current: number;
  answers: Record<string, number | string>;
  marked: Record<string, boolean>;
  submitted: boolean;
  secondsLeft: number;
  snapshots: Snapshot[];
}

export interface Snapshot {
  ts: string;
  q: number;
  data: string;
}

export interface User {
  email: string;
  name: string;
}

export interface SubmissionData {
  answers: Record<string, number | string>;
  marked: Record<string, boolean>;
  snapshots: Snapshot[];
  score: {
    score: number;
    max: number;
  };
  submittedAt: string;
  user: User;
}