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
  Users,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Phone,
  UserPlus,
  ArrowRight,
  Trophy,
  Star,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { durationBasedSourceAnalytics, todaySourceAnalytics } from './helpers/fetch-data';
import { useEffect, useState } from 'react';
import { format, startOfWeek, startOfMonth, startOfYear, endOfDay } from 'date-fns';
import { NoDataPreview } from '@/components/custom-ui/no-data-preview/no-data-preview';
import { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';

type DurationUserStats = {
  _id: string;
  userFirstName: string;
  userLastName: string;
  totalCalls: number;
  newLeadCalls: number;
  activeLeadCalls: number;
  totalFootFall: number;
  totalAdmissions: number;
  nonActiveLeadCalls: number;
};

export function PerformanceDashboard() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DurationUserStats;
    direction: 'ascending' | 'descending';
  }>({
    key: 'userFirstName',
    direction: 'ascending'
  });

  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month' | 'all'>('day');

  const today = endOfDay(new Date());
  const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

  const getDuration = () => {
    console.log('Getting duration for:', activeTab);
    switch (activeTab) {
      case 'week':
        return { startDate: formatDate(startOfWeek(new Date())), endDate: formatDate(today) };
      case 'month':
        return { startDate: formatDate(startOfMonth(new Date())), endDate: formatDate(today) };
      case 'all':
        return { startDate: formatDate(startOfYear(new Date())), endDate: formatDate(today) };
      default:
        return { startDate: formatDate(today), endDate: formatDate(today) };
    }
  };

  const { data: todayAnalytics, isLoading: todayLoading } = useQuery({
    queryKey: ['todaySourceAnalytics'],
    queryFn: todaySourceAnalytics,
    enabled: activeTab === 'day'
  });

  const { data: durationAnalytics, isLoading: durationLoading } = useQuery({
    queryKey: ['durationBasedSourceAnalytics', activeTab],
    queryFn: () => durationBasedSourceAnalytics(getDuration()),
    enabled: activeTab === 'week' || activeTab === 'month' || activeTab === 'all'
  });

  useEffect(() => {
    console.log('Active Tab Changed:', activeTab);
  }, [activeTab]);

  const currentData =
    activeTab === 'day'
      ? (todayAnalytics?.data || []).map((item) => ({
        _id: item.userId,
        userFirstName: item.userFirstName,
        userLastName: item.userLastName,
        totalCalls: item.totalCalls,
        newLeadCalls: item.newLeadCalls,
        activeLeadCalls: item.activeLeadCalls,
        nonActiveLeadCalls: item.nonActiveLeadCalls,
        totalFootFall: item.totalFootFall,
        totalAdmissions: item.totalAdmissions,
        analyticsRemark: item.analyticsRemark,
      }))
      : durationAnalytics || [];

  const sortedData = [...currentData].sort((a, b) => {
    if (sortConfig.key === 'userFirstName' || sortConfig.key === 'userLastName') {
      // Lexicographic sorting for names
      const aValue = `${a.userFirstName} ${a.userLastName}`.toLowerCase();
      const bValue = `${b.userFirstName} ${b.userLastName}`.toLowerCase();
      return sortConfig.direction === 'ascending'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      // Numeric sorting for other fields
      return sortConfig.direction === 'ascending'
        ? Number(a[sortConfig.key]) - Number(b[sortConfig.key])
        : Number(b[sortConfig.key]) - Number(a[sortConfig.key]);
    }
  });

  const totals = sortedData.reduce(
    (acc, curr) => ({
      totalCalls: acc.totalCalls + curr.totalCalls,
      newLeadCalls: acc.newLeadCalls + curr.newLeadCalls,
      activeLeadCalls: acc.activeLeadCalls + curr.activeLeadCalls,
      totalFootFall: acc.totalFootFall + curr.totalFootFall,
      nonActiveLeadCalls: acc.nonActiveLeadCalls + curr.nonActiveLeadCalls,
      totalAdmissions: acc.totalAdmissions + curr.totalAdmissions
    }),
    { totalCalls: 0, newLeadCalls: 0, nonActiveLeadCalls: 0, activeLeadCalls: 0, totalFootFall: 0, totalAdmissions: 0 }
  );

  const topPerformers = [...sortedData]
    .sort((a, b) => b.totalAdmissions - a.totalAdmissions)
    .slice(0, 2);
  const maxAdmissions = topPerformers[0]?.totalAdmissions || 1;
  const teamWithProgress = sortedData.map((member) => ({
    ...member,
    progress: Math.round((member.totalAdmissions / maxAdmissions) * 100)
  }));

  const metrics = [
    {
      title: 'Total Calls',
      value: totals.totalCalls,
      icon: <Phone />,
      trend: 'up',
      progress: Math.min(100, (totals.totalCalls / (totals.totalCalls + 500)) * 100)
    },
    {
      title: 'New Leads',
      value: totals.newLeadCalls,
      icon: <UserPlus />,
      trend: 'up',
      progress: Math.min(100, (totals.newLeadCalls / (totals.newLeadCalls + 200)) * 100)
    },
    {
      title: 'Active Leads',
      value: totals.activeLeadCalls,
      icon: <Activity />,
      trend: 'down',
      progress: Math.min(100, (totals.activeLeadCalls / (totals.activeLeadCalls + 150)) * 100)
    },
    {
      title: 'Admissions',
      value: totals.totalAdmissions,
      icon: <ArrowRight />,
      trend: 'up',
      progress: Math.min(100, (totals.totalAdmissions / (totals.totalAdmissions + 50)) * 100)
    }
  ];

  const requestSort = (key: keyof DurationUserStats) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending'
    }));
  };

  const getSortIcon = (key: keyof DurationUserStats) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  const isLoading =
    (activeTab === 'day' && todayLoading) || (activeTab !== 'day' && durationLoading);

  return (
    <Card className="p-4 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Team Performance</h2>
            <p className="text-muted-foreground">Track and analyze team performance metrics</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">
                {activeTab === 'day'
                  ? 'Today'
                  : activeTab === 'week'
                    ? 'This Week'
                    : activeTab === 'month'
                      ? 'This Month'
                      : 'This Year'}
              </span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">All Members</span>
            </Button>
          </div>
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <Card key={i} className="hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className="h-4 w-4 text-muted-foreground">{metric.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    {metric.trend === 'up' ? (
                      <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    {metric.trend === 'up' ? '+12.3%' : '-2.4%'} from last
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
              <CardDescription>Leading team members this period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : topPerformers.length === 0 ? (
                <>
                  <NoDataPreview
                    message="No top performers found for the selected period."
                    className="w-full h-full"
                  />
                </>
              ) : (
                <div className="space-y-6">
                  {topPerformers.map((member) => (
                    <div key={member._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {member.userFirstName[0]}
                            {member.userLastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {member.userFirstName} {member.userLastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {member.totalAdmissions} admissions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {member === topPerformers[0] ? (
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <Star className="h-5 w-5 text-blue-500" />
                        )}
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-4">
            <CardHeader>
              <CardTitle>Team Progress</CardTitle>
              <CardDescription>Performance overview for this period</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">Loading...</div>
              ) : teamWithProgress.length === 0 ? (
                <>
                  <NoDataPreview
                    message="No team members found for the selected period."
                    className="w-full h-full"
                  />
                </>
              ) : (
                <div className="space-y-4">
                  {teamWithProgress.map((member) => (
                    <div key={member._id} className="flex items-center">
                      <div className="w-[150px]">
                        <p className="text-sm font-medium">
                          {member.userFirstName} {member.userLastName}
                        </p>
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
              )}
            </CardContent>
          </Card>
        </div> */}

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'day' | 'week' | 'month' | 'all')}
        >
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
              Download <Download className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <TabsContent value={activeTab}>
            <Card className="border shadow-sm">
              <CardHeader className="px-7">
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Detailed breakdown of metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading data...</div>
                ) : sortedData.length === 0 ? (
                  <NoDataPreview
                    message="No performance data available for the selected period."
                    className="w-full"
                  />
                ) : (
                  <div className="overflow-auto max-h-[500px] relative">
                    <Table className="border-collapse">
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow className="bg-primary/10 hover:bg-primary/10 backdrop-blur-lg">
                          <TableHead className="font-semibold text-primary dark:text-gray-100">
                            <button
                              onClick={() => requestSort('userFirstName')}
                              className="flex items-center w-full hover:text-primary cursor-pointer"
                            >
                              Individual Level {getSortIcon('userFirstName')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('totalCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Total No. Of Calls {getSortIcon('totalCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('newLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              New Lead Calls {getSortIcon('newLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('activeLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Active Lead Calls {getSortIcon('activeLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('activeLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Non Active Lead Calls {getSortIcon('nonActiveLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('totalFootFall')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Total Footfall {getSortIcon('totalFootFall')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              onClick={() => requestSort('totalAdmissions')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Total Admissions {getSortIcon('totalAdmissions')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center">
                            <button
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Remarks
                            </button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedData.map((member) => (
                          <TableRow key={member._id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback>
                                    {member.userFirstName[0]}
                                    {member.userLastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {member.userFirstName} {member.userLastName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {member.totalAdmissions === topPerformers[0]?.totalAdmissions
                                      ? 'Top performer'
                                      : member.totalAdmissions >=
                                        (topPerformers[1]?.totalAdmissions || 0)
                                        ? 'Meeting targets'
                                        : 'Needs improvement'}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{member.totalCalls}</TableCell>
                            <TableCell className="text-center">{member.newLeadCalls}</TableCell>
                            <TableCell className="text-center">{member.activeLeadCalls}</TableCell>
                            <TableCell className="text-center">{member.nonActiveLeadCalls}</TableCell>
                            <TableCell className="text-center">{member.totalFootFall}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="px-2">
                                {member.totalAdmissions}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <TruncatedCell value={!member.analyticsRemark || member.analyticsRemark == "" ? "--" : member.analyticsRemark} maxWidth={80}/>
                              </TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                      <tfoot className="sticky bottom-0 z-10">
                        <TableRow className="font-bold bg-primary/10 hover:bg-primary/10 backdrop-blur-3xl">
                          <TableCell>Team Total</TableCell>
                          <TableCell className="text-center">{totals.totalCalls}</TableCell>
                          <TableCell className="text-center">{totals.newLeadCalls}</TableCell>
                          <TableCell className="text-center">{totals.activeLeadCalls}</TableCell>
                          <TableCell className="text-center">{totals.nonActiveLeadCalls}</TableCell>
                          <TableCell className="text-center">{totals.totalFootFall}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="default" className="px-2">
                              {totals.totalAdmissions}
                            </Badge>
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </tfoot>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
