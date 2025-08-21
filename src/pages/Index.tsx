import { useState } from 'react';
import { User } from '@/types/assessment';
import { AssessmentLogin } from '@/components/AssessmentLogin';
import { AssessmentInstructions } from '@/components/AssessmentInstructions';
import { AssessmentContainer } from '@/components/AssessmentContainer';

type AppState = 'login' | 'instructions' | 'assessment';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setAppState('instructions');
  };

  const handleStartAssessment = () => {
    setAppState('assessment');
  };

  const handleBackToLogin = () => {
    setAppState('login');
    setUser(null);
  };

  if (appState === 'login') {
    return <AssessmentLogin onLogin={handleLogin} />;
  }

  if (appState === 'instructions') {
    return (
      <AssessmentInstructions 
        onStart={handleStartAssessment}
        onBack={handleBackToLogin}
      />
    );
  }

  if (appState === 'assessment' && user) {
    return <AssessmentContainer user={user} />;
  }

  return null;
};

export default Index;
