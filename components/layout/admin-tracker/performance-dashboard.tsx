import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Activity,
  Calendar,
  Clock,
  Database,
  User,
  Users,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Phone,
  UserPlus,
  ArrowRight,
  Zap,
  Trophy,
  Star,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function PerformanceDashboard() {
  const metrics = [
    {
      title: 'Total Calls',
      value: '1,842',
      change: '+12.3%',
      icon: <Phone className="h-4 w-4" />,
      trend: 'up',
      progress: 72
    },
    {
      title: 'New Leads',
      value: '643',
      change: '+5.1%',
      icon: <UserPlus className="h-4 w-4" />,
      trend: 'up',
      progress: 68
    },
    {
      title: 'Active Leads',
      value: '328',
      change: '-2.4%',
      icon: <Activity className="h-4 w-4" />,
      trend: 'down',
      progress: 45
    },
    {
      title: 'Admissions',
      value: '84',
      change: '+8.7%',
      icon: <ArrowRight className="h-4 w-4" />,
      trend: 'up',
      progress: 82
    }
  ];

  const teamData = [
    {
      name: 'Mudit',
      avatar: '/avatars/01.png',
      calls: 142,
      leads: 42,
      active: 28,
      footfall: 14,
      admissions: 5,
      performance: 'excellent',
      progress: 92
    },
    {
      name: 'Surabhi',
      avatar: '/avatars/02.png',
      calls: 118,
      leads: 38,
      active: 24,
      footfall: 12,
      admissions: 4,
      performance: 'good',
      progress: 78
    },
    {
      name: 'Rahul',
      avatar: '/avatars/03.png',
      calls: 96,
      leads: 32,
      active: 18,
      footfall: 9,
      admissions: 3,
      performance: 'average',
      progress: 65
    },
    {
      name: 'Priya',
      avatar: '/avatars/04.png',
      calls: 85,
      leads: 28,
      active: 15,
      footfall: 7,
      admissions: 2,
      performance: 'improving',
      progress: 58
    }
  ];

  const totals = teamData.reduce(
    (acc, curr) => ({
      calls: acc.calls + curr.calls,
      leads: acc.leads + curr.leads,
      active: acc.active + curr.active,
      footfall: acc.footfall + curr.footfall,
      admissions: acc.admissions + curr.admissions
    }),
    { calls: 0, leads: 0, active: 0, footfall: 0, admissions: 0 }
  );

  return (
    <Card className="p-4 w-max">
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Performance Dashboard</h2>
            <p className="text-muted-foreground">Track and analyze team performance metrics</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">This Week</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">All Members</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="h-4 w-4 text-muted-foreground">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    {metric.change} from last week
                  </div>
                  <Badge
                    variant={metric.trend === 'up' ? 'default' : 'destructive'}
                    className="h-5 text-xs"
                  >
                    {metric.trend === 'up' ? 'Positive' : 'Negative'}
                  </Badge>
                </div>
                <Progress value={metric.progress} className="h-2 mt-3" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Leading team members this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamData.slice(0, 2).map((member) => (
                  <div key={member.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium leading-none">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.admissions} admissions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {member.performance === 'excellent' ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Star className="h-5 w-5 text-blue-500" />
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>Team Progress</CardTitle>
              <CardDescription>Weekly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData.map((member) => (
                  <div key={member.name} className="flex items-center">
                    <div className="w-[150px]">
                      <p className="text-sm font-medium">{member.name}</p>
                    </div>
                    <div className="flex-1">
                      <Progress value={member.progress} className="h-2" />
                    </div>
                    <div className="w-[60px] text-right">
                      <Badge variant="outline" className="px-2 py-0.5 text-xs">
                        {member.progress}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="week">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="day" className="text-xs">
                <Clock className="h-3 w-3 mr-1" /> Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" /> Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs">
                <Database className="h-3 w-3 mr-1" /> Month
              </TabsTrigger>
              <TabsTrigger value="all" className="text-xs">
                <BarChart2 className="h-3 w-3 mr-1" /> All Time
              </TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" className="ml-auto">
              Export <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <TabsContent value="week" className="space-y-4">
            <Card className="border shadow-sm">
              <CardHeader className="px-7">
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Detailed breakdown of weekly metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead className="text-right">Calls</TableHead>
                        <TableHead className="text-right">Leads</TableHead>
                        <TableHead className="text-right">Active</TableHead>
                        <TableHead className="text-right">Footfall</TableHead>
                        <TableHead className="text-right">Admissions</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamData.map((member, i) => (
                        <TableRow key={i} className="hover:bg-muted/50">
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-3">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {member.performance === 'excellent'
                                    ? 'Top performer'
                                    : member.performance === 'good'
                                      ? 'Meeting targets'
                                      : member.performance === 'average'
                                        ? 'Needs improvement'
                                        : 'Developing'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{member.calls}</TableCell>
                          <TableCell className="text-right">{member.leads}</TableCell>
                          <TableCell className="text-right">{member.active}</TableCell>
                          <TableCell className="text-right">{member.footfall}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary" className="px-2">
                              {member.admissions}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50 font-bold hover:bg-muted/50">
                        <TableCell>Team Total</TableCell>
                        <TableCell className="text-right">{totals.calls}</TableCell>
                        <TableCell className="text-right">{totals.leads}</TableCell>
                        <TableCell className="text-right">{totals.active}</TableCell>
                        <TableCell className="text-right">{totals.footfall}</TableCell>
                        <TableCell className="text-right">{totals.admissions}</TableCell>
                        <TableCell className="text-right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
