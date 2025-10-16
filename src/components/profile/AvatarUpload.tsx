"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, UploadCloud, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useProfile } from "@/hooks/useProfile";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  onAvatarChange: (newUrl: string | null) => void;
}

const AvatarUpload = ({ currentAvatarUrl, onAvatarChange }: AvatarUploadProps) => {
  const { user, isGuest } = useAuth();
  const { saveProfile, isSaving } = useProfile();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (isGuest || !user) {
      toast.error("Please log in or sign up to upload an avatar.");
      return;
    }
    if (!file) {
      toast.error("Please select an image to upload.");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`; // Store in a user-specific folder
    const filePath = `${fileName}`;

    try {
      // Upload the new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Overwrite if file with same path exists
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get public URL after upload.");
      }

      // Update the user's profile with the new avatar URL
      await saveProfile(user, { avatar_url: publicUrlData.publicUrl });
      onAvatarChange(publicUrlData.publicUrl);
      toast.success("Avatar uploaded successfully!");
      setFile(null); // Clear selected file
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Failed to upload avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (isGuest || !user || !currentAvatarUrl) {
      toast.error("No avatar to delete or you are not logged in.");
      return;
    }

    setUploading(true); // Use uploading state for deletion too
    try {
      // Extract the file path from the currentAvatarUrl
      const urlParts = currentAvatarUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('avatars') + 1).join('/');

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([filePath]);

      if (deleteError) {
        throw deleteError;
      }

      // Update the user's profile to remove the avatar URL
      await saveProfile(user, { avatar_url: null });
      onAvatarChange(null);
      toast.success("Avatar deleted successfully!");
    } catch (error: any) {
      console.error("Error deleting avatar:", error);
      toast.error(`Failed to delete avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const displayUserInitial = isGuest ? "G" : (user?.email ? user.email[0].toUpperCase() : "U");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload or change your avatar.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentAvatarUrl || undefined} alt="User Avatar" />
            <AvatarFallback className="text-3xl font-semibold">{displayUserInitial}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="avatar-upload">Upload new avatar</Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isGuest || uploading || isSaving}
            />
            {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleUpload}
            disabled={isGuest || !file || uploading || isSaving}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <UploadCloud className="mr-2 h-4 w-4" /> Upload
              </>
            )}
          </Button>
          {currentAvatarUrl && (
            <Button
              variant="destructive"
              onClick={handleDeleteAvatar}
              disabled={isGuest || uploading || isSaving}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Avatar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AvatarUpload;