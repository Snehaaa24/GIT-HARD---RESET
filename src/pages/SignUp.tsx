// src/pages/Signup.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { User as UserIcon, Mail, Lock } from 'lucide-react';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1️⃣ Trigger sign-up with email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/login` }
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 2️⃣ Inform user to check email
    alert(
      'A confirmation email has been sent! ' +
        'Please check your inbox and click the link to verify your email before logging in.'
    );

    // 3️⃣ Redirect to login
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-100 via-purple-100 to-orange-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex max-w-4xl w-full overflow-hidden">
        {/* Left Illustration */}
        <div className="hidden md:flex items-center justify-center bg-white w-1/2 p-8">
          <img
            src="/login-illustration.png"
            alt="Signup Illustration"
            className="max-w-full h-auto"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center">GET STARTED</h2>
          <h3 className="text-lg font-semibold text-center text-purple-600">CREATE ACCOUNT</h3>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

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

            <button
              type="submit"
              className="w-full py-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold hover:opacity-90 transition"
            >
              SIGN UP
            </button>
          </form>

          <div className="text-center text-sm">
            ALREADY HAVE AN ACCOUNT?{' '}
            <span
              className="text-purple-600 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >
              SIGN IN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
