import { Bell, Search, User } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (authData?.user) {
        console.log('Auth user ID:', authData.user.id);
        console.log('Auth user email:', authData.user.email);

        // Let's first check what's actually in the Users table
        const { data: allUsers, error: allUsersError } = await supabase
          .from('Users')
          .select('*')
          .limit(10);

        console.log('All users in table:', allUsers);
        console.log('All users error:', allUsersError);

        // Try different approaches to find the user
        let profileData = null;
        let error = null;

        // Approach 1: Query by UID
        if (authData.user.id) {
          const { data: uidData, error: uidError } = await supabase
            .from('Users')
            .select('*')
            .eq('UID', authData.user.id)
            .maybeSingle(); // Use maybeSingle instead of single

          console.log('UID query result:', uidData);
          console.log('UID query error:', uidError);
          
          if (uidData && !uidError) {
            profileData = uidData;
            error = uidError;
          }
        }

        // Approach 2: Query by Email (case insensitive)
        if (!profileData && authData.user.email) {
          const { data: emailData, error: emailError } = await supabase
            .from('Users')
            .select('*')
            .ilike('Email', authData.user.email) // Case insensitive search
            .maybeSingle();

          console.log('Email query result:', emailData);
          console.log('Email query error:', emailError);
          
          if (emailData && !emailError) {
            profileData = emailData;
            error = emailError;
          }
        }

        // Approach 3: Try with lowercase email
        if (!profileData && authData.user.email) {
          const { data: lowerEmailData, error: lowerEmailError } = await supabase
            .from('Users')
            .select('*')
            .eq('Email', authData.user.email.toLowerCase())
            .maybeSingle();

          console.log('Lowercase email query result:', lowerEmailData);
          console.log('Lowercase email query error:', lowerEmailError);
          
          if (lowerEmailData && !lowerEmailError) {
            profileData = lowerEmailData;
            error = lowerEmailError;
          }
        }

        if (profileData && !error) {
          console.log('Found profile data:', profileData);
          console.log('Display name from DB:', profileData['Display name']);
          setUser({
            ...authData.user,
            display_name: profileData['Display name'],
          });
        } else {
          console.error('No matching user found in Users table');
          setUser(authData.user);
        }
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // Updated to use the display_name from your Users table
  const userName =
    user?.display_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    'Unknown User';

  return (
    <header className="bg-surface border-b border-card-border px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Search Bar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, reviews..."
              className="pl-10 pr-4 py-2 bg-muted border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent w-96"
            />
          </div>
        </div>

        {/* Right: Theme Toggle, Notifications, User Auth */}
        <div className="flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />

          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-danger text-danger-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="relative group">
                <div className="p-2 bg-primary rounded-lg cursor-pointer">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
                {/* Fixed logout button placement */}
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 min-w-[120px] opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-left rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};