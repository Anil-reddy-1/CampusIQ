import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthLayout } from '../components/layout';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (fullName.length < 2) {
      setError('Please enter your full name');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Show success message
      setSuccess(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md text-center shadow-xl">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-success-light rounded-2xl flex items-center justify-center">
              <CheckCircle size={36} className="text-secondary" />
            </div>
            <h1 className="text-headline-lg text-on-surface font-bold mb-2">
              Account Created!
            </h1>
            <p className="text-body-md text-on-surface-variant">
              We've sent a verification email to <strong className="text-on-surface">{email}</strong>
            </p>
          </div>

          <div className="p-5 bg-surface-container rounded-xl text-left mb-6 border border-outline-variant/40">
            <p className="text-body-sm text-on-surface-variant mb-3">
              Please check your email and click the verification link to activate your account.
            </p>
            <p className="text-body-sm text-on-surface-variant">
              Redirecting you to login page...
            </p>
          </div>

          <Button fullWidth onClick={() => navigate('/login')} size="lg">
            Go to Login
          </Button>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-xl">
        <div className="mb-8">
          <h1 className="text-headline-lg text-on-surface font-bold mb-2">
            Create Account
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Join CampusIQ and start your academic journey
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
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User size={18} />}
            required
          />

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
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} />}
            helperText="Must be at least 6 characters long"
            required
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={18} />}
            required
          />

          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded-md border-outline-variant/60 text-primary focus:ring-primary/20 focus:ring-offset-0 smooth-transition"
            />
            <span className="text-body-sm text-on-surface-variant">
              I agree to the{' '}
              <Link to="/terms" className="text-primary hover:text-primary-hover font-medium smooth-transition">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary hover:text-primary-hover font-medium smooth-transition">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button type="submit" fullWidth loading={loading} disabled={loading} size="lg">
            Create Account
          </Button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:text-primary-hover smooth-transition">
            Sign in
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}

function mapFirebaseError(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    default:
      return 'An error occurred during signup. Please try again.';
  }
}
