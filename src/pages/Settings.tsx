import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { User, Bell, Save } from 'lucide-react';

export default function Settings() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Error fetching user:', userError?.message);
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError.message);
      } else {
        setProfile({
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          email: user.email || '',
          company: profileData.company || ''
        });
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        company: profile.company
      });

    if (error) {
      alert('Failed to save changes.');
      console.error(error);
    } else {
      alert('Profile updated successfully!');
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 flex-1">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your personal preferences</p>
            </div>

            {/* --- Account Info --- */}
            <section className="card-premium p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" /> Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => handleChange('first_name', e.target.value)}
                    className="input w-full mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => handleChange('last_name', e.target.value)}
                    className="input w-full mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="input w-full mt-1 bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Company</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="input w-full mt-1"
                  />
                </div>
              </div>
            </section>

            {/* --- Notifications --- */}
            <section className="card-premium p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Settings
              </h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) =>
                      setNotifications((n) => ({ ...n, email: e.target.checked }))
                    }
                  />
                  Email Alerts
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e) =>
                      setNotifications((n) => ({ ...n, push: e.target.checked }))
                    }
                  />
                  Push Notifications
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifications.weekly}
                    onChange={(e) =>
                      setNotifications((n) => ({ ...n, weekly: e.target.checked }))
                    }
                  />
                  Weekly Summary
                </label>
              </div>
            </section>

            {/* --- Save Button --- */}
            <div className="flex justify-end">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
