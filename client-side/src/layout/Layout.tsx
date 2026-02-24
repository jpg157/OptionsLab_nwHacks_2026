import { Navbar } from "@/components/shared/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      <Navbar/>
      <main>
        {/* Child routes (index, options, tutorial) rendered here */}
        <Outlet />
      </main>
    </>
  );
}

export default Layout