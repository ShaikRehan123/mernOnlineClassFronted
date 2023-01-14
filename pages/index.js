import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminHomePage from "../components/Admin/AdminHomePage";
import axios from "axios";
import CourseCard from "../components/Common/CourseCard/index";
import { Heading, SimpleGrid, useColorMode } from "@chakra-ui/react";

export default function Home({ role_id, toptenCourses = [] }) {
  const { colorMode } = useColorMode();

  if (role_id == "1") {
    return (
      <>
        <Head>
          <title>Teacher</title>
        </Head>
        <AdminHomePage>
          <h1>Teacher Home Page</h1>
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
      </div>
    );
  }
}

export const getServerSideProps = async ({ req, res }) => {
  const cookie = getCookie("token", {
    req,
    res,
  });
  const role_id = getCookie("role_id", {
    req,
    res,
  });
  if (cookie != undefined && role_id == "1") {
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
      return {
        props: {
          role_id,
          toptenCourses: toptenCourses.data.topTenCourses,
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
