
import { Trophy, Users, ShieldCheck, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const challenges = [
  {
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
    title: 'Protein Pro',
    description: 'Log over 100g of protein in one day.',
    progress: 75,
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-green-500" />,
    title: 'Veggie Week',
    description: 'Analyze vegetarian meals for 7 days straight.',
    progress: 43,
  },
  {
    icon: <Star className="h-8 w-8 text-blue-500" />,
    title: 'Perfect Score',
    description: 'Get a "Low Risk" score on 3 consecutive meals.',
    progress: 66,
  },
];

const leaderboard = [
  { rank: 1, name: 'Aarav Sharma', score: 2450, avatar: 'https://picsum.photos/100/100?random=10' },
  { rank: 2, name: 'Priya Patel', score: 2310, avatar: 'https://picsum.photos/100/100?random=11' },
  { rank: 3, name: 'Rohan Gupta', score: 2200, avatar: 'https://picsum.photos/100/100?random=12' },
  { rank: 4, name: 'You', score: 2050, avatar: 'https://picsum.photos/100/100?random=13', isCurrentUser: true },
  { rank: 5, name: 'Sneha Reddy', score: 1980, avatar: 'https://picsum.photos/100/100?random=14' },
];

export default function ChallengesPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline flex items-center justify-center gap-3">
            <Users className="h-10 w-10"/>
            Community Challenges
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join challenges, compete with friends, and make healthy eating a team sport.
        </p>
      </div>

      <Card className="mb-12 shadow-lg">
        <CardHeader>
          <CardTitle>This Week's Challenges</CardTitle>
          <CardDescription>Complete these challenges to earn points and unlock achievements.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          {challenges.map((challenge, index) => (
            <Card key={index} className="bg-muted/50">
              <CardHeader className="flex flex-row items-center gap-4">
                {challenge.icon}
                <div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                    <div className="w-full bg-background rounded-full h-2.5">
                        <div className="bg-primary h-2.5 rounded-full" style={{width: `${challenge.progress}%`}}></div>
                    </div>
                    <span className="text-sm font-bold">{challenge.progress}%</span>
                </div>
                 <Button className="w-full mt-4" variant="outline">Join Challenge</Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Weekly Leaderboard</CardTitle>
           <CardDescription>See how you stack up against the competition.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((user) => (
                <TableRow key={user.rank} className={user.isCurrentUser ? 'bg-primary/10' : ''}>
                  <TableCell className="font-bold text-lg">{user.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{user.name}</span>
                      {user.isCurrentUser && <Badge>You</Badge>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">{user.score} pts</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}
