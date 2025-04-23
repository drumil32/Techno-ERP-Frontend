import { API_ENDPOINTS } from "@/common/constants/apiEndpoints";
import { API_METHODS } from "@/common/constants/apiMethods";
import { apiRequest } from "@/lib/apiClient";

export const uploadPlanDocument = async (params: {
    planId: string;
    type: "LPlan" | "PPlan";
    courseId: string;
    semesterId: string;
    subjectId: string;
    instructorId: string;
    document: File;
}) => {
    console.log("Uploading document with params: ", params);

    const formData = new FormData();
    formData.append("planId", params.planId);
    formData.append("type", params.type);
    formData.append("courseId", params.courseId);
    formData.append("semesterId", params.semesterId);
    formData.append("subjectId", params.subjectId);
    formData.append("instructorId", params.instructorId);
    formData.append("document", params.document);

    const res = await apiRequest(API_METHODS.POST, API_ENDPOINTS.uploadPlan, formData, undefined, {
        "Content-Type": "multipart/form-data",
    });

    console.log("Upload response: ", res);
    return res;
};
