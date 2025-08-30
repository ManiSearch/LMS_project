import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, Settings, Shield, Bell, Mail, Phone, MapPin, Calendar, 
  Edit, Save, Upload, Eye, EyeOff, Lock, Key, AlertCircle, CheckCircle,
  Camera, Trash2, Plus, Download, FileText, Globe, Languages,
  Palette, Moon, Sun, Monitor, Volume2, VolumeX, Smartphone,
  CreditCard, Archive, History, Database
} from 'lucide-react';

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  dateOfBirth: string;
  gender: string;
  avatar: string;
  role: string;
  department: string;
  joinDate: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    soundEnabled: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    loginHistory: Array<{
      date: string;
      device: string;
      location: string;
      success: boolean;
    }>;
  };
}

export default function ProfileSettings() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // Mock user profile data with CRUD operations
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: authUser?.id || '1',
    firstName: authUser?.name?.split(' ')[0] || 'Manikandan',
    lastName: authUser?.name?.split(' ')[1] || 'S',
    email: authUser?.email || 'manikandan.s@edu.com',
    phone: '+91 9876543210',
    address: '123 Tech Street',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    postalCode: '600001',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    avatar: authUser?.avatar || '',
    role: authUser?.role || 'Admin',
    department: 'Computer Science',
    joinDate: '2020-01-15',
    emergencyContact: {
      name: 'Priya S',
      phone: '+91 9876543211',
      relationship: 'Spouse'
    },
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
      passwordLastChanged: '2024-01-15',
      loginHistory: [
        { date: '2024-01-20T10:30:00', device: 'Chrome on Windows', location: 'Chennai, India', success: true },
        { date: '2024-01-19T09:15:00', device: 'Mobile App', location: 'Chennai, India', success: true },
        { date: '2024-01-18T14:45:00', device: 'Firefox on Linux', location: 'Chennai, India', success: false },
        { date: '2024-01-17T11:20:00', device: 'Chrome on Windows', location: 'Chennai, India', success: true },
      ]
    }
  });

  const [originalProfile, setOriginalProfile] = useState<UserProfile>(userProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // CRUD Operations
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOriginalProfile({...userProfile});
      setIsEditing(false);
      // Show success notification
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setUserProfile({...originalProfile});
    setIsEditing(false);
  };

  const handleUpdatePreference = (key: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleUpdateSecurity = (key: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value
      }
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleUpdateSecurity('passwordLastChanged', new Date().toISOString().split('T')[0]);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordChange(false);
      console.log('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserProfile(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getInitials = () => {
    return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancelEdit}>
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
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" asChild disabled={!isEditing}>
                        <span>
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Photo
                        </span>
                      </Button>
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    {userProfile.avatar && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setUserProfile(prev => ({...prev, avatar: ''}))}
                        disabled={!isEditing}
                      >
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

              <Separator />

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="font-medium">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={userProfile.emergencyContact.name}
                      onChange={(e) => setUserProfile(prev => ({
                        ...prev,
                        emergencyContact: {...prev.emergencyContact, name: e.target.value}
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={userProfile.emergencyContact.phone}
                      onChange={(e) => setUserProfile(prev => ({
                        ...prev,
                        emergencyContact: {...prev.emergencyContact, phone: e.target.value}
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelationship">Relationship</Label>
                    <Input
                      id="emergencyRelationship"
                      value={userProfile.emergencyContact.relationship}
                      onChange={(e) => setUserProfile(prev => ({
                        ...prev,
                        emergencyContact: {...prev.emergencyContact, relationship: e.target.value}
                      }))}
                      disabled={!isEditing}
                    />
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
                      onClick={() => handleUpdatePreference('theme', theme.value)}
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

              {/* Language & Region */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Language & Region
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select 
                      value={userProfile.preferences.language}
                      onValueChange={(value) => handleUpdatePreference('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Tamil">Tamil</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select 
                      value={userProfile.preferences.timezone}
                      onValueChange={(value) => handleUpdatePreference('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                        onCheckedChange={(checked) => handleUpdatePreference(setting.key, checked)}
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
                  <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                          Enter your current password and choose a new one
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({...prev, currentPassword: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({...prev, newPassword: e.target.value}))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({...prev, confirmPassword: e.target.value}))}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handlePasswordChange} disabled={isSaving}>
                            {isSaving ? 'Changing...' : 'Change Password'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
                      onCheckedChange={(checked) => handleUpdateSecurity('twoFactorEnabled', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Data */}
              <div className="space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Account Data
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Download My Data
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="justify-start">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
                  {userProfile.security.loginHistory.map((login, index) => (
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

              <Separator />

              {/* Sessions */}
              <div className="space-y-4">
                <h3 className="font-medium">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100 text-green-600">
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium">Current Session</div>
                        <div className="text-sm text-muted-foreground">Chrome on Windows • Chennai, India</div>
                      </div>
                    </div>
                    <Badge variant="default">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
