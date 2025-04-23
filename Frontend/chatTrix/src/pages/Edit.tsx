import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, UserRound, Globe, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";

interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  website: string;
  bio: string;
  email: string;
  profileImage: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
}

const ProfileEdit = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // First get the current user's username and email
        const meResponse = await api.get('/auth/me');
        const { username, email } = meResponse.data;
        
        // Then fetch the full profile data
        const profileResponse = await api.get(`/users/${username}`);
        const profileData = profileResponse.data;
        
        // Construct the full image URL
        const baseUrl = import.meta.env.VITE_API_URL || '';
        const imagePath = profileData.profileImage.startsWith('/') 
          ? profileData.profileImage 
          : `/${profileData.profileImage}`;
        const fullImageUrl = `${baseUrl}${imagePath}`;
        
        setProfileData({
          ...profileData,
          email,
          profileImage: fullImageUrl
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, or JPG)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('profileImage', file);

      console.log('Uploading file:', file.name, file.type, file.size); // Debug log

      const response = await api.put('/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Upload response:', response.data); // Debug log

      if (!response.data || !response.data.profileImage) {
        throw new Error('Invalid response from server');
      }

      // Fetch the updated profile data to ensure we have the latest state
      const updatedProfileResponse = await api.get(`/users/${profileData.username}`);
      const updatedProfile = updatedProfileResponse.data;

      // Update the profile image URL with the full path
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const imagePath = updatedProfile.profileImage.startsWith('/') 
        ? updatedProfile.profileImage 
        : `/${updatedProfile.profileImage}`;
      const fullImageUrl = `${baseUrl}${imagePath}`;
      
      console.log('Base URL:', baseUrl);
      console.log('Image Path:', imagePath);
      console.log('Full Image URL:', fullImageUrl);
      
      // Update the profile data with the complete updated profile
      setProfileData(prev => prev ? { 
        ...prev, 
        ...updatedProfile,
        profileImage: fullImageUrl 
      } : null);

      // Force a re-render of the image
      const img = document.querySelector('.avatar-image') as HTMLImageElement;
      if (img) {
        img.src = fullImageUrl;
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully",
      });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          "Failed to upload profile picture. Please try again.";
      
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profileData) return;
    
    setIsSaving(true);
    
    try {
      const response = await api.put('/users/profile', {
        fullName: profileData.fullName,
        bio: profileData.bio,
        website: profileData.website
      });

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
        duration: 3000,
      });
      
      navigate(`/profile/${profileData.username}`);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Update failed",
        description: "We couldn't update your profile. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load profile data</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Card className="mt-10 shadow-lg">
            <CardContent className="space-y-6 pt-6">
              <div>
                <h2 className="text-xl text-blue-600 font-semibold text-center text-foreground md:text-left">
                  Edit Your Profile
                </h2>
              </div>

              <div className="space-y-8 px-4 py-6 sm:px-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-2 border-border bg-background">
                      <AvatarImage 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="object-cover w-full h-full avatar-image"
                        onError={(e) => {
                          console.error('Image load error:', e);
                          console.error('Failed to load image URL:', profileData.profileImage);
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                      <AvatarFallback className="bg-muted text-foreground">
                        {profileData.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="relative"
                      disabled={isUploading}
                    >
                      <label htmlFor="profile-picture" className="cursor-pointer flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        Change Picture
                        <input
                          id="profile-picture"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </Button>

                    {profileData.profileImage && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={async () => {
                          try {
                            setIsUploading(true);
                            await api.put('/users/profile-picture', {
                              remove: true
                            });
                            
                            setProfileData(prev => prev ? { ...prev, profileImage: '' } : null);
                            
                            toast({
                              title: "Profile picture removed",
                              description: "Your profile picture has been removed successfully",
                            });
                          } catch (error) {
                            console.error("Error removing profile picture:", error);
                            toast({
                              title: "Error",
                              description: "Failed to remove profile picture. Please try again.",
                              variant: "destructive",
                            });
                          } finally {
                            setIsUploading(false);
                          }
                        }}
                        disabled={isUploading}
                      >
                        Remove Picture
                      </Button>
                    )}
                  </div>
                </div>

                <Card className="border border-border/50">
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="username" className="font-medium">Username</Label>
                        </div>
                        <Input
                          id="username"
                          name="username"
                          value={profileData.username}
                          className="max-w-md"
                          placeholder="username"
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Username cannot be changed
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleInputChange}
                          className="max-w-md"
                          placeholder="Your full name"
                        />
                        <p className="text-xs text-muted-foreground">
                          Name visible on your profile. Use your real name to help people discover you.
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="website" className="font-medium">Website</Label>
                        </div>
                        <Input
                          id="website"
                          name="website"
                          value={profileData.website}
                          onChange={handleInputChange}
                          className="max-w-md"
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="email" className="font-medium">Email</Label>
                        </div>
                        <Input
                          id="email"
                          name="email"
                          value={profileData.email}
                          className="max-w-md"
                          placeholder="your@email.com"
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed
                        </p>
                      </div>

                      <div className="grid gap-2">
                        <div className="flex items-center gap-2">
                          <UserRound className="h-4 w-4 text-muted-foreground" />
                          <Label htmlFor="bio" className="font-medium">Bio</Label>
                        </div>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profileData.bio}
                          onChange={handleInputChange}
                          className="max-w-md"
                          placeholder="Tell us about yourself"
                          maxLength={150}
                        />
                        <p className="text-xs text-muted-foreground">
                          {profileData.bio.length}/150 characters
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfileEdit;