import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
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
  WifiOffIcon,
  Sparkle,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { sourceAnalytics } from './helpers/fetch-data';
import { NoDataPreview } from '@/components/custom-ui/no-data-preview/no-data-preview';
import { useState } from 'react';

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

  return (
    <Card className="md:w-7xl w-full">
      <div className="ml-5">
        <h2 className="text-2xl font-bold">Lead Performance By Source</h2>
        <p className="text-muted-foreground">
          Track and analyze lead performance by various sources{' '}
        </p>
      </div>
      <div className="grid gap-6 p-6 w-max-6xl grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-3 col-start-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl ">
          <CardHeader className="px-6 ">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-900">
              <Users className="h-6 w-6 text-purple-600" />
              Leads Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="rounded-lg overflow-auto  border border-gray-100">
              {allLeads.length !== 0 ? (
                <Table>
                  <TableHeader className="bg-purple-50/50">
                    <TableRow className="hover:bg-purple-50/50">
                      <TableHead className="w-[150px] text-purple-900 font-semibold py-4">
                        <button
                          onClick={() => requestSort('source', 'allLeads')}
                          className="flex items-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Source {getSortIcon('source', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalLeads', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Total {getSortIcon('totalLeads', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('activeLeads', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Active {getSortIcon('activeLeads', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('neutralLeads', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Neutral {getSortIcon('neutralLeads', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('didNotPickLeads', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          No Pickup {getSortIcon('didNotPickLeads', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('others', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Others {getSortIcon('others', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('footFall', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Footfall {getSortIcon('footFall', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-purple-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalAdmissions', 'allLeads')}
                          className="flex items-center justify-center w-full hover:text-purple-700 cursor-pointer"
                        >
                          Admissions {getSortIcon('totalAdmissions', allLeadsSortConfig)}
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAllLeads.map((lead: LeadData) => (
                      <TableRow
                        key={lead.source}
                        className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors"
                      >
                        <TableCell className="font-medium flex items-center gap-3 py-4">
                          {lead.source === 'online' ? (
                            <Smartphone className="h-5 w-5 text-blue-500" />
                          ) : lead.source === 'offline' ? (
                            <Home className="h-5 w-5 text-amber-500" />
                          ) : (
                            <PlusCircle className="h-5 w-5 text-gray-500" />
                          )}
                          <span className="text-gray-800">
                            {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.totalLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.activeLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.neutralLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.didNotPickLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.others ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.footFall ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {lead.data.totalAdmissions ?? '--'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-purple-50/50 font-semibold hover:bg-purple-50/50">
                      <TableCell className="text-purple-900 font-semibold py-4">Total</TableCell>
                      <TableCell className="text-center font-bold text-gray-800">
                        {getTotal('totalLeads')}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {getTotal('activeLeads')}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {getTotal('neutralLeads')}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {getTotal('didNotPickLeads')}
                      </TableCell>
                      <TableCell className="text-center font-bold ">{getTotal('others')}</TableCell>
                      <TableCell className="text-center font-bold ">
                        {getTotal('footFall')}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {getTotal('totalAdmissions')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="w-full">
                  <NoDataPreview />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className=" col-start-1 col-span-3 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl ">
          <CardHeader className=" px-6 ">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-blue-900">
              <Globe className="h-6 w-6 text-blue-500" />
              Online Data
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="overflow-auto rounded-lg  border border-gray-100">
              {onlineData.length !== 0 ? (
                <Table>
                  <TableHeader className="bg-blue-50/50">
                    <TableRow className="hover:bg-blue-50/50">
                      <TableHead className="w-[200px] text-blue-900 font-semibold py-4">
                        <button
                          onClick={() => requestSort('source', 'online')}
                          className="flex items-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Channel {getSortIcon('source', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalLeads', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Total {getSortIcon('totalLeads', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('activeLeads', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Active {getSortIcon('activeLeads', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('neutralLeads', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Neutral {getSortIcon('neutralLeads', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('didNotPickLeads', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          No Pickup {getSortIcon('didNotPickLeads', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('others', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Others {getSortIcon('others', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('footFall', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Footfall {getSortIcon('footFall', onlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalAdmissions', 'online')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Admissions {getSortIcon('totalAdmissions', onlineSortConfig)}
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOnlineData.map((item: LeadData) => (
                      <TableRow
                        key={item.source}
                        className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors"
                      >
                        <TableCell className="font-medium flex items-center gap-3 py-4">
                          {item.source.includes('Google') ? (
                            <Globe className="h-5 w-5 text-blue-400" />
                          ) : item.source.includes('Website') ? (
                            <Laptop className="h-5 w-5 text-indigo-400" />
                          ) : (
                            <PlusCircle className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="text-gray-800">{item.source.split('- ')[1]}</span>
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.totalLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.activeLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.neutralLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.didNotPickLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.others ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.footFall ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.totalAdmissions ?? '--'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-blue-50/50 font-semibold hover:bg-blue-50/50">
                      <TableCell className="text-blue-900 font-semibold py-4">Total</TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.totalLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.activeLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.neutralLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.didNotPickLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.others ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.footFall ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {onlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.totalAdmissions ?? 0),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="w-full">
                  <NoDataPreview />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-start-1 col-span-3  bg-gradient-to-br from-white to-gray-50 border  border-gray-100 shadow-lg rounded-2xl">
          <CardHeader className="px-6 ">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold text-blue-900">
              <Home className="h-6 w-6 text-blue-500" />
              Offline Data
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="rounded-lg border overflow-auto border-gray-100">
              {offlineData.length !== 0 ? (
                <Table>
                  <TableHeader className="bg-blue-50/50">
                    <TableRow className="hover:bg-blue-50/50">
                      <TableHead className="w-[200px] text-blue-900 font-semibold py-4">
                        <button
                          onClick={() => requestSort('source', 'offline')}
                          className="flex items-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Source {getSortIcon('source', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalLeads', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Total {getSortIcon('totalLeads', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('activeLeads', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Active {getSortIcon('activeLeads', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('neutralLeads', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Neutral {getSortIcon('neutralLeads', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('didNotPickLeads', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Did Not Pick {getSortIcon('didNotPickLeads', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('others', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Others {getSortIcon('others', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('footFall', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Footfall {getSortIcon('footFall', offlineSortConfig)}
                        </button>
                      </TableHead>
                      <TableHead className="text-center text-blue-900 font-semibold">
                        <button
                          onClick={() => requestSort('totalAdmissions', 'offline')}
                          className="flex items-center justify-center w-full hover:text-blue-700 cursor-pointer"
                        >
                          Admissions {getSortIcon('totalAdmissions', offlineSortConfig)}
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedOfflineData.map((item: LeadData) => (
                      <TableRow
                        key={item.source}
                        className="border-b border-gray-100 hover:bg-amber-50/30 transition-colors"
                      >
                        <TableCell className="font-medium flex items-center gap-3 py-4">
                          {item.source === 'Student Reference' ? (
                            <UserCheck className="h-5 w-5 text-amber-500" />
                          ) : item.source === 'Technoligence' ? (
                            <Cpu className="h-5 w-5 text-teal-500" />
                          ) : (
                            <PlusCircle className="h-5 w-5 text-gray-500" />
                          )}
                          <span className="text-gray-800">{item.source}</span>
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.totalLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.activeLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.neutralLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.didNotPickLeads ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.others ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.footFall ?? '--'}
                        </TableCell>
                        <TableCell className="text-center font-medium ">
                          {item.data.totalAdmissions ?? '--'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-blue-50/50 font-semibold hover:bg-blue-50/50">
                      <TableCell className="text-blue-900 font-semibold py-4">Total</TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.totalLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.activeLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.neutralLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.didNotPickLeads ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.others ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.footFall ?? 0),
                          0
                        )}
                      </TableCell>
                      <TableCell className="text-center font-bold ">
                        {offlineData.reduce(
                          (sum: number, item: LeadData) => sum + (item.data.totalAdmissions ?? 0),
                          0
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
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
