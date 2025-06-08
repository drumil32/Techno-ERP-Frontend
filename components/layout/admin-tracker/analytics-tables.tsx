import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Activity,
  Smartphone,
  Laptop,
  PhoneOff,
  HelpCircle,
  Footprints,
  School,
  Bookmark,
  Globe,
  UserCheck,
  Cpu,
  PlusCircle,
  Home,
  Sparkle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  PhoneForwarded,
  PhoneCall,
  Facebook,
  MessageSquare,
  MessageCircleIcon,
  BookOpenCheckIcon,
  PencilRuler,
  GraduationCapIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { sourceAnalytics } from './helpers/fetch-data';
import { NoDataPreview } from '@/components/custom-ui/no-data-preview/no-data-preview';
import { useState } from 'react';
import { FaFacebook } from 'react-icons/fa6';

type LeadData = {
  source: string;
  data: {
    totalLeads: number;
    activeLeads: number;
    neutralLeads: number;
    didNotPickLeads: number;
    others: number;
    footFall: number;
    totalAdmissions: number;
  };
};

type SortConfig = {
  key: keyof LeadData['data'] | 'source';
  direction: 'ascending' | 'descending';
};

export function LeadTables() {
  const [allLeadsSortConfig, setAllLeadsSortConfig] = useState<SortConfig>({
    key: 'source',
    direction: 'ascending'
  });

  const [onlineSortConfig, setOnlineSortConfig] = useState<SortConfig>({
    key: 'source',
    direction: 'ascending'
  });

  const [offlineSortConfig, setOfflineSortConfig] = useState<SortConfig>({
    key: 'source',
    direction: 'ascending'
  });

  const [allLeadsTab, setAllLeadsTab] = useState('numbers');
  const [onlineTab, setOnlineTab] = useState('numbers');
  const [offlineTab, setOfflineTab] = useState('numbers');

  const { data } = useQuery({
    queryKey: ['sourceAnalytics'],
    queryFn: sourceAnalytics
  });

  const sourceData = Array.isArray(data) ? data : [];
  const offlineData = sourceData?.find((item) => item.type === 'offline-data')?.details || [];
  const onlineData = sourceData?.find((item) => item.type === 'online-data')?.details || [];
  const allLeads = sourceData?.find((item) => item.type === 'all-leads')?.details || [];

  const getTotal = (key: keyof LeadData['data']) =>
    allLeads.reduce((sum: number, item: LeadData) => sum + (item.data?.[key] ?? 0), 0);

  const getOnlineTotal = (key: keyof LeadData['data']) =>
    onlineData.reduce((sum: number, item: LeadData) => sum + (item.data?.[key] ?? 0), 0);

  const getOfflineTotal = (key: keyof LeadData['data']) =>
    offlineData.reduce((sum: number, item: LeadData) => sum + (item.data?.[key] ?? 0), 0);

  const calculatePercentage = (value: number, total: number) => {
    if (!total || total === 0) return '0.00%';
    return `${((value / total) * 100).toFixed(2)}%`;
  };

  const formatValue = (value: number, showPercentage: boolean, totalValue?: number) => {
    if (value === null || value === undefined) return '--';
    if (showPercentage && totalValue) {
      return calculatePercentage(value, totalValue);
    }
    return Intl.NumberFormat().format(Number(value.toString()));
  };

  const sortData = (data: LeadData[], sortConfig: SortConfig): LeadData[] => {
    return [...data].sort((a, b) => {
      if (sortConfig.key === 'source') {
        const aValue = a.source.toLowerCase();
        const bValue = b.source.toLowerCase();
        return sortConfig.direction === 'ascending'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        const aValue = a.data?.[sortConfig.key] ?? 0;
        const bValue = b.data?.[sortConfig.key] ?? 0;
        return sortConfig.direction === 'ascending'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
    });
  };

  const requestSort = (
    key: keyof LeadData['data'] | 'source',
    table: 'allLeads' | 'online' | 'offline'
  ) => {
    const currentConfig =
      table === 'allLeads'
        ? allLeadsSortConfig
        : table === 'online'
          ? onlineSortConfig
          : offlineSortConfig;

    const newConfig: SortConfig = {
      key,
      direction:
        currentConfig?.key === key && currentConfig.direction === 'ascending'
          ? 'descending'
          : 'ascending'
    };

    if (table === 'allLeads') {
      setAllLeadsSortConfig(newConfig);
    } else if (table === 'online') {
      setOnlineSortConfig(newConfig);
    } else {
      setOfflineSortConfig(newConfig);
    }
  };

  const getSortIcon = (key: keyof LeadData['data'] | 'source', sortConfig: SortConfig) => {
    if (!sortConfig || sortConfig.key !== key)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />;
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  const sortedAllLeads = sortData(allLeads, allLeadsSortConfig);
  const sortedOnlineData = sortData(onlineData, onlineSortConfig);
  const sortedOfflineData = sortData(offlineData, offlineSortConfig);

  const renderTable = (
    leads: LeadData[],
    sortConfig: SortConfig,
    tableType: 'allLeads' | 'online' | 'offline',
    showPercentage: boolean,
    getTotalFn: (key: keyof LeadData['data']) => number,
    colorScheme: 'purple' | 'blue'
  ) => {
    const totalLeadsValue = getTotalFn('totalLeads');

    return (
      <Table>
        <TableHeader
          className={`${colorScheme === 'purple' ? 'bg-purple-50/50' : 'bg-blue-50/50'}`}
        >
          <TableRow
            className={`hover:${colorScheme === 'purple' ? 'bg-purple-50/50' : 'bg-blue-50/50'}`}
          >
            <TableHead
              className={`w-[150px] ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold py-4`}
            >
              <button
                onClick={() => requestSort('source', tableType)}
                className={`flex items-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                {tableType === 'online' ? 'Channel' : 'Source'} {getSortIcon('source', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('totalLeads', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Total {getSortIcon('totalLeads', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('activeLeads', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Active {getSortIcon('activeLeads', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('neutralLeads', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Neutral {getSortIcon('neutralLeads', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('didNotPickLeads', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                {tableType === 'offline' ? 'Did Not Pick' : 'No Pickup'}{' '}
                {getSortIcon('didNotPickLeads', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('others', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Others {getSortIcon('others', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('footFall', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Footfall {getSortIcon('footFall', sortConfig)}
              </button>
            </TableHead>
            <TableHead
              className={`text-center ${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold`}
            >
              <button
                onClick={() => requestSort('totalAdmissions', tableType)}
                className={`flex items-center justify-center w-full hover:${colorScheme === 'purple' ? 'text-purple-700' : 'text-blue-700'} cursor-pointer`}
              >
                Admissions {getSortIcon('totalAdmissions', sortConfig)}
              </button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead: LeadData) => (
            <TableRow
              key={lead.source}
              className={`border-b border-gray-100 hover:${colorScheme === 'purple' ? 'bg-purple-50/30' : colorScheme === 'blue' ? 'bg-blue-50/30' : 'bg-amber-50/30'} transition-colors`}
            >
              <TableCell className="font-medium flex items-center gap-3 py-4">
                {tableType === 'allLeads' ? (
                  lead.source === 'online' ? (
                    <Smartphone className="h-5 w-5 text-blue-500" />
                  ) : lead.source === 'offline' ? (
                    <Home className="h-5 w-5 text-amber-500" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-gray-500" />
                  )
                ) : tableType === 'online' ? (
                  lead.source.includes('Google') ? (
                    <Globe className="h-5 w-5 text-blue-400" />
                  ) : lead.source.includes('Website') ? (
                    <Laptop className="h-5 w-5 text-indigo-400" />
                  ) : lead.source.includes('IVR') ? (
                    <PhoneForwarded className="h-5 w-5 text-orange-500" />
                  ) : lead.source.includes('Direct') ? (
                    <PhoneCall className="h-5 w-5 text-green-500" />
                  ) : lead.source.includes('Meta') ? (
                    <FaFacebook className="h-5 w-5 text-blue-600" />
                  ) : lead.source.includes('Tawk') ? (
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                  ) : lead.source.includes('WhatsApp') ? (
                    <MessageCircleIcon className="h-5 w-5 text-green-600" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-gray-400" />
                  )
                )
                  : lead.source === 'Student Reference' ? (
                    <UserCheck className="h-5 w-5 text-amber-500" />
                  ) : lead.source === 'Technoligence' ? (
                    <Cpu className="h-5 w-5 text-teal-500" />
                  ) : lead.source === 'Board Exam' ? (
                    <BookOpenCheckIcon className="h-5 w-5 text-purple-500" />
                  ) : lead.source === 'CUET' ? (
                    <PencilRuler className="h-5 w-5 text-pink-500" />
                  ) : lead.source === 'PG Data' ? (
                    <GraduationCapIcon className="h-5 w-5 text-indigo-500" />
                  ) : lead.source === 'UG Data' ? (
                    <School className="h-5 w-5 text-blue-500" />
                  ) : (
                    <PlusCircle className="h-5 w-5 text-gray-500" />
                  )}
                <span className="text-gray-800">
                  {tableType === 'allLeads'
                    ? lead.source.charAt(0).toUpperCase() + lead.source.slice(1)
                    : tableType === 'online'
                      ? lead.source.split('- ')[1] || lead.source
                      : lead.source}
                </span>
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.totalLeads, false)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.activeLeads, showPercentage, lead.data.totalLeads)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.neutralLeads, showPercentage, lead.data.totalLeads)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.didNotPickLeads, showPercentage, lead.data.totalLeads)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.others, showPercentage, lead.data.totalLeads)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.footFall, showPercentage, lead.data.totalLeads)}
              </TableCell>
              <TableCell className="text-center font-medium">
                {formatValue(lead.data.totalAdmissions, showPercentage, lead.data.totalLeads)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow
            className={`${colorScheme === 'purple' ? 'bg-purple-50/50' : 'bg-blue-50/50'} font-semibold hover:${colorScheme === 'purple' ? 'bg-purple-50/50' : 'bg-blue-50/50'}`}
          >
            <TableCell
              className={`${colorScheme === 'purple' ? 'text-purple-900' : 'text-blue-900'} font-semibold py-4`}
            >
              Total
            </TableCell>
            <TableCell className="text-center font-bold text-gray-800">
              {Intl.NumberFormat().format(Number(getTotalFn('totalLeads')))}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('activeLeads'), showPercentage, totalLeadsValue)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('neutralLeads'), showPercentage, totalLeadsValue)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('didNotPickLeads'), showPercentage, totalLeadsValue)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('others'), showPercentage, totalLeadsValue)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('footFall'), showPercentage, totalLeadsValue)}
            </TableCell>
            <TableCell className="text-center font-bold">
              {formatValue(getTotalFn('totalAdmissions'), showPercentage, totalLeadsValue)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  };

  return (
    <Card className="md:w-7xl w-full">
      <div className="ml-5">
        <h2 className="text-2xl font-bold">Lead Performance By Source</h2>
        <p className="text-muted-foreground">
          Track and analyze lead performance by various sources{' '}
        </p>
      </div>
      <div className="grid gap-6 p-6 w-max-6xl grid-cols-2 lg:grid-cols-3">
        {/* All Leads Summary */}
        <Card className="col-span-3 col-start-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl">
          <CardHeader className="px-6">
            <div className="flex items-center gap-5">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-900">
                <Users className="h-6 w-6 text-purple-600" />
                Leads Summary
              </CardTitle>
              <Tabs defaultValue="numbers">
                <TabsList>
                  <TabsTrigger
                    value="numbers"
                    className="text-xs"
                    onClick={() => setAllLeadsTab('numbers')}
                  >
                    Numbers
                  </TabsTrigger>
                  <TabsTrigger
                    value="percentage"
                    className="text-xs"
                    onClick={() => setAllLeadsTab('percentage')}
                  >
                    Percentage
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg overflow-auto border border-gray-100">
              {allLeads.length !== 0 ? (
                renderTable(
                  sortedAllLeads,
                  allLeadsSortConfig,
                  'allLeads',
                  allLeadsTab === 'percentage',
                  getTotal,
                  'purple'
                )
              ) : (
                <div className="w-full">
                  <NoDataPreview />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Online Data */}
        <Card className="col-start-1 col-span-3 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl">
          <CardHeader className="px-6">
            <div className="flex items-center gap-5">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-blue-900">
                <Globe className="h-6 w-6 text-blue-500" />
                Online Data
              </CardTitle>
              <Tabs defaultValue="numbers">
                <TabsList>
                  <TabsTrigger
                    value="numbers"
                    className="text-xs"
                    onClick={() => setOnlineTab('numbers')}
                  >
                    Numbers
                  </TabsTrigger>
                  <TabsTrigger
                    value="percentage"
                    className="text-xs"
                    onClick={() => setOnlineTab('percentage')}
                  >
                    Percentage
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-lg border border-gray-100">
              {onlineData.length !== 0 ? (
                renderTable(
                  sortedOnlineData,
                  onlineSortConfig,
                  'online',
                  onlineTab === 'percentage',
                  getOnlineTotal,
                  'blue'
                )
              ) : (
                <div className="w-full">
                  <NoDataPreview />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Offline Data */}
        <Card className="col-start-1 col-span-3 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl">
          <CardHeader className="px-6">
            <div className="flex items-center gap-5">
              <CardTitle className="flex items-center gap-3 text-xl font-semibold text-blue-900">
                <Home className="h-6 w-6 text-blue-500" />
                Offline Data
              </CardTitle>
              <Tabs defaultValue="numbers">
                <TabsList>
                  <TabsTrigger
                    value="numbers"
                    className="text-xs"
                    onClick={() => setOfflineTab('numbers')}
                  >
                    Numbers
                  </TabsTrigger>
                  <TabsTrigger
                    value="percentage"
                    className="text-xs"
                    onClick={() => setOfflineTab('percentage')}
                  >
                    Percentage
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-auto border-gray-100">
              {offlineData.length !== 0 ? (
                renderTable(
                  sortedOfflineData,
                  offlineSortConfig,
                  'offline',
                  offlineTab === 'percentage',
                  getOfflineTotal,
                  'blue'
                )
              ) : (
                <div className="w-full">
                  <NoDataPreview />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}
