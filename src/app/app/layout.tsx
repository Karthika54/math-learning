'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LayoutDashboard, BarChart2, LogOut, User, Award, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { AiChatAssistant } from '@/components/ai-chat-assistant';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-secondary">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Logo />
          <Link href="/app/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/app/progress" className="text-muted-foreground transition-colors hover:text-foreground">
            Progress
          </Link>
          <Link href="/app/badges" className="text-muted-foreground transition-colors hover:text-foreground">
            Badges
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial">
             {/* Future search bar can go here */}
          </div>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 bg-secondary">
        {children}
        <AiChatAssistant />
      </main>
    </div>
  );
}

function UserMenu() {
    const { user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                    <AvatarImage src={user?.photoURL || `https://placehold.co/40x40`} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.displayName || user?.email || 'My Account'}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/app/progress" className="flex items-center w-full">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>Progress</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href="/app/badges" className="flex items-center w-full">
                        <Award className="mr-2 h-4 w-4" />
                        <span>Badges</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
