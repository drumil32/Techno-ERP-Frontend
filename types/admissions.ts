export interface Address {
    _id: string;
    country: string;
    district: string;
    landMark: string;
    pincode: string;
    state: string;
}

export interface AdmissionType {
    address: Address;
    applicationStatus: string;
    course: string;
    dateOfEnquiry: string;
    studentPhoneNumber: string;
    studentName: string;
    fatherPhoneNumber:string;
    motherPhoneNumber:string;
    gender: string;
}

export interface AdmissionTableRowType extends AdmissionType {
    id: number;
    genderDisplay: string;
    district: string;
}
