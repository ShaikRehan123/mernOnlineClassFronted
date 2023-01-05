import Head from "next/head";
import { getCookie } from "cookies-next";
import AdminHomePage from "../components/Admin/AdminHomePage";

export default function Home({ role_id }) {
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
        <h1>User Page</h1>
      </div>
    );
  }
}

export const getServerSideProps = ({ req, res }) => {
  const cookie = getCookie("token", {
    req,
    res,
  });
  const role_id = getCookie("role_id", {
    req,
    res,
  });
  if (cookie != undefined) {
    return {
      props: {
        role_id,
      },
    };
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
};
