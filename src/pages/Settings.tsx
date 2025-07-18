import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { 
  Shield, 
  Bell, 
  User, 
  Key, 
  Database, 
  Palette,
  Globe,
  Mail,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-hero text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your account and application preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <nav className="card-premium p-4 space-y-2">
                  <a href="#account" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary">
                    <User className="h-4 w-4" />
                    Account
                  </a>
                  <a href="#security" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Shield className="h-4 w-4" />
                    Security
                  </a>
                  <a href="#notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Bell className="h-4 w-4" />
                    Notifications
                  </a>
                  <a href="#api" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Key className="h-4 w-4" />
                    API Keys
                  </a>
                  <a href="#appearance" className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                    <Palette className="h-4 w-4" />
                    Appearance
                  </a>
                </nav>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Account Settings */}
                <section id="account" className="card-premium p-6">
                  <h2 className="text-card-title text-foreground mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label block mb-2">First Name</label>
                        <input 
                          type="text" 
                          defaultValue="Sarah"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-label block mb-2">Last Name</label>
                        <input 
                          type="text" 
                          defaultValue="Chen"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-label block mb-2">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="sarah.chen@company.com"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="text-label block mb-2">Company</label>
                      <input 
                        type="text" 
                        defaultValue="TechCorp Inc."
                        className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>
                </section>

                {/* Security Settings */}
                <section id="security" className="card-premium p-6">
                  <h2 className="text-card-title text-foreground mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-label block mb-2">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter current password"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label block mb-2">New Password</label>
                        <input 
                          type="password" 
                          placeholder="Enter new password"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-label block mb-2">Confirm Password</label>
                        <input 
                          type="password" 
                          placeholder="Confirm new password"
                          className="w-full px-3 py-2 border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <button className="btn-primary">Enable</button>
                    </div>
                  </div>
                </section>

                {/* Notifications */}
                <section id="notifications" className="card-premium p-6">
                  <h2 className="text-card-title text-foreground mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.email}
                        onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Browser notifications</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.push}
                        onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">Weekly Summary</p>
                        <p className="text-sm text-muted-foreground">Weekly analytics digest</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={notifications.weekly}
                        onChange={(e) => setNotifications({...notifications, weekly: e.target.checked})}
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </section>

                {/* API Keys */}
                <section id="api" className="card-premium p-6">
                  <h2 className="text-card-title text-foreground mb-4 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-label block mb-2">Production API Key</label>
                      <div className="flex gap-2">
                        <input 
                          type={showApiKey ? "text" : "password"} 
                          defaultValue="sk-1234567890abcdef"
                          readOnly
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-muted text-muted-foreground"
                        />
                        <button 
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="btn-secondary px-3"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    
                    <button className="btn-primary">Generate New Key</button>
                  </div>
                </section>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button className="btn-primary">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}