import { Outlet } from "@remix-run/react";

export default function FamilyLayout() {
  return (
    <>
      <div className="relative flex flex-col">
        <Outlet />
      </div>
    </>
  );
}
