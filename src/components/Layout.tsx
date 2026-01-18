import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  Code2, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  ClipboardList,
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
    { path: '/editor', label: 'Code Editor', icon: Code2 },
    { path: '/chatbot', label: 'Chatbot', icon: MessageSquare },
    { path: '/quizzes', label: 'Quizzes', icon: ClipboardList },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen bg-gradient-to-br from-olive-pale/20 via-background to-olive-pale/10 dark:from-dark-bg dark:via-dark-bg dark:to-dark-surface/30">
      {/* Navigation with Glass Morphism */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-b border-olive-light/30 dark:border-dark-border/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-olive-dark to-olive dark:from-dark-text dark:to-dark-accent bg-clip-text text-transparent">
                  DSA Platform
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              {isAuthenticated ? (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 text-white shadow-lg scale-105'
                            : 'text-olive-dark dark:text-dark-text hover:bg-white/50 dark:hover:bg-dark-surface-hover/50 backdrop-blur-sm'
                        }`}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-olive-light/30 dark:border-dark-border/50">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-xl text-olive-dark dark:text-dark-text hover:bg-white/50 dark:hover:bg-dark-surface-hover/50 backdrop-blur-sm transition-all duration-300 hover:scale-110"
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <div className="px-3 py-1.5 rounded-xl bg-olive-light/30 dark:bg-dark-surface/50 backdrop-blur-sm">
                      <span className="text-sm text-olive-dark dark:text-dark-text font-medium">
                        {user?.username}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleLogout}
                      className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300"
                    >
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

        {/* Mobile Navigation with Glass Morphism */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-olive-light/30 dark:border-dark-border/50 backdrop-blur-xl bg-white/80 dark:bg-dark-surface/80">
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
                        className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-base font-medium transition-all duration-300 ${
                          isActive(item.path)
                            ? 'bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-500 text-white shadow-lg'
                            : 'text-olive-dark dark:text-dark-text hover:bg-white/50 dark:hover:bg-dark-surface-hover/50 backdrop-blur-sm'
                        }`}
                      >
                        <Icon size={20} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <div className="pt-2 mt-2 border-t border-olive-light/30 dark:border-dark-border/50">
                    <div className="px-3 py-2 mb-1 rounded-xl bg-olive-light/30 dark:bg-dark-surface/50 backdrop-blur-sm">
                      <span className="text-sm text-olive-dark dark:text-dark-text font-medium">
                        {user?.username}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-3 py-2 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 backdrop-blur-sm transition-all duration-300"
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







