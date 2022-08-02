import NextNProgress from "nextjs-progressbar";
import { Toaster } from "react-hot-toast";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const Navbar = dynamic(() => {
  return import("../Navbar");
});
const AdminNavbar = dynamic(() => {
  return import("../AdminNavbar");
});
const AdminToggleTheme = dynamic(() => {
  return import("../AdminToggleTheme");
});
export default function Layout({ children }) {
  const token = getCookie("token");
  const role_id = getCookie("role_id");
  const router = useRouter();
  if (router.pathname != "/_error") {
    return (
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <NextNProgress />
        {token != undefined && role_id == "1" ? (
          <>
            <AdminNavbar />
            <AdminToggleTheme />
          </>
        ) : null}
        {token != undefined && role_id == "2" ? <Navbar /> : null}

        <main>{children}</main>
      </>
    );
  } else {
    return <>{children}</>;
  }
}
