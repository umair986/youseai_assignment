"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menu,
  X,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
  BarChart,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export default function SidebarNav() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const Sidebar = () => (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-background",
        isOpen ? "w-64" : "w-[70px]"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {isOpen && <h2 className="text-lg font-semibold">Menu</h2>}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? (
            <ChevronRight className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.href} delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                      pathname === item.href ? "bg-accent" : "transparent",
                      isOpen ? "justify-start" : "justify-center"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {isOpen && <span>{item.name}</span>}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-1">
                  {item.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Main Content Wrapper */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          isOpen ? "md:ml-64" : "md:ml-[70px]"
        )}
      >
        {/* Your main content goes here */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p>Your page content goes here.</p>
        </div>
      </div>
    </>
  );
}
