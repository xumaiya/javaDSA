import { useState, useEffect } from 'react';
import { Trophy, Medal, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';

export const Leaderboard = () => {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await apiService.getLeaderboard(10);
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-olive-light" />;
    if (rank === 3) return <Award className="h-6 w-6 text-orange-500" />;
    return <span className="text-lg font-bold text-text-light dark:text-olive-light">{rank}</span>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card>
          <Skeleton className="h-96" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-olive-dark dark:text-olive-light">Leaderboard</h1>
        <p className="text-text-light dark:text-olive-light mt-2">
          Top performers in the DSA Learning Platform
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive-light/30 dark:bg-olive-dark border-b border-border dark:border-olive-dark">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-olive-light uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-olive-light uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-olive-light uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-olive-light uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted dark:text-olive-light uppercase tracking-wider">
                    Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-olive-dark divide-y divide-border dark:divide-olive">
                {entries.map((entry) => {
                  const isCurrentUser = user?.id === entry.user.id;
                  return (
                    <tr
                      key={entry.user.id}
                      className={`${
                        isCurrentUser
                          ? 'bg-olive-light/20 dark:bg-olive/20'
                          : 'hover:bg-olive-light/10 dark:hover:bg-olive-dark'
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRankIcon(entry.rank)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {entry.user.avatar ? (
                            <img
                              className="h-10 w-10 rounded-full mr-3"
                              src={entry.user.avatar}
                              alt={entry.user.username}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-olive-light dark:bg-olive flex items-center justify-center mr-3">
                              <span className="text-olive-dark dark:text-olive-light font-medium">
                                {entry.user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-olive-dark dark:text-olive-light">
                              {entry.user.username}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-olive dark:text-olive-pale">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-dark dark:text-olive-light">
                        {entry.points.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-dark dark:text-olive-light">
                        {entry.streak} days
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-olive-dark dark:text-olive-light">
                        Level {entry.level}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

