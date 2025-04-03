export const cleanDataForDraft = (data: any): any => {
    if (data === null || data === undefined) {
        return undefined;
    }

    // if (data instanceof Date) {
    //     return isValid(data) ? format(data, 'dd/MM/yyyy') : undefined;
    // }

    // if (Array.isArray(data)) {
    //     const cleanedArray = data
    //         .map(item => cleanDataForDraft(item))
    //         .filter(item => {
    //             if (item === undefined) return false;

    //             if (typeof item === 'object' && item !== null) {
    //                 if ('type' in item && Object.values(FeeType).includes(item.type)) {
    //                     if (item.finalFee === undefined && item.feesDepositedTOA === undefined && (!item.remarks || item.remarks === '')) {
    //                         return false;
    //                     }
    //                 }
    //                 else if ('finalFee' in item && Object.keys(item).length === 1) {
    //                     if (item.finalFee === undefined) {
    //                         return false;
    //                     }
    //                 }
    //                 else if (Object.keys(item).length === 0) {
    //                     return false;
    //                 }
    //             }
    //             return true;
    //         });
    //     return cleanedArray.length > 0 ? cleanedArray : undefined;
    // }

    // if (typeof data === 'object') {
    //     const cleanedObject: { [key: string]: any } = {};
    //     let isEmpty = true;
    //     for (const key in data) {
    //         if (key === 'otpTarget' || key === 'confirmationCheck' || key === 'enquiry_id') {
    //             continue;
    //         }

    //         const cleanedValue = cleanDataForDraft(data[key]);

    //         if (cleanedValue !== undefined) {

    //             cleanedObject[key] = cleanedValue;
    //             isEmpty = false;
    //         }
    //     }
    //     return isEmpty ? undefined : cleanedObject;
    // }

    // if (data === '') {
    //     return undefined;
    // }



    return data;
};
