"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SpeechIcon, HomeIcon, UserIcon, Waves, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-lg border-b border-border py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 ml-3 md:ml-0">
          <div className="p-1 bg-primary/10 rounded">
            <Waves className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold font-mono">
            Un<span className="text-primary">Mute</span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex mr-3 md:mr-0">
          {isSignedIn ? (
            <>
              <div className="hidden md:flex items-center gap-5">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <HomeIcon size={16} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/conversation"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <SpeechIcon size={16} />
                  <span>Learn</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                >
                  <UserIcon size={16} />
                  <span>Profile</span>
                </Link>
                <Button
                  asChild
                  variant="outline"
                  className="ml-2 border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  <Link href="/conversation">Get Started</Link>
                </Button>
                <UserButton />
              </div>
              <div className="flex md:hidden gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost"><Menu size={20} /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Link
                          href="/"
                          className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                        >
                          <HomeIcon size={16} />
                          <span>Home</span>
                        </Link></DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/conversation"
                          className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                        >
                          <SpeechIcon size={16} />
                          <span>Learn</span>
                        </Link></DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href="/profile"
                          className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                        >
                          <UserIcon size={16} />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Button
                          variant="outline"
                          className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                        >
                          <Link href="/conversation">Get Started</Link>
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <UserButton />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-5">
              <SignInButton>
                <Button
                  variant={"outline"}
                  className="border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
