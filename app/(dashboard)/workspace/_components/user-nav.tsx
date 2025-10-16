'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAvatar } from '@/lib/get-avatar';
import { orpc } from '@/lib/orpc';
import { LogoutLink, PortalLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CreditCard, HelpCircle, LogOut, Settings, Shield, User } from 'lucide-react';

const UserNav = () => {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  console.log('User data:', user);
  console.log('User Picture:', user.picture);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-11 rounded-full hover:ring-2 hover:ring-primary/20 hover:ring-offset-2 transition-all duration-300 ease-out group"
        >
          <Avatar className="size-11 ring-2 ring-background group-hover:ring-primary/30 transition-all duration-300">
            <AvatarImage
              className="object-cover"
              src={getAvatar(user.picture, user.email!)}
              alt={user.given_name + "'s avatar"}
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold">
              {user.given_name?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="right"
        sideOffset={12}
        className="w-[240px] p-2 backdrop-blur-sm bg-background/95 border-border/50 shadow-xl"
      >
        <DropdownMenuLabel className="p-0 mb-2">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-accent/50 transition-colors duration-200">
            <Avatar className="size-10 ring-2 ring-primary/20">
              <AvatarImage
                className="object-cover"
                src={getAvatar(user.picture, user.email!)}
                alt={user.given_name + "'s avatar"}
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-semibold text-sm">
                {user.given_name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-foreground">{user.given_name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-md py-2.5 px-2 focus:bg-accent/80 transition-colors duration-150"
          >
            <PortalLink>
              <User className="mr-3 size-4 text-muted-foreground" />
              <span className="font-medium text-sm">My Account</span>
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer rounded-md py-2.5 px-2 focus:bg-accent/80 transition-colors duration-150"
          >
            <PortalLink>
              <CreditCard className="mr-3 size-4 text-muted-foreground" />
              <span className="font-medium text-sm">Billing</span>
            </PortalLink>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-2 focus:bg-accent/80 transition-colors duration-150">
            <Settings className="mr-3 size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-2 focus:bg-accent/80 transition-colors duration-150">
            <HelpCircle className="mr-3 size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Help & Support</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md py-2.5 px-2 focus:bg-accent/80 transition-colors duration-150">
            <Shield className="mr-3 size-4 text-muted-foreground" />
            <span className="font-medium text-sm">Privacy</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem asChild>
          <LogoutLink className="cursor-pointer rounded-md py-2.5 px-2 text-destructive focus:bg-destructive/10 focus:text-destructive transition-colors duration-150">
            <LogOut className="mr-3 size-4" />
            <span className="font-medium text-sm">Log Out</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNav;
