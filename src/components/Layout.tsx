import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { Button } from './ui/Button';
import { useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/chatbot', label: 'Chatbot', icon: MessageSquare },
    { path: '/badges', label: 'Badges', icon: Trophy },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      {/* Navigation */}
      <nav className="bg-surface dark:bg-dark-surface border-b border-olive-light dark:border-dark-border sticky top-0 z-40 shadow-soft backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <BookOpen className="h-8 w-8 text-olive dark:text-dark-accent group-hover:text-olive-dark dark:group-hover:text-green-300 transition-colors" />
                <span className="text-xl font-bold text-olive-dark dark:text-dark-text">
                  DSA Platform
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg shadow-soft'
                            : 'text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-olive-light dark:border-dark-border">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-lg text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover transition-colors"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <span className="text-sm text-olive-dark dark:text-dark-text font-medium">
                      {user?.username}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                      <LogOut size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => navigate('/login')}>
                    Login
                  </Button>
                  <Button onClick={() => navigate('/register')}>Sign Up</Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-olive-light dark:border-dark-border bg-surface dark:bg-dark-surface">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all ${
                          isActive(item.path)
                            ? 'bg-olive dark:bg-dark-accent text-white dark:text-dark-bg shadow-soft'
                            : 'text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-2 border-t border-olive-light dark:border-dark-border">
                    <div className="px-3 py-2 text-sm text-olive-dark dark:text-dark-text font-medium">
                      {user?.username}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-base font-medium text-olive-dark dark:text-dark-text hover:bg-olive-light dark:hover:bg-dark-surface-hover transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/register');
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};







