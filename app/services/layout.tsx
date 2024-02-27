import { Outlet } from "@remix-run/react";

export default function ServicesLayout() {
  return (
    <>
      <div className="relative flex flex-col">
        <Outlet />
      </div>
    </>
  );
}
