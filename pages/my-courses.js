import {getCookie} from "cookies-next";
import axios from "axios";
import {Heading, SimpleGrid, useColorMode} from "@chakra-ui/react";
import CourseCard from "../components/Common/CourseCard";


const MyCourses = ({role_id, enrolledCourses}) => {
    console.log(enrolledCourses);
    const {colorMode} = useColorMode();

    return (
        <>
            <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                Your Courses
            </Heading>

            <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4}>
                {enrolledCourses?.map((course) => {
                    console.log(course);
                    return (
                        <div key={course.course._id} style={{position: "relative"}}>
                            <CourseCard
                                course_id={course.course._id}
                                {...course.course}
                                colorMode={colorMode}
                                isAdmin={false}
                                showAddLessonButton={false}
                                showDeleteButton={false}
                                showPrice={false}
                                viewCourse={true}
                                showProgress={true}
                                progress={course.completionPercentage}
                            />
                        </div>
                    );
                })}
            </SimpleGrid>
        </>

    );
}


    export default MyCourses;

    export const getServerSideProps = async ({req, res}) => {
        const cookie = getCookie("token", {
            req,
            res,
        });
        const role_id = getCookie("role_id", {
            req,
            res,
        });
        if (cookie !== undefined && role_id == "1") {
            //    redirect to admin dashboard
            return {
                redirect: {
                    destination: "/",
                    permanent: false,
                }
            }
        }

        if (cookie !== undefined && role_id == "2") {
            const enrolledCourses = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/enrolled-courses`, {}, {
                    headers: {
                        Authorization: `Bearer ${cookie}`,
                    },
                }
            );

            return {
                props: {
                    role_id,
                    enrolledCourses: enrolledCourses.data.enrolledCourses
                }
            }
        }


        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    };
