import Head from "next/head";
import { getCookie } from "cookies-next";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Online Class Room</title>
      </Head>
      <h1>User Page</h1>
    </div>
  );
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
      props: {},
    };
  }
  if (role_id == "1") {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
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
