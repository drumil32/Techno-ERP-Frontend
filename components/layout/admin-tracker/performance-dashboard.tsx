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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { durationBasedSourceAnalytics, todaySourceAnalytics } from './helpers/fetch-data';
import { useEffect, useState } from 'react';
import { format, startOfWeek, startOfMonth, startOfYear, endOfDay } from 'date-fns';
import { NoDataPreview } from '@/components/custom-ui/no-data-preview/no-data-preview';
import { TruncatedCell } from '@/components/custom-ui/data-table/techno-data-table';
import * as XLSX from 'xlsx';

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
  analyticsRemark?: string;
};

export function PerformanceDashboard() {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof DurationUserStats;
    direction: 'ascending' | 'descending';
  }>({
    key: 'totalCalls',
    direction: 'descending'
  });

  const [activeTab, setActiveTab] = useState<'day' | 'yesterday' | 'week' | 'month' | 'all'>('day');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const today = endOfDay(new Date());
  const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

  const getDuration = (period: 'day' | 'week' | 'month' | 'all' | 'yesterday') => {

    switch (period) {
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: formatDate(yesterday),
          endDate: formatDate(yesterday)
        };
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
  const { data: yesterdayAnalytics, isLoading: yesterdayLoading } = useQuery({
    queryKey: ['yesterdaySourceAnalytics'],
    queryFn: () => durationBasedSourceAnalytics(getDuration('yesterday'))
  });
  const { data: todayAnalytics, isLoading: todayLoading } = useQuery({
    queryKey: ['todaySourceAnalytics'],
    queryFn: todaySourceAnalytics
  });

  const { data: weekAnalytics, isLoading: weekLoading } = useQuery({
    queryKey: ['durationBasedSourceAnalytics', 'week'],
    queryFn: () => durationBasedSourceAnalytics(getDuration('week'))
  });

  const { data: monthAnalytics, isLoading: monthLoading } = useQuery({
    queryKey: ['durationBasedSourceAnalytics', 'month'],
    queryFn: () => durationBasedSourceAnalytics(getDuration('month'))
  });

  const { data: allTimeAnalytics, isLoading: allTimeLoading } = useQuery({
    queryKey: ['durationBasedSourceAnalytics', 'all'],
    queryFn: () => durationBasedSourceAnalytics(getDuration('all'))
  });


  const getCurrentData = () => {
    switch (activeTab) {
      case 'day':
        return (todayAnalytics?.data || []).map((item) => ({
          _id: item.userId,
          userFirstName: item.userFirstName,
          userLastName: item.userLastName,
          totalCalls: item.totalCalls,
          newLeadCalls: item.newLeadCalls,
          activeLeadCalls: item.activeLeadCalls,
          nonActiveLeadCalls: item.nonActiveLeadCalls,
          totalFootFall: item.totalFootFall,
          totalAdmissions: item.totalAdmissions,
          analyticsRemark: item.analyticsRemark
        }));
      case 'yesterday':
        return yesterdayAnalytics || [];
      case 'week':
        return weekAnalytics || [];
      case 'month':
        return monthAnalytics || [];
      case 'all':
        return allTimeAnalytics || [];
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

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
      totalCalls: acc.totalCalls + (curr.totalCalls ?? 0),
      newLeadCalls: acc.newLeadCalls + (curr.newLeadCalls ?? 0),
      activeLeadCalls: acc.activeLeadCalls + (curr.activeLeadCalls ?? 0),
      totalFootFall: acc.totalFootFall + (curr.totalFootFall ?? 0),
      nonActiveLeadCalls: acc.nonActiveLeadCalls + (curr.nonActiveLeadCalls ?? 0),
      totalAdmissions: acc.totalAdmissions + (curr.totalAdmissions ?? 0)
    }),
    {
      totalCalls: 0,
      newLeadCalls: 0,
      nonActiveLeadCalls: 0,
      activeLeadCalls: 0,
      totalFootFall: 0,
      totalAdmissions: 0
    }
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
      title: 'Total Leads Reached',
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
    (activeTab === 'day' && todayLoading) ||
    (activeTab === 'yesterday' && yesterdayLoading) ||
    (activeTab === 'week' && weekLoading) ||
    (activeTab === 'month' && monthLoading) ||
    (activeTab === 'all' && allTimeLoading);

  const applyColumnWidths = (sheet: XLSX.WorkSheet, includeRemarks: boolean) => {
    sheet['!cols'] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 18 },
      { wch: 22 },
      { wch: 16 },
      { wch: 18 },
      ...(includeRemarks ? [{ wch: 30 }] : [])
    ];
  };

  const formatDataForExcel = (data: DurationUserStats[], includeRemarks = false) => {
    const formattedData = data.map((member, index) => ({
      'S.No': index + 1,
      Name: `${member.userFirstName} ${member.userLastName}`,
      'Total Calls': member.totalCalls,
      'New Lead Calls': member.newLeadCalls,
      'Active Lead Calls': member.activeLeadCalls,
      'Non Active Lead Calls': member.nonActiveLeadCalls,
      'Total Footfall': member.totalFootFall,
      'Total Admissions': member.totalAdmissions,
      ...(includeRemarks && { Remarks: member.analyticsRemark || '--' })
    }));

    // Add totals row
    const totalsRow = {
      'S.No': '',
      Name: 'TOTAL',
      'Total Calls': data.reduce((sum, member) => sum + member.totalCalls, 0),
      'New Lead Calls': data.reduce((sum, member) => sum + member.newLeadCalls, 0),
      'Active Lead Calls': data.reduce((sum, member) => sum + member.activeLeadCalls, 0),
      'Non Active Lead Calls': data.reduce((sum, member) => sum + member.nonActiveLeadCalls, 0),
      'Total Footfall': data.reduce((sum, member) => sum + member.totalFootFall, 0),
      'Total Admissions': data.reduce((sum, member) => sum + member.totalAdmissions, 0),
      ...(includeRemarks && { Remarks: '' })
    };

    return [...formattedData, totalsRow];
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const yesterdayData = yesterdayAnalytics || [];

      // Prepare data for all periods
      const dayData = (todayAnalytics?.data || []).map((item) => ({
        _id: item.userId,
        userFirstName: item.userFirstName,
        userLastName: item.userLastName,
        totalCalls: item.totalCalls,
        newLeadCalls: item.newLeadCalls,
        activeLeadCalls: item.activeLeadCalls,
        nonActiveLeadCalls: item.nonActiveLeadCalls,
        totalFootFall: item.totalFootFall,
        totalAdmissions: item.totalAdmissions,
        analyticsRemark: item.analyticsRemark
      }));

      // Create workbook
      const workbook = XLSX.utils.book_new();

      if (yesterdayData.length > 0) {
        const yesterdaySheet = XLSX.utils.json_to_sheet(formatDataForExcel(yesterdayData, true));
        applyColumnWidths(yesterdaySheet, true);
        XLSX.utils.book_append_sheet(workbook, yesterdaySheet, 'Yesterday');
      }
      // Add worksheets for each period
      if (dayData.length > 0) {
        const daySheet = XLSX.utils.json_to_sheet(formatDataForExcel(dayData, true));
        applyColumnWidths(daySheet, true);
        XLSX.utils.book_append_sheet(workbook, daySheet, 'Today');
      }

      if (weekAnalytics && weekAnalytics.length > 0) {
        const weekSheet = XLSX.utils.json_to_sheet(formatDataForExcel(weekAnalytics, true));
        applyColumnWidths(weekSheet, true);
        XLSX.utils.book_append_sheet(workbook, weekSheet, 'This Week');
      }

      if (monthAnalytics && monthAnalytics.length > 0) {
        const monthSheet = XLSX.utils.json_to_sheet(formatDataForExcel(monthAnalytics, true));
        applyColumnWidths(monthSheet, true);
        XLSX.utils.book_append_sheet(workbook, monthSheet, 'This Month');
      }

      if (allTimeAnalytics && allTimeAnalytics.length > 0) {
        const allTimeSheet = XLSX.utils.json_to_sheet(formatDataForExcel(allTimeAnalytics, true));
        applyColumnWidths(allTimeSheet, true);
        XLSX.utils.book_append_sheet(workbook, allTimeSheet, 'All Time');
      }

      // Generate filename with current date
      const currentDate = format(new Date(), 'yyyy-MM-dd');
      const filename = `Team_Performance_Report_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
    } catch (error) {
      alert('Error occurred while downloading the file. Please try again.');
    } finally {
      setIsDownloading(false);
      setIsDownloadDialogOpen(false);
    }
  };

  return (
    <Card className="p-4 w-full">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Team Performance</h2>
            <p className="text-muted-foreground">Track and analyze team performance metrics</p>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'day' | 'week' | 'month' | 'all')}
        >
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="yesterday" className="text-xs">
                <Clock className="h-3 w-3 mr-1" /> Yesterday
              </TabsTrigger>
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

            <Dialog open={isDownloadDialogOpen} onOpenChange={setIsDownloadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto">
                  Download <Download className="h-4 w-4 ml-1" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[620px]">
                <DialogHeader>
                  <DialogTitle>Download Performance Report</DialogTitle>
                  <DialogDescription>
                    This will download a comprehensive Excel report containing team performance data
                    for all time periods (Today, This Week, This Month, and All Time) in separate
                    tabs.
                  </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Report Contents:</p>
                        <p className="text-sm text-muted-foreground">
                          • Today's Performance Data
                          <br />
                          • This Week's Performance Data
                          <br />
                          • This Month's Performance Data
                          <br />• All Time Performance Data
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">File Format:</p>
                        <p className="text-sm text-muted-foreground">
                          Excel (.xlsx) with multiple tabs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDownloadDialogOpen(false)}
                    disabled={isDownloading}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleDownload} disabled={isDownloading}>
                    {isDownloading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                    <Table className="border-collapse w-full">
                      <TableHeader className="sticky top-0 z-10">
                        <TableRow className="bg-primary/10 hover:bg-primary/10 backdrop-blur-lg">
                          <TableHead className="font-semibold text-primary dark:text-gray-100 w-[150px]">
                            <button
                              onClick={() => requestSort('userFirstName')}
                              className="flex items-center w-full hover:text-primary cursor-pointer"
                            >
                              Individual Level {getSortIcon('userFirstName')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('totalCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Total  Leads Reached {getSortIcon('totalCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('newLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              New Leads {getSortIcon('newLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('activeLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Active Leads {getSortIcon('activeLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('nonActiveLeadCalls')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Non-Active {getSortIcon('nonActiveLeadCalls')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('totalFootFall')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Footfall {getSortIcon('totalFootFall')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[100px]">
                            <button
                              onClick={() => requestSort('totalAdmissions')}
                              className="flex items-center justify-center w-full hover:text-primary cursor-pointer"
                            >
                              Admissions {getSortIcon('totalAdmissions')}
                            </button>
                          </TableHead>
                          <TableHead className="font-semibold text-primary dark:text-gray-100 text-center w-[300px]">
                            <button className="flex items-center justify-center w-full hover:text-primary cursor-pointer">
                              Remarks
                            </button>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedData.map((member) => (
                          <TableRow key={member._id} className="hover:bg-muted/50">
                            <TableCell className="w-[150px]">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback>
                                    {member.userFirstName[0] ?? 'N'}
                                    {member.userLastName[0] ?? 'A'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">
                                    {member.userFirstName ?? 'N/A'} {member.userLastName ?? ''}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              {Intl.NumberFormat().format(Number(member.totalCalls)) ?? '--'}
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              {Intl.NumberFormat().format(member.newLeadCalls) ?? '--'}
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              {Intl.NumberFormat().format(member.activeLeadCalls) ?? '--'}
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              {Intl.NumberFormat().format(member.nonActiveLeadCalls) ?? '--'}
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              {Intl.NumberFormat().format(member.totalFootFall) ?? '--'}
                            </TableCell>
                            <TableCell className="text-center w-[100px]">
                              <Badge variant="secondary" className="px-2">
                                {Intl.NumberFormat().format(member.totalAdmissions) ?? '--'}
                              </Badge>
                            </TableCell>
                            <TableCell className="w-[300px] px-4">
                              <div className="flex justify-center">
                                <TruncatedCell
                                  value={
                                    !member.analyticsRemark || member.analyticsRemark == ''
                                      ? '--'
                                      : member.analyticsRemark
                                  }
                                  maxWidth={280}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <tfoot className="sticky bottom-0 z-10">
                        <TableRow className="font-bold bg-primary/10 hover:bg-primary/10 backdrop-blur-3xl">
                          <TableCell className="w-[150px]">Team Total</TableCell>
                          <TableCell className="text-center w-[100px]">
                            {Intl.NumberFormat().format(totals.totalCalls) ?? '--'}
                          </TableCell>
                          <TableCell className="text-center w-[100px]">
                            {Intl.NumberFormat().format(totals.newLeadCalls) ?? '--'}
                          </TableCell>
                          <TableCell className="text-center w-[100px]">
                            {Intl.NumberFormat().format(totals.activeLeadCalls) ?? '--'}
                          </TableCell>
                          <TableCell className="text-center w-[100px]">
                            {Intl.NumberFormat().format(totals.nonActiveLeadCalls) ?? '--'}
                          </TableCell>
                          <TableCell className="text-center w-[100px]">
                            {Intl.NumberFormat().format(totals.totalFootFall) ?? '--'}
                          </TableCell>
                          <TableCell className="text-center w-[100px]">
                            <Badge variant="default" className="px-2">
                              {Intl.NumberFormat().format(totals.totalAdmissions) ?? '--'}
                            </Badge>
                          </TableCell>
                          <TableCell className="w-[300px]"></TableCell>
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
