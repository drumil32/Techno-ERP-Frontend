import { CardItem } from '@/components/custom-ui/analytic-card/techno-analytic-cards-group';
import { Course, CourseNameMapper, LeadType, ReverseCourseNameMapper } from '@/types/enum';
import { toPascal } from '@/lib/utils';

export const formatDateView = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  return `${day}/${month}/${year.slice(-2)}`;
};
export const formatTimeStampView = (dateStr: string) => {
  if (!dateStr || typeof dateStr !== 'string') return null;

  const [datePart, timePart] = dateStr.split('|').map((part) => part.trim());
  if (!datePart) return null;

  const parts = datePart.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;
  const formattedDate = `${day}/${month}/${year.slice(-2)}`;

  return timePart ? `${formattedDate} | ${timePart}` : formattedDate;
};

export const refineLeads = (data: any, assignedToDropdownData: any) => {
  const refinedLeads = data.leads?.map((lead: any, index: number) => {
    const assignedToUsers = Array.isArray(lead.assignedTo)
      ? lead.assignedTo
        .map((id: string) => assignedToDropdownData?.find((user: any) => user._id === id))
        .filter(Boolean)
      : [];

    // Create assignedToName string
    let assignedToName = 'N/A';
    let assignedToView = '-';

    if (assignedToUsers.length > 0) {
      assignedToName = assignedToUsers[0].name;
      assignedToView = assignedToUsers[0].name;

      if (assignedToUsers.length > 1) {
        assignedToName += ` +${assignedToUsers.length - 1}`;
        assignedToView += ` +${assignedToUsers.length - 1}`;
      }
    }
    const originalLeadTypeKey = lead._leadType || lead.leadType;

    return {
      _id: lead._id,
      id: index + 1,
      date: lead.date,
      dateView: formatDateView(lead.date),
      name: lead.name,
      phoneNumber: lead.phoneNumber,
      altPhoneNumber: lead.altPhoneNumber,
      altPhoneNumberView: lead.altPhoneNumber ?? '-',
      email: lead.email,
      emailView: lead.email ?? '-',
      gender: lead.gender,
      genderView: toPascal(lead.gender),
      city: lead.city,
      cityView: !lead.city || lead.city === '' ? '-' : lead.city,
      area: lead.area,
      areaView: !lead.area || lead.area === '' ? '-' : lead.area,
      course: lead.course,
      courseView: lead.course ?? '-',
      leadType: LeadType[lead.leadType as keyof typeof LeadType] ?? lead.leadType,
      _leadType: originalLeadTypeKey,
      source: lead.source,
      sourceView: lead.source ?? '-',
      assignedTo: lead.assignedTo,
      degree: lead.degree,
      schoolName: lead.schoolName,
      assignedToView: assignedToView,
      assignedToName: assignedToName,
      nextDueDate: lead.nextDueDate,
      nextDueDateView: formatDateView(lead.nextDueDate) ?? '-',
      leadsFollowUpCount: lead.leadsFollowUpCount ?? 0,
      createdAt: new Date(lead.createdAt).toLocaleString(),
      updatedAt: new Date(lead.updatedAt).toLocaleString(),
      remarks: lead.remarks,
      remarksView: lead.remarks[lead.remarks.length - 1] ?? '-',
      leadTypeModifiedDate: lead.leadTypeModifiedDate ?? 'N/A',
      leadTypeModifiedDateView: formatTimeStampView(lead.leadTypeModifiedDate) ?? 'N/A'
    };
  });

  return {
    leads: refinedLeads,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    total: data.total
  };
};

export interface AllLeadsAnalytics {
  totalLeads: number;
  openLeads: number;
  interestedLeads: number;
  notInterestedLeads: number;
  neutralLeads: number;
  didNotPickLeads: number;
}

export const refineAnalytics = (analytics: any) => {
  const totalLeads = analytics.totalLeads ?? 0;

  const calculatePercentage = (count: number) => {
    if (totalLeads === 0) return '0%';
    return `${Math.round((count / totalLeads) * 100)}%`;
  };
  const analyticsCardsData: CardItem[] = [
    {
      heading: analytics.totalLeads ?? '',
      subheading: '100%',
      title: 'Total Leads',
      color: 'text-black'
    },
    {
      heading: analytics.leftOverLeads ?? '',
      subheading: calculatePercentage(analytics.leftOverLeads),
      title: 'Left Over Leads',
      color: 'text-orange-600'
    },
    {
      heading: analytics.activeLeads ?? '',
      subheading: calculatePercentage(analytics.activeLeads),
      title: 'Active Leads',
      color: 'text-yellow-600'
    },
    {
      heading: analytics.notInterestedLeads ?? '',
      subheading: calculatePercentage(analytics.notInterestedLeads),
      title: 'Not Interested',
      color: 'text-red-700'
    },
    {
      heading: analytics.neutralLeads ?? '',
      subheading: calculatePercentage(analytics.neutralLeads),
      title: 'Neutral Data',
      color: 'text-[#006ED8]'
    },
    {
      heading: analytics.didNotPickLeads ?? '',
      subheading: calculatePercentage(analytics.didNotPickLeads),
      title: 'Did Not Pick',
      color: 'text-pink-700'
    }
  ];
  return analyticsCardsData;
};
