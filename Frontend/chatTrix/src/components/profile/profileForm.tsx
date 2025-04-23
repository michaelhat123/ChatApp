import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfilePictureUpload } from "./ProfilePictureUploads.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { 
  UserRound, 
  Globe, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Link as LinkIcon 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  username: string;
  fullName: string;
  website: string;
  bio: string;
  email: string;
  profileImage: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onDataChange: (data: ProfileData) => void;
}

export function ProfileForm({ initialData, onDataChange }: ProfileFormProps) {
  const [formData, setFormData] = useState<ProfileData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newData = { ...formData, [name]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleProfilePictureChange = (newImageUrl: string) => {
    const newData = { ...formData, profileImage: newImageUrl };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="space-y-8 px-4 py-6 sm:px-6">
      <div className="flex flex-col items-center justify-center">
        <ProfilePictureUpload
          currentImage={formData.profileImage}
          onChange={handleProfilePictureChange}
        />
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
                value={formData.username}
                onChange={handleInputChange}
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
                value={formData.fullName}
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
                value={formData.website}
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
                value={formData.email}
                onChange={handleInputChange}
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
                value={formData.bio}
                onChange={handleInputChange}
                className="max-w-md"
                placeholder="Tell us about yourself"
                maxLength={150}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/150 characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}