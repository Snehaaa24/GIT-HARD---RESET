import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    // Ensure proper font loading
    document.documentElement.classList.add('font-feature-settings-enabled');
    
    return () => {
      document.documentElement.classList.remove('font-feature-settings-enabled');
    };
  }, []);

  return (
    <div className="landing-page min-h-screen bg-[#f5f5f5]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
          {/* First Card */}
          <div className="card p-8 rounded-3xl flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium">About</div>
              <div className="text-sm font-medium">Blog</div>
            </div>
            <div className="mt-auto">
              {/* Cloud illustration */}
              <div className="h-20 flex items-end">
                <svg width="100" height="40" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 30C5 30 0 25 0 20C0 15 5 10 10 10C15 5 25 5 30 10C35 0 50 0 55 10C65 10 70 20 65 30C60 35 50 35 45 30C40 35 30 35 25 30C20 35 15 30 10 30Z" fill="#E0E0E0" />
                </svg>
              </div>
            </div>
          </div>

          {/* Main Hero Card */}
          <div className="card col-span-2 p-8 rounded-3xl hover:shadow-lg">
            <div className="flex justify-between items-center">
              <div className="nav-logo flex items-center gap-2">
                <div className="nav-logo-circle h-6 w-6 rounded-full bg-black"></div>
                <span className="font-medium">Technology</span>
                <span className="ml-4 text-gray-500 hover:text-black transition-colors">Pricing</span>
              </div>
              <div className="nav-links flex items-center gap-4">
                <span className="text-sm hover:text-gray-700 transition-colors">About</span>
                <span className="text-sm hover:text-gray-700 transition-colors">Blog</span>
                <Button className="btn-primary hover:bg-gray-800 transition-colors">View Demo</Button>
              </div>
              <div className="mobile-menu-button hidden">
                <button className="p-2 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="hero-text">
                <small className="text-gray-500 block text-sm tracking-tight">Save time and money.</small>
                <small className="text-gray-500 block text-sm tracking-tight">Achieve more business with less management!</small>
                <h1 className="hero-heading mt-4">Optimize,</h1>
                <h1 className="hero-heading">Outperform</h1>
              </div>
              <div className="flex justify-center items-center">
                <div className="transform hover:scale-[1.02] transition-transform duration-500">
                  <img src="/hand-phone.svg" alt="Hand holding phone" className="max-w-xs w-full drop-shadow-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Features Card */}
            <div className="card p-8 rounded-3xl hover:shadow-lg">
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <img src="/dashboard.svg" alt="Dashboard" className="w-full object-contain" />
                </div>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <div className="feature-number font-semibold">01</div>
                    <div className="feature-title mt-2 font-semibold">AI Revolution</div>
                  </div>
                  <div>
                    <div className="feature-number font-semibold">02</div>
                    <div className="feature-title mt-2 font-semibold">AI Chatbot JET</div>
                  </div>
                  <div>
                    <div className="feature-number font-semibold">03</div>
                    <div className="feature-title mt-2 font-semibold">AI Assistance</div>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="feature-description">
                      <p className="text-gray-600 text-sm leading-relaxed">Explore a multitude of benefits</p>
                      <p className="text-gray-600 text-sm leading-relaxed">meticulously tailored to meet the</p>
                      <p className="text-gray-600 text-sm leading-relaxed">unique needs of buyers.</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Features Card */}
            <div className="card p-8 rounded-3xl hover:shadow-lg">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="text-sm mb-1 font-medium tracking-tight">Access personalized security with</div>
                  <div className="text-sm mb-4 text-gray-600">Blockchain, ensuring port authenticity.</div>
                </div>
                <div>
                  <div className="text-sm mb-1 font-medium tracking-tight">Boost security with AI Chatbot JET</div>
                  <div className="text-sm mb-4 text-gray-600">on popular messaging platforms.</div>
                </div>
                <div>
                  <div className="text-sm mb-1 font-medium tracking-tight">Elevate efficiency with our system</div>
                  <div className="text-sm mb-4 text-gray-600">using voice commands.</div>
                </div>
                <div className="green-card transform transition-transform hover:scale-[1.02]">
                  <div className="percentage-large">40%</div>
                  <div className="text-sm font-medium tracking-tight">JET AI-Driven system</div>
                  <div className="text-sm opacity-90">improves rates.</div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="card p-8 rounded-3xl hover:shadow-lg">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">×</span>
                  <div>
                    <div className="stats-heading tracking-tight">The <span className="stats-text">platform</span> emerged as</div>
                    <div className="stats-heading tracking-tight">a pivotal tool, <span className="stats-text">optimizing</span></div>
                    <div className="stats-heading tracking-tight"><span className="stats-text">logistics</span> in aviation.</div>
                  </div>
                </div>
                <div>
                  <div className="stats-percentage tracking-tight">20%</div>
                  <div className="text-sm font-medium tracking-tight">Platform cuts delays,</div>
                  <div className="text-sm text-gray-600">boosts efficiency.</div>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                      <span className="text-xs font-medium">Ryan & McElroy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
                      <span className="text-xs font-medium">Hernandez Airways</span>
                    </div>
                  </div>
                  <div className="chart-container relative">
                    <img src="/circular-chart.svg" alt="Performance chart" className="w-full h-full object-contain" />
                    <div className="chart-center">
                      <div className="chart-value">+124k</div>
                    </div>
                    <div className="chart-labels absolute bottom-0 w-full flex justify-between text-xs font-medium">
                      <span className="text-blue-500">24%</span>
                      <span className="text-yellow-500">52%</span>
                      <span className="text-gray-400">44%</span>
                      <span className="text-blue-500">52%</span>
                      <span className="text-yellow-500">84%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Card */}
          <div className="grid grid-cols-3 gap-6 mt-8">
            <div className="col-span-2"></div>
            <div className="card p-8 rounded-3xl hover:shadow-lg">
              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold tracking-tight">Aut</h2>
                <div className="text-gray-400 font-light tracking-tighter">th</div>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="check-item">
                    <div className="check-circle blue">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Tailored invoicing for aviation</span>
                  </div>
                  <div className="check-item">
                    <div className="check-circle black">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Client payment portal</span>
                  </div>
                  <div className="check-item">
                    <div className="check-circle blue">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Secure global payments</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
