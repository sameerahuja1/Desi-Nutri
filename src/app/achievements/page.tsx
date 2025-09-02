
import { Award, Flame, Zap, Salad, Star, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const achievements = [
  {
    icon: <Star className="h-8 w-8 text-yellow-500" />,
    title: 'First Meal Scanned',
    description: 'You\'ve taken the first step on your nutrition journey!',
    unlocked: true,
  },
  {
    icon: <Zap className="h-8 w-8 text-green-500" />,
    title: 'Protein Powered',
    description: 'Applied a protein upgrade suggestion.',
    unlocked: true,
  },
  {
    icon: <Flame className="h-8 w-8 text-orange-500" />,
    title: '3-Day Streak',
    description: 'Analyzed a meal for 3 days in a row.',
    unlocked: true,
  },
  {
    icon: <Trophy className="h-8 w-8 text-blue-500" />,
    title: 'Weekly Warrior',
    description: 'Completed a 7-day analysis streak.',
    unlocked: false,
  },
  {
    icon: <Award className="h-8 w-8 text-purple-500" />,
    title: 'Veggie Virtuoso',
    description: 'Analyzed 10 vegetarian meals.',
    unlocked: false,
  },
  {
    icon: <Salad className="h-8 w-8 text-teal-500" />,
    title: 'Family Feeder',
    description: 'Used the Family Meal mode for the first time.',
    unlocked: false,
  },
];

export default function AchievementsPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Your Achievements</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Track your progress and unlock badges for building healthy eating habits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement, index) => (
          <Card key={index} className={`transition-all duration-300 ${achievement.unlocked ? 'opacity-100 shadow-lg' : 'opacity-50 bg-muted/50'}`}>
            <CardHeader className="flex flex-col items-center text-center">
              <div className={`mb-4 p-3 rounded-full ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted-foreground/10'}`}>
                {achievement.icon}
              </div>
              <CardTitle>{achievement.title}</CardTitle>
              <CardDescription>{achievement.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant={achievement.unlocked ? 'default' : 'outline'}>
                {achievement.unlocked ? 'Unlocked' : 'Locked'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
