import { CardItem } from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { CampusVisitStatus } from '../campus-visit-tag';
import { FinalConversionStatus } from '../final-conversion-tag';
import { Course, CourseNameMapper } from '@/types/enum';

export const refineLeads = (data: any, assignedToDropdownData: any) => {
  const refinedLeads = data.yellowLeads?.map((lead: any, index: number) => {
    const assignedToUser = assignedToDropdownData?.find(
      (user: any) => user._id === lead.assignedTo
    );
    const assignedToName = assignedToUser ? assignedToUser.name : 'N/A';

    return {
      _id: lead._id,
      id: index + 1,
      name: lead.name,
      phoneNumber: lead.phoneNumber,
      altPhoneNumber: lead.altPhoneNumber ,
      altPhoneNumberView: lead.altPhoneNumber ?? '-',
      email: lead.email ?? '-',
      gender: lead.gender,
      assignedTo: lead.assignedTo ?? '-',
      assignedToName: assignedToName,
      location: lead.location,
      locationView: lead.location ?? '-',
      course: lead.course,
      courseView:CourseNameMapper[lead.course as Course] ?? '-',
      campusVisit:
        CampusVisitStatus[lead.campusVisit as keyof typeof CampusVisitStatus] ?? lead.campusVisit,
      finalConversion:
        FinalConversionStatus[lead.finalConversion as keyof typeof FinalConversionStatus] ??
        lead.finalConversion,
      remarks: lead.remarks,
      remarksView: lead.remarks ?? '-',
      date: lead.date,
      ltcDate: lead.ltcDate ?? '-',
      nextDueDate: lead.nextDueDate,
      nextDueDateView: lead.nextDueDate ?? '-',
      createdAt: new Date(lead.createdAt).toLocaleString(),
      updatedAt: new Date(lead.updatedAt).toLocaleString()
    };
  });

  return {
    leads: refinedLeads,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    total: data.total
  };
};

export const refineAnalytics = (analytics: any) => {
  const totalLeads = analytics.totalLeads ?? 0;

  const calculatePercentage = (count: number) => {
    if (totalLeads === 0) return '0%';
    return `${Math.round((count / totalLeads) * 100)}%`;
  };
  const analyticsCardsData: CardItem[] = [
    {
      heading: String(analytics.allLeadsCount ?? ''),
      subheading: '100%',
      title: 'Total Yellow Leads',
      color: 'text-black'
    },
    {
      heading: String(analytics.campusVisitTrueCount ?? ''),
      subheading: calculatePercentage(analytics.campusVisitTrueCount ?? 0),
      title: 'Campus Visits',
      color: 'text-orange-600'
    },
    {
      heading: String(analytics.activeYellowLeadsCount ?? ''),
      subheading: calculatePercentage(analytics.activeYellowLeadsCount ?? 0),
      title: 'Active Yellow Leads',
      color: 'text-yellow-600'
    },
    {
      heading: String(analytics.deadLeadCount ?? ''),
      subheading: calculatePercentage(analytics.deadLeadCount ?? 0),
      title: 'Dead Leads',
      color: 'text-red-700'
    }
  ];
  return analyticsCardsData;
};
