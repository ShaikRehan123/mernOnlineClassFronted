import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminHomePage from "../components/Admin/AdminHomePage";
import axios from "axios";
import CourseCard from "../components/Common/CourseCard/index";

export default function Home({ role_id, toptenCourses = [] }) {
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
    console.log(toptenCourses);
    return (
      <div>
        <Head>
          <title>Online Class Room</title>
        </Head>
        <h1>User Page</h1>
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
      const toptenCourses = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/course/top-ten-courses`
      );
      return {
        props: {
          role_id,
          toptenCourses: toptenCourses.data,
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
