import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import EventsList from "~/components/events/EventsList";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { requireAuthUser } from "~/data/auth.server";
import { getEvents } from "~/data/objects/Event.server";
import { AuthUser } from "~/interfaces/Auth";
import { Event } from "~/interfaces/interfaces";

type PageData = {
  authUser: AuthUser;
  events: Event[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Events" },
    { name: "description", content: "Events" },
  ];
};

export default function EventsPage() {
  const { authUser, events }: PageData = useLoaderData();

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Events' },
  ]

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <div className="flex gap-4">
          <div>
              <h2 className="text-3xl text-slate-600 font-bold">Events</h2>
          </div>
          <div className="ml-auto">
              <Link to="/events/add" className="text-white">
                  <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                      New Event
                  </button>
              </Link>
          </div>
      </div>

      <div className="mt-2">
        {/*SEARCH: TO-DO*/}
      </div>

      <div>
          <div className="d-inline col-4 text-sm mt-2">
              Total items: &nbsp;
              <span className="badge badge-info">
                  {events ? events.length : 0}
              </span>
          </div>
      </div>

      <EventsList events={events} authUser={authUser} />
    </>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  // Require a Logged In user, otherwise redirect to /login:
  const user = await requireAuthUser(request);
  const events = await getEvents(user);

  const pageData: PageData = {
    authUser: user,
    events: events,
  };
  return pageData;
}