import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, Settings, Shield, Bell, Mail, Phone, MapPin, Calendar, 
  Edit, Save, Upload, Eye, EyeOff, Lock, Key, AlertCircle, CheckCircle,
  Camera, Trash2, Plus, Download, FileText, Globe, Languages,
  Palette, Moon, Sun, Monitor, Volume2, VolumeX, Smartphone,
  CreditCard, Archive, History, Database
} from 'lucide-react';

export default function ProfileDemo() {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Demo profile data
  const [userProfile, setUserProfile] = useState({
    firstName: 'Manikandan',
    lastName: 'S',
    email: 'manikandan.s@edu.com',
    phone: '+91 9876543210',
    address: '123 Tech Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    postalCode: '600001',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    avatar: '',
    role: 'Admin',
    department: 'Computer Science',
    joinDate: '2020-01-15',
    preferences: {
      theme: 'system',
      language: 'English',
      timezone: 'Asia/Kolkata',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      soundEnabled: true
    },
    security: {
      twoFactorEnabled: false,
      passwordLastChanged: '2024-01-15'
    }
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsEditing(false);
    setIsSaving(false);
    console.log('Profile updated successfully');
  };

  const getInitials = () => {
    return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile Settings Demo</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                  <Save className="h-4 w-4 ml-2" />
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={userProfile.avatar} />
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="font-medium">Profile Picture</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled={!isEditing}>
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                      {userProfile.avatar && (
                        <Button variant="outline" size="sm" disabled={!isEditing}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.firstName}
                      onChange={(e) => setUserProfile(prev => ({...prev, firstName: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.lastName}
                      onChange={(e) => setUserProfile(prev => ({...prev, lastName: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) => setUserProfile(prev => ({...prev, email: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile(prev => ({...prev, phone: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={userProfile.dateOfBirth}
                      onChange={(e) => setUserProfile(prev => ({...prev, dateOfBirth: e.target.value}))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={userProfile.gender} 
                      onValueChange={(value) => setUserProfile(prev => ({...prev, gender: value}))}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="font-medium">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Textarea
                        id="address"
                        value={userProfile.address}
                        onChange={(e) => setUserProfile(prev => ({...prev, address: e.target.value}))}
                        disabled={!isEditing}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={userProfile.city}
                          onChange={(e) => setUserProfile(prev => ({...prev, city: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            value={userProfile.state}
                            onChange={(e) => setUserProfile(prev => ({...prev, state: e.target.value}))}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={userProfile.postalCode}
                            onChange={(e) => setUserProfile(prev => ({...prev, postalCode: e.target.value}))}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={userProfile.country}
                          onChange={(e) => setUserProfile(prev => ({...prev, country: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <Separator />
                <div className="space-y-4">
                  <h3 className="font-medium">Professional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Input value={userProfile.role} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={userProfile.department} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Join Date</Label>
                      <Input value={userProfile.joinDate} disabled />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Preferences</CardTitle>
                <CardDescription>Customize your app experience and notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme & Appearance
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: Monitor }
                    ].map((theme) => (
                      <Card 
                        key={theme.value}
                        className={`cursor-pointer transition-colors ${
                          userProfile.preferences.theme === theme.value 
                            ? 'border-primary bg-primary/5' 
                            : 'hover:border-muted-foreground/20'
                        }`}
                        onClick={() => setUserProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, theme: theme.value }
                        }))}
                      >
                        <CardContent className="p-4 flex flex-col items-center gap-2">
                          <theme.icon className="h-6 w-6" />
                          <span className="text-sm font-medium">{theme.label}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    Notification Preferences
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        key: 'emailNotifications',
                        label: 'Email Notifications',
                        description: 'Receive notifications via email',
                        icon: Mail
                      },
                      {
                        key: 'pushNotifications',
                        label: 'Push Notifications',
                        description: 'Receive browser push notifications',
                        icon: Bell
                      },
                      {
                        key: 'smsNotifications',
                        label: 'SMS Notifications',
                        description: 'Receive notifications via SMS',
                        icon: Smartphone
                      },
                      {
                        key: 'soundEnabled',
                        label: 'Sound Effects',
                        description: 'Play sounds for notifications and interactions',
                        icon: Volume2
                      }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <setting.icon className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{setting.label}</div>
                            <div className="text-sm text-muted-foreground">{setting.description}</div>
                          </div>
                        </div>
                        <Switch
                          checked={userProfile.preferences[setting.key]}
                          onCheckedChange={(checked) => setUserProfile(prev => ({
                            ...prev,
                            preferences: { ...prev.preferences, [setting.key]: checked }
                          }))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and privacy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Section */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password Management
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Password</div>
                      <div className="text-sm text-muted-foreground">
                        Last changed: {new Date(userProfile.security.passwordLastChanged).toLocaleDateString()}
                      </div>
                    </div>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Two Factor Authentication */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Two-Factor Authentication
                  </h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={userProfile.security.twoFactorEnabled ? 'default' : 'secondary'}>
                        {userProfile.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Switch
                        checked={userProfile.security.twoFactorEnabled}
                        onCheckedChange={(checked) => setUserProfile(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactorEnabled: checked }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Activity</CardTitle>
                <CardDescription>Monitor your account activity and login history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Login History */}
                <div className="space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Recent Login Activity
                  </h3>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-20T10:30:00', device: 'Chrome on Windows', location: 'Chennai, India', success: true },
                      { date: '2024-01-19T09:15:00', device: 'Mobile App', location: 'Chennai, India', success: true },
                      { date: '2024-01-18T14:45:00', device: 'Firefox on Linux', location: 'Chennai, India', success: false },
                    ].map((login, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${login.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {login.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="font-medium">{login.device}</div>
                            <div className="text-sm text-muted-foreground">{login.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">{new Date(login.date).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(login.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
