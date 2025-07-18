// src/pages/Login.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('not confirmed')) {
        return alert('Please verify your email first. Check your inbox!');
      }
      return alert(error.message);
    }
    // on success, redirect
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-purple-100 to-orange-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Left Side: Illustration */}
        <div className="hidden md:flex items-center justify-center bg-white w-1/2 p-8">
          <img
            src="/login-illustration.png"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">WELCOME BACK</h2>
          <h3 className="text-lg font-semibold text-center text-purple-600">LOGIN PAGE</h3>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="text-right text-sm text-purple-600 hover:underline cursor-pointer">
              Forgot password?
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold hover:opacity-90 transition"
            >
              SIGN IN
            </button>
          </form>

          <div className="text-center text-sm">
            DON’T HAVE AN ACCOUNT?{' '}
            <span
              className="text-purple-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate('/signup')}
            >
              CREATE AN ACCOUNT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
