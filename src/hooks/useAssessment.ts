import { useState, useCallback, useEffect } from 'react';
import { AssessmentState, Question, SubmissionData, User } from '@/types/assessment';
import { QUESTIONS } from '@/data/questions';

const ASSESSMENT_DURATION = 90 * 60; // 90 minutes in seconds

export const useAssessment = (user: User | null) => {
  const [state, setState] = useState<AssessmentState>({
    current: 0,
    answers: {},
    marked: {},
    submitted: false,
    secondsLeft: ASSESSMENT_DURATION,
    snapshots: []
  });

  // Load saved data from localStorage
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem('AGA_answers');
      const savedMarked = localStorage.getItem('AGA_marked');
      
      if (savedAnswers) {
        setState(prev => ({ ...prev, answers: JSON.parse(savedAnswers) }));
      }
      if (savedMarked) {
        setState(prev => ({ ...prev, marked: JSON.parse(savedMarked) }));
      }
    } catch (error) {
      console.warn('Failed to load saved assessment data:', error);
    }
  }, []);

  const saveAnswer = useCallback((questionId: string, answer: number | string) => {
    setState(prev => {
      const newAnswers = { ...prev.answers, [questionId]: answer };
      try {
        localStorage.setItem('AGA_answers', JSON.stringify(newAnswers));
      } catch (error) {
        console.warn('Failed to save answer to localStorage:', error);
      }
      return { ...prev, answers: newAnswers };
    });
  }, []);

  const toggleMark = useCallback((questionId: string) => {
    setState(prev => {
      const newMarked = { ...prev.marked, [questionId]: !prev.marked[questionId] };
      try {
        localStorage.setItem('AGA_marked', JSON.stringify(newMarked));
      } catch (error) {
        console.warn('Failed to save marked questions to localStorage:', error);
      }
      return { ...prev, marked: newMarked };
    });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < QUESTIONS.length) {
      setState(prev => ({ ...prev, current: index }));
    }
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.current < QUESTIONS.length - 1) {
        return { ...prev, current: prev.current + 1 };
      }
      return prev;
    });
  }, []);

  const prevQuestion = useCallback(() => {
    setState(prev => {
      if (prev.current > 0) {
        return { ...prev, current: prev.current - 1 };
      }
      return prev;
    });
  }, []);

  const updateTimer = useCallback((seconds: number) => {
    setState(prev => ({ ...prev, secondsLeft: seconds }));
  }, []);

  const calculateScore = useCallback(() => {
    let score = 0;
    let maxScore = 0;

    QUESTIONS.forEach(question => {
      if (question.type === 'mcq' && typeof question.answer === 'number') {
        maxScore += question.marks;
        if (state.answers[question.id] === question.answer) {
          score += question.marks;
        }
      }
    });

    return { score, maxScore };
  }, [state.answers]);

  const submitAssessment = useCallback(() => {
    if (!user) return;

    const { score, maxScore } = calculateScore();
    
    const submissionData: SubmissionData = {
      answers: state.answers,
      marked: state.marked,
      snapshots: state.snapshots,
      score: { score, max: maxScore },
      submittedAt: new Date().toISOString(),
      user
    };

    try {
      localStorage.setItem('AGA_submission', JSON.stringify(submissionData));
    } catch (error) {
      console.warn('Failed to save submission to localStorage:', error);
    }

    setState(prev => ({ ...prev, submitted: true }));
    return submissionData;
  }, [user, state, calculateScore]);

  const getProgress = useCallback(() => {
    const attempted = Object.keys(state.answers).length;
    const marked = Object.values(state.marked).filter(Boolean).length;
    const percentage = Math.round((attempted / QUESTIONS.length) * 100);
    
    return { attempted, marked, percentage };
  }, [state.answers, state.marked]);

  return {
    state,
    questions: QUESTIONS,
    saveAnswer,
    toggleMark,
    goToQuestion,
    nextQuestion,
    prevQuestion,
    updateTimer,
    submitAssessment,
    calculateScore,
    getProgress
  };
};