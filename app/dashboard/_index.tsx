import type { MetaFunction } from "@remix-run/node";
import DashboardTile from "~/components/dashboard/DashboardTile";
import { FaBuildingUser, FaCalendarDays, FaPeopleRoof } from 'react-icons/fa6';

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard" },
    { name: "description", content: "Dashboard" },
  ];
};

export default function DashboardPage() {
  return (
    <div className="relative flex flex-col">
      <h2 className="text-3xl text-slate-600 font-bold">Dashboard</h2>

      <div className="flex items-center mt-6">
          <div className="flex gap-4">
              <DashboardTile path="/family" label="Family">
                <FaPeopleRoof className="text-3xl mb-2 text-center" />
              </DashboardTile>
              <DashboardTile path="/events" label="Events">
                <FaCalendarDays className="text-3xl mb-2 text-center" />
              </DashboardTile>
              <DashboardTile path="/services" label="Accounts" >
                <FaBuildingUser className="text-3xl mb-2 text-center" />
              </DashboardTile>
          </div>
      </div>
  </div>
  );
}
