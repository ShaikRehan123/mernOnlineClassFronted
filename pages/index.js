import Head from "next/head";
import {getCookie} from "cookies-next";
import AdminHomePage from "../components/Admin/AdminHomePage";
import axios from "axios";
import CourseCard from "../components/Common/CourseCard/index";
import { Heading, SimpleGrid, useColorMode} from "@chakra-ui/react";
import { Card ,CardHeader , CardBody, } from "@chakra-ui/card";

export default function Home({role_id, toptenCourses = [], teacherDashboardData = {},allCourses = []}) {

    const {colorMode} = useColorMode();

    if (role_id == "1") {
        const {totalStudents, totalCourses, totalEarnings,totalWatchTime} = teacherDashboardData;
        return (
            <>
                <Head>
                    <title>Teacher</title>
                </Head>
                <AdminHomePage>
                    <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                        Dashboard
                    </Heading>
                    <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4} marginTop={10}>
                        <Card className={colorMode ==='light' ? `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-gray-600 shadow-lg bg-white rounded h-40 flex flex-col justify-center items-center text-gray-800 font-bold text-2xl` : `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-white shadow-lg bg-gray-800 rounded h-40 flex flex-col justify-center items-center text-white font-bold text-2xl`}>
                            <CardHeader>Total Students</CardHeader>
                            <CardBody>{totalStudents}</CardBody>
                        </Card>
                        <Card className={colorMode ==='light' ? `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-gray-600 shadow-lg bg-white rounded h-40 flex flex-col justify-center items-center text-gray-800 font-bold text-2xl` : `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-white shadow-lg bg-gray-800 rounded h-40 flex flex-col justify-center items-center text-white font-bold text-2xl`}>
                            <CardHeader>Total Courses</CardHeader>
                            <CardBody>{totalCourses}</CardBody>
                        </Card>
                        <Card className={colorMode ==='light' ? `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-gray-600 shadow-lg bg-white rounded h-40 flex flex-col justify-center items-center text-gray-800 font-bold text-2xl` : `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-white shadow-lg bg-gray-800 rounded h-40 flex flex-col justify-center items-center text-white font-bold text-2xl`}>
                            <CardHeader>Total Earning</CardHeader>
                            <CardBody>₹ {totalEarnings}</CardBody>
                        </Card>
                        <Card className={colorMode ==='light' ? `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-gray-600 shadow-lg bg-white rounded h-40 flex flex-col justify-center items-center text-gray-800 font-bold text-2xl` : `card hover:shadow-xl hover:shadow-amber-50 transition-all cursor-pointer border-2 border-white shadow-lg bg-gray-800 rounded h-40 flex flex-col justify-center items-center text-white font-bold text-2xl`}>
                            <CardHeader>Total Watch Time</CardHeader>
                            <CardBody>{Math.round(totalWatchTime/60)} Minutes</CardBody>
                        </Card>
                    </SimpleGrid>

                </AdminHomePage>
            </>
        );
    } else {
        return (
            <div>
                <Head>
                    <title>Online Class Room</title>
                </Head>
                <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                    Most Purchased Courses
                </Heading>
                <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4}>
                    {toptenCourses?.map((course) => {
                        console.log(course);
                        return (
                            <div key={course._id}>
                                <CourseCard
                                    course_id={course._id}
                                    {...course}
                                    colorMode={colorMode}
                                    isAdmin={false}
                                    showAddLessonButton={false}
                                    showDeleteButton={false}
                                    showAddToCartButton={course.isEnrolled == false && course.isAddedToCart == false}
                                />
                            </div>
                        );
                    })}
                </SimpleGrid>

                <Heading as="h2" size="lg" textAlign="center" marginTop={4}>
                    All Courses
                </Heading>

                <SimpleGrid columns={[1, 1, 1, 2]} spacingX="4" spacingY={4}>
                    {allCourses?.map((course) => {
                        console.log(course);
                        return (
                            <div key={course._id}>
                                <CourseCard
                                    course_id={course._id}
                                    {...course}
                                    colorMode={colorMode}
                                    isAdmin={false}
                                    showAddLessonButton={false}
                                    showDeleteButton={false}
                                    showAddToCartButton={course.isEnrolled == false && course.isAddedToCart == false}
                                />
                            </div>
                        );

                    }
                    )}
                </SimpleGrid>

            </div>
        );
    }
}

export const getServerSideProps = async ({req, res}) => {
    const cookie = getCookie("token", {
        req,
        res,
    });
    const role_id = getCookie("role_id", {
        req,
        res,
    });
    if (cookie != undefined && role_id == "1") {
        try {
            const user_id = getCookie("user_id", {
                req,
                res,
            });
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/get-teacher-dashboard-data`, {}, {
                headers: {
                    Authorization: `Bearer ${cookie}`,
                }
            })
            console.log(response.data.data);
            return {
                props: {
                    role_id: role_id,
                    teacherDashboardData: response.data.data
                }
            }
        } catch (error) {
            console.log(error);
        }
        return {
            props: {
                role_id,
            },
        };
    }
    if (cookie != undefined && role_id == "2") {
        try {
            const user_id = getCookie("user_id", {
                req,
                res,
            });
            const requestUserId = user_id ? user_id : "notLoggedIn";
            const toptenCourses = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/top-ten-courses?user_id=${requestUserId}`
            );

            const allCourses = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/all-courses?user_id=${requestUserId}`
            );



            return {
                props: {
                    role_id,
                    toptenCourses: toptenCourses.data.topTenCourses,
                    allCourses: allCourses.data.allCourses,
                },
            };
        } catch (err) {
            return {
                props: {
                    role_id,
                    toptenCourses: [],
                },
            };
        }
    }

    return {
        redirect: {
            destination: "/login",
            permanent: false,
        },
    };
};
