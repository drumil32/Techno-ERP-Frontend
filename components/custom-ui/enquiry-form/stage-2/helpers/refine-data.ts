const isEmpty = (value: any) => value === null || value === undefined || value === '';

export const cleanDataForDraft = (data: any) => {
  if (data === null || data === undefined) {
    return undefined;
  }

  const cleaned: any = {};

  if (Array.isArray(data.otherFees)) {
    const cleanedOtherFees = data.otherFees.filter((fee: any) =>
      fee &&
      !isEmpty(fee.type) &&
      typeof fee.finalFee === 'number' && fee.finalFee >= 0
    );
    const minimalOtherFees = cleanedOtherFees.map((fee: any) => ({
      type: fee.type,
      finalFee: fee.finalFee,
      ...(typeof fee.feesDepositedTOA === 'number' && { feesDepositedTOA: fee.feesDepositedTOA }),
      ...(fee.remarks && { remarks: fee.remarks })
    }))

    if (minimalOtherFees.length > 0) {
      cleaned.otherFees = minimalOtherFees;
    }
  }

  if (Array.isArray(data.semWiseFees)) {
    const cleanedSemWiseFees = data.semWiseFees.filter((fee: any) =>
      fee &&
      typeof fee.finalFee === 'number' && fee.finalFee >= 0
    );
    const minimalSemWiseFees = cleanedSemWiseFees.map((fee: any) => ({
      finalFee: fee.finalFee
    }));

    if (minimalSemWiseFees.length > 0) {
      cleaned.semWiseFees = minimalSemWiseFees;
    }
  }

  if (data.feesClearanceDate) {
    cleaned.feesClearanceDate = data.feesClearanceDate;
  }

  if (Array.isArray(data.counsellor)) {
    const validCounsellors = data.counsellor.filter((c: any) => !isEmpty(c));
    if (validCounsellors.length >= 0) {
      cleaned.counsellor = validCounsellors;
    }
  }


  if (Array.isArray(data.telecaller)) {
    const validTelecaller = data.telecaller.filter((c: any) => !isEmpty(c));
    if (validTelecaller.length >= 0) {
      cleaned.telecaller = validTelecaller;
    }
  }

  if(data.remarks) {
    cleaned.remarks = data.remarks
  }

  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};
