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
  Facebook,
  Phone,
  MessageSquare,
  Home,
  UserCheck,
  Cpu,
  PlusCircle
} from 'lucide-react';

export function LeadTables() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Users className="h-5 w-5" />
            Leads Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[150px]">Source</TableHead>
                <TableHead className="text-center">
                  <Bookmark className="mx-auto h-4 w-4" />
                  Total
                </TableHead>
                <TableHead className="text-center">
                  <Activity className="mx-auto h-4 w-4" />
                  Active
                </TableHead>
                <TableHead className="text-center">
                  <HelpCircle className="mx-auto h-4 w-4" />
                  Neutral
                </TableHead>
                <TableHead className="text-center">
                  <PhoneOff className="mx-auto h-4 w-4" />
                  No Pickup
                </TableHead>
                <TableHead className="text-center">
                  <PlusCircle className="mx-auto h-4 w-4" />
                  Others
                </TableHead>
                <TableHead className="text-center">
                  <Footprints className="mx-auto h-4 w-4" />
                  Footfall
                </TableHead>
                <TableHead className="text-center">
                  <School className="mx-auto h-4 w-4" />
                  Admissions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Digital
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">14</TableCell>
                <TableCell className="text-center">40</TableCell>
                <TableCell className="text-center">12</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Offline
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">13</TableCell>
                <TableCell className="text-center">16</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-center">200</TableCell>
                <TableCell className="text-center">29</TableCell>
                <TableCell className="text-center">55</TableCell>
                <TableCell className="text-center">25</TableCell>
                <TableCell className="text-center">31</TableCell>
                <TableCell className="text-center">30</TableCell>
                <TableCell className="text-center">8</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Online Data */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Globe className="h-5 w-5" />
            Online Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="w-[200px]">Channel</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Neutral</TableHead>
                <TableHead className="text-center">No Pickup</TableHead>
                <TableHead className="text-center">Others</TableHead>
                <TableHead className="text-center">Footfall</TableHead>
                <TableHead className="text-center">Admissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Google Ads
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">14</TableCell>
                <TableCell className="text-center">40</TableCell>
                <TableCell className="text-center">12</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Meta Ads
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">13</TableCell>
                <TableCell className="text-center">16</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  IVR
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">16</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">14</TableCell>
                <TableCell className="text-center">17</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  TawkTo
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">17</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">18</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Laptop className="h-4 w-4" />
                  Website
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">18</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">16</TableCell>
                <TableCell className="text-center">18</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-center">500</TableCell>
                <TableCell className="text-center">80</TableCell>
                <TableCell className="text-center">75</TableCell>
                <TableCell className="text-center">70</TableCell>
                <TableCell className="text-center">84</TableCell>
                <TableCell className="text-center">75</TableCell>
                <TableCell className="text-center">20</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Offline Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <UserCheck className="h-5 w-5" />
            Offline Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead className="text-center">Total</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Admissions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  LU/NPG
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">14</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  References
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">15</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Technoligence
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">16</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Others
                </TableCell>
                <TableCell className="text-center">100</TableCell>
                <TableCell className="text-center">17</TableCell>
                <TableCell className="text-center">4</TableCell>
              </TableRow>
              <TableRow className="bg-gray-50 font-semibold">
                <TableCell className="font-medium">Total</TableCell>
                <TableCell className="text-center">400</TableCell>
                <TableCell className="text-center">62</TableCell>
                <TableCell className="text-center">16</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
