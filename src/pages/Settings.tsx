import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCog, Bell, Lock } from "lucide-react"; // Removed Palette icon
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

// Import new modular components
import ProfileSettingsForm from "@/components/settings/ProfileSettingsForm";
import NotificationSettings from "@/components/settings/NotificationSettings";
import AccountSettings from "@/components/settings/AccountSettings";

const Settings = () => {
  const { user, isGuest, signOut } = useAuth();
  const { profile, saveProfile, loading: profileLoading, isSaving } = useProfile(); // Get isSaving

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
          <TabsList className="grid grid-cols-3 mb-8"> {/* Updated grid-cols to 3 */}
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            {/* Removed Preferences tab trigger */}
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
              isSaving={isSaving} {/* Pass isSaving prop */}
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

          {/* Removed Preferences Settings Tab Content */}
          
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