import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navItems = [
    { name: t('navbar.home'), href: "/" },
    { name: t('navbar.features'), href: "#features" },
    { name: t('navbar.categories'), href: "#categories" },
    { name: t('navbar.about'), href: "#about" },
  ];

  const dashboards = [
    { 
      name: t('navbar.dashboard.class8to10'), 
      href: "/auth", 
      category: t('navbar.category.awareness') 
    },
    { 
      name: t('navbar.dashboard.class11to12'), 
      href: "/auth", 
      category: t('navbar.category.preparation') 
    },
    { 
      name: t('navbar.dashboard.post12th'), 
      href: "/auth", 
      category: t('navbar.category.admission') 
    },
    { 
      name: t('navbar.dashboard.college'), 
      href: "/auth", 
      category: t('navbar.category.development') 
    },
  ];

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleGetStarted = () => {
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="PathFinderAI Logo" 
                className="w-20 h-20 group-hover:scale-110 transition-transform duration-200" 
              />
              <Sparkles className="w-6 h-6 text-secondary absolute top-1 -left-1 animate-pulse" />
            </div>
            <span className="text-xl font-bold text-glow">{t('navbar.logo')}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
            
            {/* Dashboard Dropdown */}
            <div className="relative group">
              <button className="text-foreground/80 hover:text-primary transition-colors font-medium">
                {t('navbar.dashboards')}
              </button>
              <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="feature-card p-4 space-y-2">
                  {dashboards.map((dashboard) => (
                    <Link
                      key={dashboard.href}
                      to={dashboard.href}
                      className="block p-3 rounded-lg hover:bg-primary/10 transition-colors group/item"
                    >
                      <div className="font-medium text-foreground group-hover:item:text-primary">
                        {dashboard.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {dashboard.category}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <LanguageSelector />
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-foreground/80" onClick={handleSignIn}>
              {t('navbar.signIn')}
            </Button>
            <button className="btn-hero" onClick={handleGetStarted}>
              {t('navbar.getStarted')}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSelector />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/50 backdrop-blur-md border border-border/50 rounded-lg mt-2 mb-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className="border-t border-border/50 mt-4 pt-4">
                <div className="text-sm font-medium text-muted-foreground px-3 mb-2">
                  {t('navbar.dashboards')}
                </div>
                {dashboards.map((dashboard) => (
                  <Link
                    key={dashboard.href}
                    to={dashboard.href}
                    className="block px-3 py-2 text-foreground/80 hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="font-medium">{dashboard.name}</div>
                    <div className="text-xs text-muted-foreground">{dashboard.category}</div>
                  </Link>
                ))}
              </div>
              
              <div className="border-t border-border/50 mt-4 pt-4 space-y-2">
                <button className="w-full btn-secondary text-left" onClick={handleSignIn}>
                  {t('navbar.signIn')}
                </button>
                <button className="w-full btn-hero text-center" onClick={handleGetStarted}>
                  {t('navbar.getStarted')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;