import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Bell, Lock, Palette } from "lucide-react"; // Added Palette icon
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

// Import new modular components
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";
import PreferencesSettings from "@/components/settings/PreferencesSettings"; // New import

const Settings = () => {
  const { user, isGuest, signOut } = useAuth();
  const { profile, saveProfile, loading: profileLoading } = useProfile();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile and app preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8"> {/* Updated grid-cols to 4 */}
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2"> {/* New tab */}
              <Palette className="h-4 w-4" /> Preferences
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> Account
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Settings Tab Content */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettingsForm
              user={user}
              isGuest={isGuest}
              profileData={profile}
              profileLoading={profileLoading}
              saveProfile={saveProfile}
            />
          </TabsContent>
          
          {/* Notifications Settings Tab Content */}
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings
              user={user}
              isGuest={isGuest}
              profileLoading={profileLoading}
            />
          </TabsContent>

          {/* Preferences Settings Tab Content (New) */}
          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSettings
              isGuest={isGuest}
              profileLoading={profileLoading}
            />
          </TabsContent>
          
          {/* Account Settings Tab Content */}
          <TabsContent value="account" className="space-y-6">
            <AccountSettings
              user={user}
              isGuest={isGuest}
              profileLoading={profileLoading}
              signOut={signOut}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;