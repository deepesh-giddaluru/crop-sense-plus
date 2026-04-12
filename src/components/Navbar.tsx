import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.jpg";
import { useState } from "react";

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="AgriSight AI" className="h-8 w-8 rounded-md object-cover" />
          <span className="font-heading text-xl font-bold text-foreground">AgriSight AI</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          {isLanding && (
            <>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            </>
          )}
          <button onClick={toggle} className="rounded-full p-2 text-muted-foreground hover:bg-secondary transition-colors">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isLanding ? (
            <Link to="/auth">
              <Button>Get Started Free</Button>
            </Link>
          ) : (
            <Link to="/">
              <Button variant="outline" size="sm">Home</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <button onClick={toggle} className="rounded-full p-2 text-muted-foreground">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {isLanding && (
              <>
                <a href="#features" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Features</a>
                <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">How it works</a>
                <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Pricing</a>
              </>
            )}
            <Link to={isLanding ? "/auth" : "/"} onClick={() => setMobileOpen(false)}>
              <Button className="w-full">{isLanding ? "Get Started Free" : "Home"}</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
