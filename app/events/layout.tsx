import { Outlet } from "@remix-run/react";

export default function EventsLayout() {
  return (
    <>
      <div className="relative flex flex-col">
        <Outlet />
      </div>
    </>
  );
}
