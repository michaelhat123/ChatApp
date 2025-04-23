import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '../ui/theme-provider.tsx';
import { Bell, Menu } from 'lucide-react';
import {
    Home,
    Flag,
    Search,
    Film,
    MessageCircle,
    Moon,
    Sun,
    LogOut,
    User,
    Settings
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    // !! IMPORTANT: Ensure these sub-components are correctly installed
    // !! via the Shadcn UI CLI if you are using them for nested menus.
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { cn, generateColorFromString } from '@/lib/utils';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const [notifications, setNotifications] = useState(3); // Example notification count
    const [messages, setMessages] = useState(3); // Example message count
    const location = useLocation(); // Get current location
    const [profileImage, setProfileImage] = useState(user?.profileImage || '');
    const [userInitials, setUserInitials] = useState('??');

    // Update profile image and initials when user changes
    useEffect(() => {
        if (user) {
            // Update initials
            const initials = user.fullName
                ?.split(' ')
                .map(name => name?.[0] || '')
                .join('')
                .toUpperCase() || '??';
            setUserInitials(initials);

            if (user.profileImage) {
                const baseUrl = import.meta.env.VITE_API_URL || '';
                const imagePath = user.profileImage.startsWith('/') 
                    ? user.profileImage 
                    : `/${user.profileImage}`;
                const fullImageUrl = `${baseUrl}${imagePath}`;
                
                // Test if the image exists before setting it
                const img = new Image();
                img.onload = () => {
                    setProfileImage(fullImageUrl);
                };
                img.onerror = () => {
                    console.error('Profile image failed to load:', fullImageUrl);
                    // Use ui-avatars.com as fallback with consistent color
                    const color = generateColorFromString(user.username);
                    setProfileImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.substring(1)}`);
                };
                img.src = fullImageUrl;
            } else {
                // Use ui-avatars.com as default with consistent color
                const color = generateColorFromString(user.username);
                setProfileImage(`https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color.substring(1)}`);
            }
        }
    }, [user?.profileImage, user?.fullName, user?.username]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Don't render the navbar if user is not logged in
    if (!user) return null;

    return (
        <nav
            className={cn(
                isMobile
                    ? 'fixed bottom-0 left-0 right-0 border-t bg-background border-border z-10 flex flex-row justify-around items-center py-2 md:hidden'
                    : 'fixed left-0 top-0 h-screen w-16 md:w-64 border-r bg-background border-border z-10 flex flex-col p-4',
                'transition-all duration-300 ease-in-out'
            )}
        >
            {isMobile ? (
                // Mobile Layout
                <div className="flex justify-around w-full">
                    <NavItem key="nav-home-mobile" to="/" icon={<Home />} notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/'} />
                    <NavItem key="nav-explore-mobile" to="/search" icon={<Search />} notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/explore'} />
                    <NavItem key="nav-reels-mobile" to="/reels" icon={<Film />} notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/reels'} />
                    <NavItem key="nav-notifications-mobile" to="/notifications" icon={<Bell />} notificationCount={notifications} isMobile={isMobile} isActive={location.pathname === '/notifications'} />
                    <NavItem key="nav-chat-mobile" to="/chat" icon={<MessageCircle />} notificationCount={messages} isMobile={isMobile} isActive={location.pathname === '/chat'} />
                    <NavItem
                        key="nav-profile-mobile"
                        to={`/profile/${user?.username}`}
                        icon={
                            <Avatar className="h-6 w-6">
                                <AvatarImage 
                                    src={profileImage} 
                                    alt={user?.username || ''}
                                    onError={(e) => {
                                        console.error('Profile image load error:', e);
                                        const color = generateColorFromString(user?.username || '');
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=${color.substring(1)}`;
                                    }}
                                    className="object-cover"
                                />
                                <AvatarFallback className="bg-muted text-foreground">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                        }
                        notificationCount={0}
                        isMobile={isMobile}
                        isActive={location.pathname.startsWith(`/profile/${user?.username}`)}
                    />
                </div>
            ) : (
                // Desktop Layout
                <div className="flex flex-col h-full">
                    <div className="px-4 mb-8 mt-2">
                        <h1
                            className="text-xl font-bold md:block hidden font-serif italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{
                                letterSpacing: '0.1em',
                            }}
                        >
                            ChatTrix
                        </h1>
                        <span className="md:hidden text-2xl font-bold text-primary">Ct</span>
                    </div>

                    {/* Navigation Items List */}
                    <div className="flex-1 space-y-4 px-2">
                        <NavItem key="nav-home-desktop" to="/" icon={<Home />} label="Home" notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/'} />
                        <NavItem key="nav-explore-desktop" to="/search" icon={<Search />} label="Search" notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/explore'} />
                        <NavItem key="nav-reels-desktop" to="/reels" icon={<Film />} label="Reels" notificationCount={0} isMobile={isMobile} isActive={location.pathname === '/reels'} />
                        <NavItem key="nav-notifications-desktop" to="/notifications" icon={<Bell />} label="Notifications" notificationCount={notifications} isMobile={isMobile} isActive={location.pathname === '/notifications'} />
                        <NavItem key="nav-chat-desktop" to="/chat" icon={<MessageCircle />} label="Messages" notificationCount={messages} isMobile={isMobile} isActive={location.pathname === '/chat'} />
                        <NavItem
                            key="nav-profile-desktop"
                            to={`/profile/${user?.username}`}
                            icon={
                                <Avatar className="h-6 w-6">
                                    <AvatarImage 
                                        src={profileImage} 
                                        alt={user?.username || ''}
                                        onError={(e) => {
                                            console.error('Profile image load error:', e);
                                            const color = generateColorFromString(user?.username || '');
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userInitials)}&background=${color.substring(1)}`;
                                        }}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-muted text-foreground">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            }
                            label="Profile"
                            notificationCount={0}
                            isMobile={isMobile}
                            isActive={location.pathname.startsWith(`/profile/${user?.username}`)}
                        />
                    </div>

                    {/* More Options Dropdown */}
                    <div className="mt-auto p-2">
                        <DropdownMenu key="dropdown-menu-desktop">
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="lg" className="w-full justify-start text-lg flex items-center px-2 transition-colors duration-200 hover:bg-muted">
                                    <Menu style={{ width: '30px', height: '30px' }} className="mr-1"/>
                                    <span className="hidden md:inline">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start" className="w-56 rounded-md shadow-lg p-2 bg-background border border-border">
                                {/* !! Debugging Tip: Temporarily comment out items below and add <DropdownMenuItem>Test</DropdownMenuItem> */}
                                {/* !! If the dropdown appears, the issue is in one of the items below. */}
                                <DropdownMenuItem
                                    key="menu-report-desktop"
                                    onClick={() => console.log('Report')} // Replace with actual functionality
                                    className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-2 cursor-pointer"
                                >
                                    <Flag className="h-4 w-4" />
                                    <span>Report</span>
                                </DropdownMenuItem>
                                <DropdownMenuSub key="menu-appearances-desktop">
                                    {/* !! IMPORTANT: Ensure DropdownMenuSubTrigger is installed */}
                                    <DropdownMenuSubTrigger className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-2 cursor-pointer">
                                        {theme === 'dark' ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4'></Sun>}
                                        <span>Switch Appearances</span>
                                    </DropdownMenuSubTrigger>
                                    {/* !! IMPORTANT: Ensure DropdownMenuSubContent is installed */}
                                    <DropdownMenuSubContent className="w-48 rounded-md shadow-lg p-2 bg-background border border-border">
                                        <DropdownMenuItem
                                            key="menu-light-desktop"
                                            onClick={() => setTheme('light')}
                                            className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-2 cursor-pointer"
                                        >
                                            <Sun className="h-4 w-4" />
                                            <span>Light Mode</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            key="menu-dark-desktop"
                                            onClick={() => setTheme('dark')}
                                            className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-2 cursor-pointer"
                                        >
                                            <Moon className="h-4 w-4" />
                                            <span>Dark Mode</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                                <DropdownMenuItem
                                    key="menu-switch-accounts-desktop"
                                    onClick={() => console.log('Switch Accounts')} // Replace with actual functionality
                                    className="flex items-center space-x-2 hover:bg-muted rounded-md px-2 py-2 cursor-pointer"
                                >
                                    <User className="h-4 w-4" />
                                    <span>Switch Accounts</span>
                                </DropdownMenuItem>
                                {/* !! Debugging Tip: Temporarily change this Link to just text: <DropdownMenuItem>Settings Link Placeholder</DropdownMenuItem> */}
                                {/* !! If the dropdown appears, there might be an issue with the Link's 'to' prop or how it's rendering */}
                                <DropdownMenuItem asChild key="menu-settings-desktop" className="hover:bg-muted rounded-md px-2 py-2 cursor-pointer">
                                    <Link to="/settings" className="flex items-center space-x-2 w-full">
                                        <Settings className="h-4 w-4" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    key="menu-logout-desktop"
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 dark:hover:text-black rounded-md px-2 py-2 cursor-pointer"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            )}
        </nav>
    );
};

// Helper component for individual navigation items
const NavItem = ({
    to,
    icon,
    label,
    notificationCount,
    isMobile,
    isActive
}: {
    to: string;
    icon: React.ReactNode;
    label?: string;
    notificationCount?: number;
    isMobile: boolean;
    isActive: boolean;
}) => {
    return (
        <Link
            to={to}
            className={cn(
                "flex items-center rounded-md transition-all duration-200 ease-in-out group",
                isMobile ? "justify-center flex-col p-2" : "justify-start p-3 md:px-4",
                isActive && "bg-muted",
                "hover:bg-muted hover:translate-x-1 md:hover:translate-x-0",
                "relative overflow-visible"
            )}
        >
            {/* Icon */}
            <div className={cn(
                "relative",
                !isMobile && "w-6 h-6 flex items-center justify-center"
            )}>
                 {/* Added safety check before cloneElement */}
                 {icon && React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, {
                     className: cn((icon as React.ReactElement).props.className, 'h-6 w-6')
                 }) : icon}
                {/* Notification Badge */}
                {notificationCount !== undefined && notificationCount > 0 ? ( // Check for undefined explicitly
                    <Badge
                        variant="destructive"
                        className={cn(
                            "absolute rounded-full text-[10px] px-1 min-w-[16px] h-4 flex items-center justify-center",
                            isMobile ? "-top-1 -right-1" : "-top-2 -right-2",
                            "bg-red-800 text-white dark:text-black font-medium border-2 border-red-800 shadow-sm right-0 top-0",
                             "transform translate-x-1/4 -translate-y-1/4 "
                        )}
                    >
                        {notificationCount > 99 ? '99+' : notificationCount}
                    </Badge>
                ) : null}
            </div>
            {/* Label */}
            <span className={cn(
                'transition-opacity duration-200 ease-in-out',
                isMobile ? 'block text-xs mt-1 text-center opacity-100' : 'hidden md:inline-block md:ml-4 md:opacity-100',
                !isMobile && label === undefined && 'hidden' // Hide span entirely on desktop if no label
            )}>
                 {label} {/* Just render label if it exists */}
            </span>
        </Link>
    );
};

export default Navbar;