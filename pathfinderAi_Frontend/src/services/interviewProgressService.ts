// Service to manage interview round completion progress

const STORAGE_KEY = 'interview_progress';

export interface InterviewProgress {
  completedRounds: number[];
  currentRound: number;
  startedAt?: string;
}

export const getInterviewProgress = (): InterviewProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading interview progress:', error);
  }
  return {
    completedRounds: [],
    currentRound: 1,
  };
};

export const saveInterviewProgress = (progress: InterviewProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving interview progress:', error);
  }
};

export const markRoundComplete = (roundNumber: number): void => {
  const progress = getInterviewProgress();
  if (!progress.completedRounds.includes(roundNumber)) {
    progress.completedRounds.push(roundNumber);
  }
  progress.currentRound = roundNumber + 1;
  saveInterviewProgress(progress);
};

export const isRoundAccessible = (roundNumber: number): boolean => {
  const progress = getInterviewProgress();
  
  // Round 1 is always accessible
  if (roundNumber === 1) return true;
  
  // Other rounds are only accessible if previous round is completed
  return progress.completedRounds.includes(roundNumber - 1);
};

export const resetInterviewProgress = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCurrentRound = (): number => {
  const progress = getInterviewProgress();
  return progress.currentRound;
};
