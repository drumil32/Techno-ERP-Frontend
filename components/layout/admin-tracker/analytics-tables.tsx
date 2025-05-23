import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
  WifiOffIcon
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { sourceAnalytics } from './helpers/fetch-data';

export function LeadTables() {
  const { data } = useQuery({
    queryKey: ['sourceAnalytics'],
    queryFn: sourceAnalytics
  });

  const sourceData = Array.isArray(data) ? data : [];
  const offlineData = sourceData?.find((item) => item.type === 'offline-data')?.details || [];
  const onlineData = sourceData?.find((item) => item.type === 'online-data')?.details || [];
  const allLeads = sourceData?.find((item) => item.type === 'all-leads')?.details || [];

  const getTotal = (key: string) =>
    allLeads.reduce((sum: number, item: any) => sum + (item.data[key] || 0), 0);

  return (
    <div className="grid gap-6 p-6 w-full   grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2 col-start-1 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl ">
        <CardHeader className="px-6 ">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-purple-900">
            <Users className="h-6 w-6 text-purple-600" />
            Leads Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="rounded-lg overflow-auto  border border-gray-100">
            <Table>
              <TableHeader className="bg-purple-50/50">
                <TableRow className="hover:bg-purple-50/50">
                  <TableHead className="w-[150px] text-purple-900 font-semibold py-4">
                    Source
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">Total</TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    Active
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    Neutral
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    No Pickup
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    Others
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    Footfall
                  </TableHead>
                  <TableHead className="text-center text-purple-900 font-semibold">
                    Admissions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLeads.map((lead: any) => (
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
                    <TableCell className="text-center font-medium text-gray-700">
                      {lead.data.totalLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-600">
                      {lead.data.activeLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-yellow-600">
                      {lead.data.neutralLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-red-600">
                      {lead.data.didNotPickLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-gray-600">
                      {lead.data.others}
                    </TableCell>
                    <TableCell className="text-center font-medium text-purple-600">
                      {lead.data.footFall}
                    </TableCell>
                    <TableCell className="text-center font-medium text-emerald-600">
                      {lead.data.totalAdmissions}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-purple-50/50 font-semibold hover:bg-purple-50/50">
                  <TableCell className="text-purple-900 font-semibold py-4">Total</TableCell>
                  <TableCell className="text-center font-bold text-gray-800">
                    {getTotal('totalLeads')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {getTotal('activeLeads')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-yellow-600">
                    {getTotal('neutralLeads')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-600">
                    {getTotal('didNotPickLeads')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-600">
                    {getTotal('others')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-purple-600">
                    {getTotal('footFall')}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-600">
                    {getTotal('totalAdmissions')}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className=" col-start-1 col-span-2 bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg rounded-2xl ">
        <CardHeader className=" px-6 ">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-blue-900">
            <Globe className="h-6 w-6 text-blue-500" />
            Online Data
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="overflow-auto rounded-lg  border border-gray-100">
            <Table>
              <TableHeader className="bg-blue-50/50">
                <TableRow className="hover:bg-blue-50/50">
                  <TableHead className="w-[200px] text-blue-900 font-semibold py-4">
                    Channel
                  </TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">Total</TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">Active</TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">Neutral</TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">
                    No Pickup
                  </TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">Others</TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">
                    Footfall
                  </TableHead>
                  <TableHead className="text-center text-blue-900 font-semibold">
                    Admissions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {onlineData.map((item: any) => (
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
                    <TableCell className="text-center font-medium text-gray-700">
                      {item.data.totalLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-600">
                      {item.data.activeLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-yellow-600">
                      {item.data.neutralLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-red-600">
                      {item.data.didNotPickLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-gray-600">
                      {item.data.others}
                    </TableCell>
                    <TableCell className="text-center font-medium text-purple-600">
                      {item.data.footFall}
                    </TableCell>
                    <TableCell className="text-center font-medium text-emerald-600">
                      {item.data.totalAdmissions}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-blue-50/50 font-semibold hover:bg-blue-50/50">
                  <TableCell className="text-blue-900 font-semibold py-4">Total</TableCell>
                  <TableCell className="text-center font-bold text-gray-800">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.totalLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.activeLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-yellow-600">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.neutralLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-600">
                    {onlineData.reduce(
                      (sum: number, item: any) => sum + item.data.didNotPickLeads,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-600">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.others, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-purple-600">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.footFall, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-600">
                    {onlineData.reduce(
                      (sum: number, item: any) => sum + item.data.totalAdmissions,
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="col-start-1 col-span-2  bg-gradient-to-br from-white to-gray-50 border  border-gray-100 shadow-lg rounded-2xl">
        <CardHeader className="px-6 ">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-amber-900">
            <WifiOffIcon className="h-6 w-6 text-amber-500" />
            Offline Data
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="rounded-lg border overflow-auto border-gray-100">
            <Table>
              <TableHeader className="bg-amber-50/50">
                <TableRow className="hover:bg-amber-50/50">
                  <TableHead className="w-[200px] text-amber-900 font-semibold py-4">
                    Source
                  </TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">Total</TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">Active</TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">
                    Neutral
                  </TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">
                    Did Not Pick
                  </TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">Others</TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">
                    Footfall
                  </TableHead>
                  <TableHead className="text-center text-amber-900 font-semibold">
                    Admissions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offlineData.map((item: any) => (
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
                    <TableCell className="text-center font-medium text-gray-700">
                      {item.data.totalLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-600">
                      {item.data.activeLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-yellow-600">
                      {item.data.neutralLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-red-600">
                      {item.data.didNotPickLeads}
                    </TableCell>
                    <TableCell className="text-center font-medium text-gray-600">
                      {item.data.others}
                    </TableCell>
                    <TableCell className="text-center font-medium text-purple-600">
                      {item.data.footFall}
                    </TableCell>
                    <TableCell className="text-center font-medium text-emerald-600">
                      {item.data.totalAdmissions}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-amber-50/50 font-semibold hover:bg-amber-50/50">
                  <TableCell className="text-amber-900 font-semibold py-4">Total</TableCell>
                  <TableCell className="text-center font-bold text-gray-800">
                    {offlineData.reduce((sum: number, item: any) => sum + item.data.totalLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-green-600">
                    {offlineData.reduce((sum: number, item: any) => sum + item.data.activeLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-yellow-600">
                    {onlineData.reduce((sum: number, item: any) => sum + item.data.neutralLeads, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-red-600">
                    {offlineData.reduce(
                      (sum: number, item: any) => sum + item.data.didNotPickLeads,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-center font-bold text-gray-600">
                    {offlineData.reduce((sum: number, item: any) => sum + item.data.others, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-purple-600">
                    {offlineData.reduce((sum: number, item: any) => sum + item.data.footFall, 0)}
                  </TableCell>
                  <TableCell className="text-center font-bold text-emerald-600">
                    {offlineData.reduce(
                      (sum: number, item: any) => sum + item.data.totalAdmissions,
                      0
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
