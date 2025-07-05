'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/context/SettingsContext';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required.' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters.' }),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "New passwords don't match",
  path: ['confirmPassword'],
});

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const { grade, setGrade } = useSettings();

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
    },
    values: {
      name: user?.displayName || '',
      email: user?.email || '',
    }
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleProfileUpdate = async (values: z.infer<typeof profileFormSchema>) => {
    if (!user) return;
    setIsProfileLoading(true);
    try {
      await updateProfile(user, { displayName: values.name });
      toast({
        title: 'Success',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (values: z.infer<typeof passwordFormSchema>) => {
    if (!user || !user.email) return;
    setIsPasswordLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, values.currentPassword);
      // Re-authenticate user before updating password for security
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, values.newPassword);
      toast({
        title: 'Success',
        description: 'Your password has been changed.',
      });
      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: 'Password Change Failed',
        description: error.code === 'auth/wrong-password' ? 'The current password you entered is incorrect.' : error.message,
        variant: 'destructive',
      });
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleGradeUpdate = (newGrade: string) => {
    setGrade(newGrade);
    toast({
      title: 'Success',
      description: 'Your grade level has been updated.',
    });
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length > 1) {
        return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  const userInitials = user ? getInitials(user.displayName || user.email) : 'U';

  return (
    <div className="container mx-auto max-w-4xl px-0 md:px-4">
      <div className="flex items-center gap-4 mb-8">
        <UserCircle className="w-8 h-8 text-primary" />
        <div>
            <h1 className="text-2xl md:text-3xl font-bold font-headline">Your Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and set your password.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="neumorphism-card">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                    <AvatarFallback className="text-3xl">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                    <h2 className="text-xl font-semibold">{user?.displayName}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
            </div>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                <FormField
                  control={profileForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isProfileLoading}>
                  {isProfileLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </form>
            </Form>

            <div className="space-y-2 pt-4 border-t">
              <Label>Grade Level</Label>
              <Select value={grade} onValueChange={handleGradeUpdate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your grade" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(7)].map((_, i) => {
                    const gradeValue = i + 4;
                    return <SelectItem key={gradeValue} value={String(gradeValue)}>{gradeValue}th Grade</SelectItem>
                  })}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                This helps us tailor content to your learning level.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="neumorphism-card">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Choose a new password for your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPasswordLoading}>
                  {isPasswordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
