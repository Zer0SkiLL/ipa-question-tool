"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function UserNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [authUser, setAuthUser] = useState<{ role: string; email: string }>({
    role: "",
    email: "",
  });
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthUser({
          role: session.user.role ?? "",
          email: session.user.email ?? "",
        });
      }
      setLoading(false);
    });
  }, [isAuthenticated]);

  // Helper to push user to sign-in page
  const handleSignIn = () => {
    router.push("/sign-in");
  };

  // Helper to sign out
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // after sign out, the onAuthStateChange listener sets isAuthenticated to false
    // and redirects to sign-in:
    router.push("/sign-in");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Button variant="secondary" onClick={handleSignIn}>
        Sign In
      </Button>
    );
  }

  // If authenticated, show the user avatar dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* <AvatarImage src="/avatars/01.png" alt={authUser.email} /> */}
            <AvatarFallback>
              {authUser.email
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {authUser.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {authUser.role}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
