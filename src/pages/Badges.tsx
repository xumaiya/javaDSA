import { useState, useEffect } from 'react';
import { Award, Trophy } from 'lucide-react';
import { Badge as BadgeType } from '../types';
import { apiService } from '../services/apiService';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { BADGE_RARITY_COLORS } from '../utils/constants';

export const Badges = () => {
  const { user } = useAuthStore();
  const [allBadges, setAllBadges] = useState<BadgeType[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const [allResponse, userResponse] = await Promise.all([
          apiService.getBadges(),
          user ? apiService.getUserBadges(user.id) : Promise.resolve({ data: [] }),
        ]);
        setAllBadges(allResponse.data);
        setUserBadges(userResponse.data);
      } catch (error) {
        console.error('Failed to fetch badges:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, [user]);

  const earnedBadgeIds = new Set(userBadges.map((b) => b.id));

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <Skeleton className="h-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-olive-dark dark:text-olive-light">Badges</h1>
        <p className="text-text-light dark:text-olive-light mt-2">
          Earn badges by completing challenges and milestones
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-olive-light">Total Badges</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-olive-light">
                  {allBadges.length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-olive-light">Earned</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-olive-light">
                  {userBadges.length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light dark:text-olive-light">Progress</p>
                <p className="text-2xl font-bold text-olive-dark dark:text-olive-light">
                  {allBadges.length > 0
                    ? Math.round((userBadges.length / allBadges.length) * 100)
                    : 0}
                  %
                </p>
              </div>
              <Trophy className="h-8 w-8 text-olive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges Grid */}
      <div>
        <h2 className="text-2xl font-semibold text-olive-dark dark:text-olive-light mb-4">
          All Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.has(badge.id);
            return (
              <Card
                key={badge.id}
                className={`relative ${!isEarned ? 'opacity-60' : ''}`}
              >
                <CardContent className="pt-6 text-center">
                  <div className="text-6xl mb-4">{badge.icon}</div>
                  <h3 className="text-lg font-semibold text-olive-dark dark:text-olive-light mb-2">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-text-light dark:text-olive-light mb-3">
                    {badge.description}
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${BADGE_RARITY_COLORS[badge.rarity]}`}
                  >
                    {badge.rarity}
                  </span>
                  {isEarned && badge.earnedAt && (
                    <p className="text-xs text-text-muted dark:text-text-muted mt-2">
                      Earned on {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                  {!isEarned && (
                    <p className="text-xs text-text-muted dark:text-text-muted mt-2">
                      Not earned yet
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

