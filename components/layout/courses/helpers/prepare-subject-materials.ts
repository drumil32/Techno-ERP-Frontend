import { Course, CourseMaterialType } from "@/types/enum";
import { Plan } from "../single-subject-page";
import { sub } from "date-fns";

export interface SubjectMaterial {
    courseId: string,
    semesterId: string,
    subjectId: string,
    planId?: string,
    instructorId : string,
    type: CourseMaterialType,
    link: string,
    name: string,
    metaData: {
        topic: string
    }
}

export const parseDocumentUrl = (documentUrl: string) => {
    const parts = documentUrl.split("/");
    return parts[parts.length - 1];
}

export const processPlan = (plans: Plan[], prefix: string, type: CourseMaterialType, courseId: string, semesterId: string, subjectId: string, instructorId : string) => {
    const courseMaterials: SubjectMaterial[] = [];
    if (plans.length > 0) {
        for (let plan of plans) {
            for (let document of plan.documents) {
                courseMaterials.push({
                    courseId: courseId,
                    semesterId: semesterId,
                    subjectId: subjectId,
                    planId: plan._id,
                    instructorId : instructorId,
                    type: type,
                    link: document,
                    name: parseDocumentUrl(document),
                    metaData: {
                        topic: `${prefix} - ${plan.lectureNumber}. ${plan.topicName}`
                    }
                })
            }
        }
    }
    return courseMaterials;
}

export const processAdditionalResources = (documents : string[], prefix : string, type : CourseMaterialType, courseId : string, semesterId : string, subjectId : string, instructorId : string) => {
    const courseMaterials : SubjectMaterial[] = [];
    for (let document of documents) {
        courseMaterials.push({
            courseId: courseId,
            semesterId: semesterId,
            subjectId: subjectId,
            planId: undefined,
            instructorId : instructorId,
            type: type,
            link: document,
            name: parseDocumentUrl(document),
            metaData: {
                topic: `${prefix} - General`
            }
        })
    }
    return courseMaterials;
}


export const prepareSubjectMaterial = (lecturePlan: Plan[], practicalPlan: Plan[], additionalResources: string[], courseId: string, semesterId: string, subjectId: string, instructorId : string) => {
    const processedLectureMaterials = processPlan(lecturePlan, "L", CourseMaterialType.LPLAN, courseId, semesterId, subjectId, instructorId);
    const processedPracticalMaterials = processPlan(practicalPlan,"P", CourseMaterialType.PPLAN, courseId, semesterId, subjectId, instructorId);
    const processedAdditionalResources = processAdditionalResources(additionalResources, "G", CourseMaterialType.General, courseId, semesterId, subjectId, instructorId);

    const courseMaterials : SubjectMaterial[] = [...processedLectureMaterials, ...processedPracticalMaterials, ...processedAdditionalResources];
    return courseMaterials;
}
