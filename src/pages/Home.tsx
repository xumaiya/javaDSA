import { Link } from 'react-router-dom';
import { BookOpen, Trophy, MessageSquare, TrendingUp, ArrowRight, Code2, Sparkles, Zap, Brain, Target, Rocket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';

export const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-20 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-olive/10 dark:bg-olive/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-olive-light/15 dark:bg-olive-light/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-olive/5 dark:bg-olive/15 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Hero Section with Glass Morphism */}
      <div className={`relative text-center py-20 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <Code2 className="absolute top-10 left-10 h-8 w-8 text-olive/30 dark:text-olive/40 animate-float" />
          <Brain className="absolute top-20 right-20 h-10 w-10 text-olive-light/40 dark:text-olive-light/30 animate-float-delayed" />
          <Target className="absolute bottom-20 left-20 h-6 w-6 text-olive/40 dark:text-olive/50 animate-float-slow" />
          <Zap className="absolute bottom-10 right-10 h-7 w-7 text-olive-light/30 dark:text-olive-light/40 animate-float" />
        </div>

        <div className="relative">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-olive/10 dark:bg-olive/20 backdrop-blur-xl border border-olive/20 dark:border-olive/30 mb-6 animate-pulse">
            <Sparkles className="h-4 w-4 text-olive dark:text-dark-accent" />
            <span className="text-sm font-medium text-olive-dark dark:text-dark-text">
              AI-Powered Learning Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-olive-dark via-olive to-olive-dark dark:from-dark-text dark:via-dark-accent dark:to-dark-text bg-clip-text text-transparent animate-gradient">
            Master Data Structures
            <br />
            <span className="text-5xl md:text-6xl">& Algorithms</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-light dark:text-olive-light mb-10 max-w-3xl mx-auto leading-relaxed">
            Learn DSA concepts with <span className="text-olive dark:text-dark-accent font-semibold">interactive lessons</span>, 
            practice problems, and <span className="text-olive dark:text-dark-accent font-semibold">AI-powered assistance</span>
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2">
                      Go to Dashboard
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button variant="outline" size="lg" className="backdrop-blur-xl bg-white/50 dark:bg-dark-surface/50 border-olive/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
                    Browse Courses
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <Rocket className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="backdrop-blur-xl bg-white/50 dark:bg-dark-surface/50 border-olive/30 dark:border-dark-border hover:scale-105 transition-all duration-300">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {[
              { number: '5+', label: 'Courses' },
              { number: '100+', label: 'Lessons' },
              { number: '1000+', label: 'Students' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="group"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-olive/20 dark:bg-olive/30 rounded-xl blur-lg group-hover:blur-xl transition-all" />
                  <div className="relative backdrop-blur-xl bg-white/60 dark:bg-dark-surface/60 px-6 py-3 rounded-xl border border-olive/20 dark:border-dark-border">
                    <div className="text-2xl font-bold text-olive-dark dark:text-dark-text">{stat.number}</div>
                    <div className="text-sm text-text-muted dark:text-dark-text-muted">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section with Glass Cards */}
      <div className={`relative transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-olive-dark dark:text-olive-pale mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-text-light dark:text-olive-light max-w-2xl mx-auto">
            Everything you need to master DSA in one place
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: BookOpen,
              title: 'Comprehensive Courses',
              description: 'Learn from beginner to advanced with structured, chapter-wise content',
              color: 'from-blue-400/20 to-cyan-400/20 dark:from-blue-500/30 dark:to-cyan-500/10',
              iconColor: 'text-blue-500 dark:text-blue-400',
            },
            {
              icon: MessageSquare,
              title: 'AI Chatbot',
              description: 'Get instant answers to your questions with our RAG-powered AI assistant',
              color: 'from-purple-400/20 to-pink-400/20 dark:from-purple-500/30 dark:to-pink-500/10',
              iconColor: 'text-purple-500 dark:text-purple-400',
            },
            {
              icon: Trophy,
              title: 'Gamification',
              description: 'Earn badges, maintain streaks, and compete on leaderboards',
              color: 'from-yellow-400/20 to-orange-400/20 dark:from-yellow-500/30 dark:to-orange-500/10',
              iconColor: 'text-yellow-500 dark:text-yellow-400',
            },
            {
              icon: TrendingUp,
              title: 'Track Progress',
              description: 'Monitor your learning journey with detailed progress tracking',
              color: 'from-green-400/20 to-emerald-400/20 dark:from-green-500/30 dark:to-emerald-500/10',
              iconColor: 'text-green-500 dark:text-green-400',
            },
          ].map((feature, i) => (
            <div 
              key={i} 
              className="group relative"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl blur-xl group-hover:blur-2xl transition-all`} />
              <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border hover:scale-105 hover:-translate-y-2 transition-all duration-300 h-full">
                <CardContent className="pt-8 text-center">
                  <div className="relative inline-block mb-4">
                    <div className={`absolute inset-0 ${feature.color} rounded-full blur-md animate-pulse`} />
                    <feature.icon className={`relative h-12 w-12 ${feature.iconColor} mx-auto`} />
                  </div>
                  <h3 className="text-xl font-semibold text-olive-dark dark:text-olive-pale mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-light dark:text-olive-light leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className={`relative transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-olive/20 to-olive-light/20 dark:from-olive/30 dark:to-olive-light/10 rounded-3xl blur-2xl" />
          <Card className="relative backdrop-blur-xl bg-white/70 dark:bg-dark-surface/70 border-olive-light/30 dark:border-dark-border overflow-hidden">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/10 dark:bg-olive/20 mb-4">
                    <Code2 className="h-4 w-4 text-olive dark:text-dark-accent" />
                    <span className="text-sm font-medium text-olive-dark dark:text-dark-text">
                      Real-Time Code Editor
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-olive-dark dark:text-dark-text mb-4">
                    Practice with Live Code Execution
                  </h3>
                  <p className="text-text-light dark:text-dark-text-muted mb-6 leading-relaxed">
                    Write, compile, and run Java code directly in your browser. Get instant feedback and learn by doing.
                  </p>
                  <Link to="/editor">
                    <Button className="group bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 hover:scale-105 transition-all">
                      Try Code Editor
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-olive/10 to-olive-light/10 dark:from-olive/20 dark:to-olive-light/5 rounded-xl blur-xl" />
                  <div className="relative backdrop-blur-xl bg-gray-900/90 rounded-xl p-4 font-mono text-sm overflow-hidden">
                    <div className="flex gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <pre className="text-green-400">
{`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, DSA!");
    }
}`}
                    </pre>
                    <div className="mt-3 text-gray-400 text-xs">
                      → Hello, DSA!
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className={`relative transition-all duration-1000 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-olive/30 to-olive-light/30 dark:from-olive/40 dark:to-olive-light/20 rounded-3xl blur-2xl" />
            <Card className="relative backdrop-blur-xl bg-gradient-to-br from-white/80 to-olive-pale/50 dark:from-dark-surface/80 dark:to-olive/20 border-olive/30 dark:border-dark-border overflow-hidden">
              <CardContent className="pt-12 pb-12 text-center relative">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <Sparkles className="absolute top-10 left-10 h-6 w-6 text-olive/30 dark:text-olive/40 animate-pulse" />
                  <Sparkles className="absolute top-20 right-20 h-8 w-8 text-olive-light/40 dark:text-olive-light/30 animate-pulse delay-300" />
                  <Sparkles className="absolute bottom-10 left-1/4 h-5 w-5 text-olive/40 dark:text-olive/50 animate-pulse delay-700" />
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-olive-dark dark:text-olive-pale mb-4 relative">
                  Ready to Start Learning?
                </h2>
                <p className="text-xl text-text-light dark:text-olive-light mb-8 max-w-2xl mx-auto relative">
                  Join thousands of students mastering DSA with our interactive platform
                </p>
                <Link to="/register">
                  <Button size="lg" className="group relative overflow-hidden bg-gradient-to-r from-olive to-olive-dark dark:from-dark-accent dark:to-green-600 hover:scale-110 transition-all duration-300 shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2 text-lg px-4">
                      Create Free Account
                      <Rocket className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
