import { PageHeader } from "@/components/page-header";
import { CourseForm } from "@/features/courses/components/course-form";

export default function NewCoursePage(){
    return(
        <div className="container my-6">
            <PageHeader title="New Course"/>
            <CourseForm />
        </div>
    )
}