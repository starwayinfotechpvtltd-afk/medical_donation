// app/admin/settings/page.tsx
'use client';

import { useState } from "react";
import {
  Settings, User, Bell, Lock, Palette, Globe, Database,
  Mail, Phone, MapPin, Clock, Calendar, CreditCard,
  Shield, Users, FileText, Activity, Heart, Stethoscope,
  FlaskConical, MessageSquare, Save, X, Plus, Trash2,
  Edit2, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw,
  Upload, Download, Printer, Moon, Sun, Monitor, Smartphone,
  Laptop, Tablet, Wifi, Bluetooth, Printer as PrinterIcon,
  HardDrive, Cloud, Server, Key, Fingerprint, QrCode
} from "lucide-react";

// Types
type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'hi';
type Timezone = 'UTC' | 'EST' | 'PST' | 'IST' | 'GMT';
type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
type TimeFormat = '12h' | '24h';

interface SettingsData {
  // Profile Settings
  profile: {
    hospitalName: string;
    hospitalEmail: string;
    hospitalPhone: string;
    hospitalAddress: string;
    hospitalCity: string;
    hospitalState: string;
    hospitalZip: string;
    hospitalCountry: string;
    logo?: string;
    favicon?: string;
  };
  
  // Appearance Settings
  appearance: {
    theme: ThemeMode;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    sidebarCollapsed: boolean;
    animations: boolean;
    compactView: boolean;
  };
  
  // Notification Settings
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    appointmentReminders: boolean;
    testResultsReady: boolean;
    newMessages: boolean;
    systemAlerts: boolean;
    marketingEmails: boolean;
  };
  
  // Security Settings
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiryDays: number;
    maxLoginAttempts: number;
    ipWhitelist: string[];
    allowedDomains: string[];
    requireStrongPassword: boolean;
    auditLogRetention: number;
  };
  
  // System Settings
  system: {
    language: Language;
    timezone: Timezone;
    dateFormat: DateFormat;
    timeFormat: TimeFormat;
    currency: string;
    firstDayOfWeek: number;
    maintenanceMode: boolean;
    debugMode: boolean;
  };
  
  // Integration Settings
  integrations: {
    emailProvider: string;
    smsProvider: string;
    paymentGateway: string;
    labIntegration: boolean;
    pharmacyIntegration: boolean;
    insuranceIntegration: boolean;
    apiKeys: Array<{
      id: string;
      name: string;
      key: string;
      createdAt: string;
      lastUsed?: string;
    }>;
  };
  
  // Billing Settings
  billing: {
    plan: string;
    subscriptionId: string;
    nextBillingDate: string;
    paymentMethod: string;
    invoiceEmail: string;
    taxId: string;
  };
}

// Mock Data
const mockSettings: SettingsData = {
  profile: {
    hospitalName: "MediCare Hospital",
    hospitalEmail: "contact@medicare.com",
    hospitalPhone: "+91 98765 43210",
    hospitalAddress: "123 Healthcare Avenue",
    hospitalCity: "Mumbai",
    hospitalState: "Maharashtra",
    hospitalZip: "400001",
    hospitalCountry: "India",
  },
  appearance: {
    theme: 'light',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    accentColor: '#10b981',
    fontSize: 'medium',
    sidebarCollapsed: false,
    animations: true,
    compactView: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    testResultsReady: true,
    newMessages: true,
    systemAlerts: true,
    marketingEmails: false,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    allowedDomains: ['medicare.com', 'hospital.com'],
    requireStrongPassword: true,
    auditLogRetention: 365,
  },
  system: {
    language: 'en',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    currency: 'INR',
    firstDayOfWeek: 1,
    maintenanceMode: false,
    debugMode: false,
  },
  integrations: {
    emailProvider: 'SMTP',
    smsProvider: 'Twilio',
    paymentGateway: 'Stripe',
    labIntegration: true,
    pharmacyIntegration: false,
    insuranceIntegration: true,
    apiKeys: [
      {
        id: '1',
        name: 'Production API Key',
        key: 'sk_live_xxxxxxxxxxxxx',
        createdAt: '2024-01-15',
        lastUsed: '2024-03-27',
      },
      {
        id: '2',
        name: 'Test API Key',
        key: 'sk_test_xxxxxxxxxxxxx',
        createdAt: '2024-02-01',
      },
    ],
  },
  billing: {
    plan: 'Enterprise',
    subscriptionId: 'sub_xxxxxxxxxxxxx',
    nextBillingDate: '2024-04-15',
    paymentMethod: 'Visa ending in 4242',
    invoiceEmail: 'billing@medicare.com',
    taxId: 'GST123456789',
  },
};

// Tab Components
function ProfileSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.profile);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('profile', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Hospital Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hospital Name
            </label>
            <input
              type="text"
              value={formData.hospitalName}
              onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.hospitalEmail}
              onChange={(e) => setFormData({ ...formData, hospitalEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.hospitalPhone}
              onChange={(e) => setFormData({ ...formData, hospitalPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={formData.hospitalAddress}
              onChange={(e) => setFormData({ ...formData, hospitalAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={formData.hospitalCity}
              onChange={(e) => setFormData({ ...formData, hospitalCity: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              State
            </label>
            <input
              type="text"
              value={formData.hospitalState}
              onChange={(e) => setFormData({ ...formData, hospitalState: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.hospitalZip}
              onChange={(e) => setFormData({ ...formData, hospitalZip: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.hospitalCountry}
              onChange={(e) => setFormData({ ...formData, hospitalCountry: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Branding</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hospital Logo
            </label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center">
                <Heart className="w-8 h-8 text-blue-500" />
              </div>
              <button className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Logo
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Favicon
            </label>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <Heart className="w-4 h-4 text-blue-500" />
              </div>
              <button className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Favicon
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function AppearanceSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.appearance);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('appearance', formData);
  };
  
  const colorPresets = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Pink', value: '#ec489a' },
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, theme: 'light' })}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              formData.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">Light</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, theme: 'dark' })}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              formData.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2 text-slate-700" />
            <p className="text-sm font-medium">Dark</p>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, theme: 'system' })}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              formData.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2 text-slate-500" />
            <p className="text-sm font-medium">System</p>
          </button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Colors</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Primary Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
              <div className="flex gap-2 flex-wrap">
                {colorPresets.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, primaryColor: color.value })}
                    className="w-8 h-8 rounded-full border-2 border-slate-200 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Secondary Color
            </label>
            <input
              type="color"
              value={formData.secondaryColor}
              onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
              className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Accent Color
            </label>
            <input
              type="color"
              value={formData.accentColor}
              onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
              className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Layout & Display</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Font Size
            </label>
            <div className="flex gap-3">
              {(['small', 'medium', 'large'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFormData({ ...formData, fontSize: size })}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    formData.fontSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.animations}
              onChange={(e) => setFormData({ ...formData, animations: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Enable animations</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.compactView}
              onChange={(e) => setFormData({ ...formData, compactView: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Compact view (reduce spacing)</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function NotificationSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.notifications);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('notifications', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Channels</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={formData.emailNotifications}
              onChange={(e) => setFormData({ ...formData, emailNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">SMS Notifications</p>
              <p className="text-sm text-slate-500">Receive notifications via SMS</p>
            </div>
            <input
              type="checkbox"
              checked={formData.smsNotifications}
              onChange={(e) => setFormData({ ...formData, smsNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Push Notifications</p>
              <p className="text-sm text-slate-500">Receive browser push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={formData.pushNotifications}
              onChange={(e) => setFormData({ ...formData, pushNotifications: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Notification Types</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.appointmentReminders}
              onChange={(e) => setFormData({ ...formData, appointmentReminders: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Appointment reminders</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.testResultsReady}
              onChange={(e) => setFormData({ ...formData, testResultsReady: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Test results ready</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.newMessages}
              onChange={(e) => setFormData({ ...formData, newMessages: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">New messages</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.systemAlerts}
              onChange={(e) => setFormData({ ...formData, systemAlerts: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">System alerts</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.marketingEmails}
              onChange={(e) => setFormData({ ...formData, marketingEmails: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Marketing emails</span>
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function SecuritySettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.security);
  const [showApiKeys, setShowApiKeys] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('security', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Authentication</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Two-Factor Authentication (2FA)</p>
              <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={formData.twoFactorAuth}
              onChange={(e) => setFormData({ ...formData, twoFactorAuth: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={formData.sessionTimeout}
                onChange={(e) => setFormData({ ...formData, sessionTimeout: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password Expiry (days)
              </label>
              <input
                type="number"
                value={formData.passwordExpiryDays}
                onChange={(e) => setFormData({ ...formData, passwordExpiryDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Login Attempts
              </label>
              <input
                type="number"
                value={formData.maxLoginAttempts}
                onChange={(e) => setFormData({ ...formData, maxLoginAttempts: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Audit Log Retention (days)
              </label>
              <input
                type="number"
                value={formData.auditLogRetention}
                onChange={(e) => setFormData({ ...formData, auditLogRetention: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.requireStrongPassword}
              onChange={(e) => setFormData({ ...formData, requireStrongPassword: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Require strong passwords (uppercase, lowercase, numbers, symbols)</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Access Control</h3>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            IP Whitelist
          </label>
          <div className="space-y-2">
            {formData.ipWhitelist.map((ip, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ip}
                  onChange={(e) => {
                    const newList = [...formData.ipWhitelist];
                    newList[index] = e.target.value;
                    setFormData({ ...formData, ipWhitelist: newList });
                  }}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newList = formData.ipWhitelist.filter((_, i) => i !== index);
                    setFormData({ ...formData, ipWhitelist: newList });
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, ipWhitelist: [...formData.ipWhitelist, ''] })}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add IP Address
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function SystemSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.system);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('system', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Language
          </label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Timezone
          </label>
          <select
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value as Timezone })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="UTC">UTC</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="IST">IST</option>
            <option value="GMT">GMT</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Date Format
          </label>
          <select
            value={formData.dateFormat}
            onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value as DateFormat })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Time Format
          </label>
          <select
            value={formData.timeFormat}
            onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value as TimeFormat })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="12h">12-hour (AM/PM)</option>
            <option value="24h">24-hour</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Currency
          </label>
          <input
            type="text"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First Day of Week
          </label>
          <select
            value={formData.firstDayOfWeek}
            onChange={(e) => setFormData({ ...formData, firstDayOfWeek: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="0">Sunday</option>
            <option value="1">Monday</option>
            <option value="6">Saturday</option>
          </select>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">System Mode</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Maintenance Mode</p>
              <p className="text-sm text-slate-500">Put the system in maintenance mode (only admins can access)</p>
            </div>
            <input
              type="checkbox"
              checked={formData.maintenanceMode}
              onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Debug Mode</p>
              <p className="text-sm text-slate-500">Enable debug logging and error details</p>
            </div>
            <input
              type="checkbox"
              checked={formData.debugMode}
              onChange={(e) => setFormData({ ...formData, debugMode: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function IntegrationSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.integrations);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('integrations', formData);
  };
  
  const handleAddApiKey = () => {
    const newKey = {
      id: Date.now().toString(),
      name: 'New API Key',
      key: 'sk_' + Math.random().toString(36).substr(2, 24),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setFormData({ ...formData, apiKeys: [...formData.apiKeys, newKey] });
  };
  
  const handleDeleteApiKey = (id: string) => {
    setFormData({
      ...formData,
      apiKeys: formData.apiKeys.filter(key => key.id !== id),
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Third-Party Integrations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Provider
            </label>
            <select
              value={formData.emailProvider}
              onChange={(e) => setFormData({ ...formData, emailProvider: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="SMTP">SMTP</option>
              <option value="SendGrid">SendGrid</option>
              <option value="Mailgun">Mailgun</option>
              <option value="AWS SES">AWS SES</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              SMS Provider
            </label>
            <select
              value={formData.smsProvider}
              onChange={(e) => setFormData({ ...formData, smsProvider: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="Twilio">Twilio</option>
              <option value="Vonage">Vonage</option>
              <option value="AWS SNS">AWS SNS</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Gateway
            </label>
            <select
              value={formData.paymentGateway}
              onChange={(e) => setFormData({ ...formData, paymentGateway: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="Stripe">Stripe</option>
              <option value="PayPal">PayPal</option>
              <option value="Razorpay">Razorpay</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.labIntegration}
              onChange={(e) => setFormData({ ...formData, labIntegration: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Enable Laboratory Integration</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.pharmacyIntegration}
              onChange={(e) => setFormData({ ...formData, pharmacyIntegration: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Enable Pharmacy Integration</span>
          </label>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.insuranceIntegration}
              onChange={(e) => setFormData({ ...formData, insuranceIntegration: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-sm text-slate-700">Enable Insurance Integration</span>
          </label>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">API Keys</h3>
        <div className="space-y-3">
          {formData.apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{apiKey.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <code className="text-xs text-slate-600">
                    {showKey[apiKey.id] ? apiKey.key : '•'.repeat(20)}
                  </code>
                  <button
                    type="button"
                    onClick={() => setShowKey({ ...showKey, [apiKey.id]: !showKey[apiKey.id] })}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showKey[apiKey.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-1">Created: {apiKey.createdAt}</p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteApiKey(apiKey.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddApiKey}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Generate New API Key
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

function BillingSettings({ settings, onUpdate }: { settings: SettingsData; onUpdate: (section: string, data: any) => void }) {
  const [formData, setFormData] = useState(settings.billing);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate('billing', formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{formData.plan} Plan</h3>
            <p className="text-sm text-slate-600">Your current subscription</p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-slate-500">Subscription ID</p>
            <p className="text-sm font-medium text-slate-900">{formData.subscriptionId}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Next Billing Date</p>
            <p className="text-sm font-medium text-slate-900">{new Date(formData.nextBillingDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Payment Method</p>
            <p className="text-sm font-medium text-slate-900">{formData.paymentMethod}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Billing Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Invoice Email
            </label>
            <input
              type="email"
              value={formData.invoiceEmail}
              onChange={(e) => setFormData({ ...formData, invoiceEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tax ID / GST
            </label>
            <input
              type="text"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          type="button"
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
        >
          Download Invoice
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4 inline mr-2" />
          Save Changes
        </button>
      </div>
    </form>
  );
}

// Main Component
export default function AdminSettings() {
  const [settings, setSettings] = useState<SettingsData>(mockSettings);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'system', label: 'System', icon: Settings },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];
  
  const handleUpdate = (section: string, data: any) => {
    setSettings({ ...settings, [section]: data });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your system configuration and preferences</p>
          </div>
          {saveSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Settings saved successfully!</span>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="flex border-b border-slate-100 min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileSettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'appearance' && (
              <AppearanceSettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'notifications' && (
              <NotificationSettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'security' && (
              <SecuritySettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'system' && (
              <SystemSettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'integrations' && (
              <IntegrationSettings settings={settings} onUpdate={handleUpdate} />
            )}
            {activeTab === 'billing' && (
              <BillingSettings settings={settings} onUpdate={handleUpdate} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}