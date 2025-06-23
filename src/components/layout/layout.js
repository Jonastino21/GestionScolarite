// Layout.js
import { Outlet } from "react-router-dom";
import Navbar from "../common/navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
