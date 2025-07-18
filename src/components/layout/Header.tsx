import { Bell, Search, User } from 'lucide-react';
import { ThemeToggle } from '../ui/theme-toggle';
import { useTheme } from '../../hooks/useTheme';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate(); // ✅ FIXED

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
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
                <p className="text-sm font-medium">{user.email}</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <div className="relative group">
                <div className="p-2 bg-primary rounded-lg cursor-pointer">
                  <User className="h-5 w-5 text-primary-foreground" />
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                  >
                    Logout
                  </button>
                </div>

                <div className="absolute right-0 mt-2 hidden group-hover:block bg-white shadow-lg rounded-md overflow-hidden z-10">
                  
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