import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentLayout } from '../../components/layout';
import { Card, Button, Input, Modal } from '../../components/ui';
import { Calendar, Mail, Bell, User, LogOut, Trash2, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export function Settings() {
  const navigate = useNavigate();
  const { profile, firebaseUser, logout } = useAuth();
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const handleConnectCalendar = () => {
    // Initiate OAuth flow
    toast.info('Google Calendar OAuth would be initiated here');
    // In production: window.location.href = '/api/v1/calendar/connect';
    setCalendarConnected(true);
  };

  const handleDisconnectCalendar = () => {
    setCalendarConnected(false);
    toast.success('Calendar disconnected');
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-headline-lg text-on-surface">Settings</h1>
          <p className="text-body-md text-on-surface-variant">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <User size={24} className="text-primary" />
            <h2 className="font-headline-md text-on-surface">Profile</h2>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Full Name"
              value={profile?.name || ''}
              disabled
            />
            <Input
              label="Email"
              value={firebaseUser?.email || ''}
              disabled
              icon={<Mail size={18} />}
            />
            <Input
              label="Role"
              value={profile?.role || 'student'}
              disabled
              className="capitalize"
            />
          </div>
        </Card>

        {/* Google Calendar Integration */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <Calendar size={24} className="text-primary" />
            <h2 className="font-headline-md text-on-surface">Google Calendar</h2>
          </div>

          {calendarConnected ? (
            <div className="space-y-4">
              <div className="p-4 bg-secondary-light rounded-xl flex items-start gap-3">
                <CheckCircle className="text-secondary flex-shrink-0" size={20} />
                <div className="flex-1">
                  <h3 className="font-label-md font-bold text-on-surface mb-1">
                    Calendar Connected
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Your timetable and deadlines are synced to Google Calendar
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => toast.info('Resyncing calendar...')}>
                  Resync Calendar
                </Button>
                <Button variant="danger" onClick={handleDisconnectCalendar}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-body-md text-on-surface-variant">
                Connect your Google Calendar to automatically sync your academic schedule,
                exam dates, and assignment deadlines.
              </p>
              <Button onClick={handleConnectCalendar}>
                <LinkIcon size={18} />
                Connect Google Calendar
              </Button>
            </div>
          )}
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-center gap-4 mb-6">
            <Bell size={24} className="text-primary" />
            <h2 className="font-headline-md text-on-surface">Notifications</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl cursor-pointer">
              <div>
                <h3 className="font-label-md font-bold text-on-surface">Email Notifications</h3>
                <p className="text-body-sm text-on-surface-variant">
                  Receive updates about extraction failures and weak topics
                </p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary"
              />
            </label>
          </div>
        </Card>

        {/* Account Actions */}
        <Card>
          <h2 className="font-headline-md text-on-surface mb-6">Account Actions</h2>
          
          <div className="space-y-3">
            <Button variant="outline" onClick={handleLogout} fullWidth>
              <LogOut size={18} />
              Sign Out
            </Button>
            <Button variant="danger" onClick={() => setDeleteModal(true)} fullWidth>
              <Trash2 size={18} />
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete Account"
      >
        <p className="text-body-md text-on-surface-variant mb-6">
          Are you sure you want to delete your account? This will permanently delete all your
          data including documents, extractions, and chat history. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => toast.error('Account deletion not implemented')}>
            Delete Account
          </Button>
        </div>
      </Modal>
    </StudentLayout>
  );
}
