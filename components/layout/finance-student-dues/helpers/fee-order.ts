import { FinanceFeeType } from '@/types/enum';

export const FEE_CATEGORY_ORDER: FinanceFeeType[] = [
  FinanceFeeType.SEMESTERFEE,
  FinanceFeeType.PROSPECTUS, // ONE-TIME
  FinanceFeeType.STUDENTID, // ONE-TIME
  FinanceFeeType.UNIFORM, // ONE-TIME
  FinanceFeeType.STUDENTWELFARE, // YEARLY
  FinanceFeeType.BOOKBANK, // SEMESTERWISE
  FinanceFeeType.EXAMFEES,
  FinanceFeeType.HOSTEL, // OPTIONAL
  FinanceFeeType.TRANSPORT, // OPTIONAL
  FinanceFeeType.MISCELLANEOUS // OTHERS
];

export const sortFeeDetailsByOrder = (
  details: Array<{
    feeCategory: FinanceFeeType;
    [key: string]: any;
  }>
) => {
  return details.sort((a, b) => {
    const indexA = FEE_CATEGORY_ORDER.indexOf(a.feeCategory);
    const indexB = FEE_CATEGORY_ORDER.indexOf(b.feeCategory);

    const orderA = indexA === -1 ? FEE_CATEGORY_ORDER.length : indexA;
    const orderB = indexB === -1 ? FEE_CATEGORY_ORDER.length : indexB;

    return orderA - orderB;
  });
};
