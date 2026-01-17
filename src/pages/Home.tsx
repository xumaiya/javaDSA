import { Link } from 'react-router-dom';
import { BookOpen, Trophy, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

export const Home = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-olive-dark dark:text-olive-pale mb-4">
          Master Data Structures & Algorithms
        </h1>
        <p className="text-xl text-text-light dark:text-olive-light mb-8 max-w-2xl mx-auto">
          Learn DSA concepts with interactive lessons, practice problems, and AI-powered assistance
        </p>
        <div className="flex justify-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <Button size="lg">Go to Dashboard</Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg">
                  Browse Courses
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-3xl font-bold text-center text-olive-dark dark:text-olive-pale mb-8">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-12 w-12 text-olive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-olive-dark dark:text-olive-pale mb-2">
                Comprehensive Courses
              </h3>
              <p className="text-sm text-text-light dark:text-olive-light">
                Learn from beginner to advanced with structured, chapter-wise content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-12 w-12 text-olive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-olive-dark dark:text-olive-pale mb-2">
                AI Chatbot
              </h3>
              <p className="text-sm text-text-light dark:text-olive-light">
                Get instant answers to your questions with our RAG-powered AI assistant
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="h-12 w-12 text-olive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-olive-dark dark:text-olive-pale mb-2">
                Gamification
              </h3>
              <p className="text-sm text-text-light dark:text-olive-light">
                Earn badges, maintain streaks, and compete on leaderboards
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-12 w-12 text-olive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-olive-dark dark:text-olive-pale mb-2">
                Track Progress
              </h3>
              <p className="text-sm text-text-light dark:text-olive-light">
                Monitor your learning journey with detailed progress tracking
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <Card className="bg-olive-light/30 dark:bg-olive/20 border-olive">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-olive-dark dark:text-olive-pale mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-text-light dark:text-olive-light mb-6">
              Join thousands of students mastering DSA
            </p>
            <Link to="/register">
              <Button size="lg">
                Create Free Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

