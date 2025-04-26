import { TechnoFilterProvider } from "@/components/custom-ui/filter/filter-context";
import CourseLayout from "@/components/layout/course-layout";
import AllCoursesPage from "@/components/layout/courses/all-courses-page";

export default function CoursePage(){
    return (
        <CourseLayout>
            <TechnoFilterProvider key="courses">
                <AllCoursesPage/>
            </TechnoFilterProvider>
        </CourseLayout>
    )
}