import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { AuthLayout } from '../components/layout';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err: any) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl">
        <div className="mb-8">
          <h1 className="text-headline-lg text-on-surface font-bold mb-2">
            Welcome Back
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Sign in to your CampusIQ account
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-container text-error rounded-xl flex items-start gap-3 border border-error/20">
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <p className="text-body-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
            label="Email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            required
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-md border-outline-variant/60 text-primary focus:ring-primary/20 focus:ring-offset-0 smooth-transition"
              />
              <span className="text-body-sm text-on-surface-variant group-hover:text-on-surface smooth-transition">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-body-sm text-primary hover:text-primary-hover font-medium smooth-transition"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading} disabled={loading} size="lg">
            Sign In
          </Button>
        </form>

        <div className="auth-divider my-6">OR</div>

        <Button variant="outline" fullWidth onClick={handleGoogleLogin} disabled={loading} size="lg">
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          Continue with Google
        </Button>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold hover:text-primary-hover smooth-transition">
            Sign up
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Try again later.';
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in.';
    default:
      return 'An error occurred. Please try again.';
  }
}
