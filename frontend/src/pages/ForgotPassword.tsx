import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthLayout } from '../components/layout';
import { Button, Input, Card } from '../components/ui';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <Card className="w-full max-w-md text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-secondary-container/20 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-secondary" />
            </div>
            <h1 className="text-headline-lg text-on-surface font-bold mb-2">
              Check Your Email
            </h1>
            <p className="text-body-md text-on-surface-variant">
              We've sent password reset instructions to{' '}
              <strong className="text-on-surface">{email}</strong>
            </p>
          </div>

          <div className="p-4 bg-surface-container-low rounded-lg text-left mb-6">
            <p className="text-body-sm text-on-surface-variant mb-2">
              Click the link in the email to reset your password.
            </p>
            <p className="text-body-sm text-on-surface-variant">
              If you don't see the email, check your spam folder.
            </p>
          </div>

          <Link to="/login">
            <Button fullWidth>
              <ArrowLeft size={18} />
              Back to Login
            </Button>
          </Link>

          <div className="mt-4">
            <button
              onClick={() => setSuccess(false)}
              className="text-body-sm text-primary hover:underline"
            >
              Try a different email
            </button>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline mb-4"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
          <h1 className="text-headline-lg text-on-surface font-bold mb-2">
            Reset Password
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Enter your email and we'll send you instructions to reset your password
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg flex items-start gap-2">
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={18} />}
            helperText="We'll send password reset instructions to this email"
            required
          />

          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            Send Reset Instructions
          </Button>
        </form>

        <div className="auth-footer">
          Remember your password?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
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
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/too-many-requests':
      return 'Too many requests. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}
