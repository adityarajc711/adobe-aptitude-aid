import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User } from '@/types/assessment';

interface AssessmentLoginProps {
  onLogin: (user: User) => void;
}

const VALID_USERS = {
  "atabhishek.tiwari1997@gmail.com": { password: "Abhi@1997", name: "Abhishek Tiwari" },
  "Himanshujharaniya1995@gmail.com": { password: "Himu@1995", name: "Himanshu Jharaniya" },
  "Adityarajc7@yahoo.com": { password: "Adi@2000", name: "Aditya Raj" }
};

export function AssessmentLogin({ onLogin }: AssessmentLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = VALID_USERS[email as keyof typeof VALID_USERS];
    
    if (user && user.password === password) {
      onLogin({ email, name: user.name });
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl">
              A
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Adobe General Assessment</CardTitle>
              <p className="text-muted-foreground">Proctored • General Aptitude & Judgment</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="max-w-md mx-auto">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login to Assessment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}