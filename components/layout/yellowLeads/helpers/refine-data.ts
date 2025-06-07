import { CardItem } from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { toPascal } from '@/lib/utils';
import { formatTimeStampView, formatDateView } from '../../allLeads/helpers/refine-data';
import { FinalConversionStatus } from '@/types/enum';
export const refineLeads = (data: any, assignedToDropdownData: any) => {
  const refinedLeads = data.yellowLeads?.map((lead: any, index: number) => {
    const assignedToUsers = Array.isArray(lead.assignedTo)
      ? lead.assignedTo
          .map((id: string) => assignedToDropdownData?.find((user: any) => user._id === id))
          .filter(Boolean)
      : [];
    const assignedToName =
      assignedToUsers.length > 0
        ? `${assignedToUsers[0].name}${assignedToUsers.length > 1 ? ` +${assignedToUsers.length - 1}` : ''}`
        : 'N/A';

    const assignedTo = assignedToDropdownData.find((item:any) => item._id == lead.assignedTo)?.name || 'Not Provided'

    return {
      _id: lead._id,
      id: index + 1,
      name: lead.name,
      phoneNumber: lead.phoneNumber,
      altPhoneNumber: lead.altPhoneNumber,
      altPhoneNumberView: lead.altPhoneNumber ?? '-',
      email: lead.email,
      gender: lead.gender,
      genderView: toPascal(lead.gender),
      assignedTo: lead.assignedTo,
      assignedToName: assignedTo,
      area: lead.area,
      areaView: !lead.area || lead.area === '' ? '-' : lead.area,
      city: lead.city,
      cityView: !lead.city || lead.city === '' ? '-' : lead.city,
      course: lead.course,
      courseView: lead.course ?? '-',
      footFall: lead.footFall,
      schoolName: lead.schoolName,
      source: lead.source,
      sourceView: lead.source ?? '-',
      degree: lead.degree,
      finalConversion:
        FinalConversionStatus[lead.finalConversion as keyof typeof FinalConversionStatus] ??
        lead.finalConversion,
      followUpCount: lead.followUpCount,
      remarks: lead.remarks,
      remarksView: lead.remarks ? [...lead.remarks].reverse().join(' | ') : '-',
      date: lead.date,
      leadTypeModifiedDate:
        formatTimeStampView(lead.leadTypeModifiedDate) ?? formatDateView(lead.date),
      nextDueDate: lead.nextDueDate,
      nextDueDateView: formatDateView(lead.nextDueDate) ?? '-',
      createdAt: new Date(lead.createdAt).toLocaleString(),
      // updatedAt: lead.updatedAt ?? 'N/A',
      lastCallDate: lead.lastCallDate ?? 'N/A',
      isOlderThan7Days: lead.isOlderThan7Days
    };
  });
  return {
    leads: refinedLeads,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    total: data.total
  };
};

export interface YellowLeadAnalytics {
  allLeadsCount: number;
  campusVisitTrueCount: number;
  activeYellowLeadsCount: number;
  deadLeadCount: number;
  admissions: number;
  neutral: number;
}

export const refineAnalytics = (analytics: YellowLeadAnalytics) => {
  const allLeadsCount = analytics.allLeadsCount ?? 0;

  const calculatePercentage = (count: number) => {
    if (allLeadsCount === 0) return '0%';
    return `${Math.round((count / allLeadsCount) * 100)}%`;
  };
  const analyticsCardsData: CardItem[] = [
    {
      heading: String(analytics.allLeadsCount ?? ''),
      subheading: '100%',
      title: 'Total Active Leads',
      color: 'text-black'
    },
    {
      heading: String(analytics.activeYellowLeadsCount ?? ''),
      subheading: calculatePercentage(analytics.activeYellowLeadsCount ?? 0),
      title: 'No Footfall',
      color: 'text-yellow-600'
    },
    {
      heading: String(analytics.campusVisitTrueCount ?? ''),
      subheading: calculatePercentage(analytics.campusVisitTrueCount ?? 0),
      title: 'Footfall',
      color: 'text-orange-600'
    },
    {
      heading: String(analytics.neutral ?? ''),
      subheading: calculatePercentage(analytics.neutral ?? 0),
      title: 'Neutral',
      color: 'text-[#006ED8]'
    },
    {
      heading: String(analytics.deadLeadCount ?? ''),
      subheading: calculatePercentage(analytics.deadLeadCount ?? 0),
      title: 'Dead Leads',
      color: 'text-red-700'
    },
    {
      heading: String(analytics.admissions ?? ''),
      subheading: calculatePercentage(analytics.admissions ?? 0),
      title: 'Admissions',
      color: 'text-[#0EA80E]'
    }
  ];
  return analyticsCardsData;
};
