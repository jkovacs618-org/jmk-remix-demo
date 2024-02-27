import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useNavigate } from "@remix-run/react";

import EventForm from "~/components/events/EventForm";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { requireAuthUser } from "~/data/auth.server";
import { validateEventInput } from "~/data/events.server";
import { deleteEvent, getDefaultCalendar, getEvent, updateEvent } from "~/data/objects/Event.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Event" },
    { name: "description", content: "Edit Event" },
  ];
};

export default function EventEditPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('..');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Events' },
    { path: '', label: 'Edit Event' },
  ]

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">Edit Event</h2>

      <EventForm />
    </>
  );
}

export async function loader({params, request}: LoaderFunctionArgs) {
  // Must authenticate user for all nested loader() functions.
  const authUser = await requireAuthUser(request);

  const eventId = params.id;
  const event = await getEvent(eventId, authUser);
  const defaultCalendar = await getDefaultCalendar(authUser);
  return {eventData: event, defaultCalendar: defaultCalendar};
}

export async function action({params, request }: ActionFunctionArgs) {
  const eventId = params.id;
  const authUser = await requireAuthUser(request);

if (request.method === 'PATCH') {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      validateEventInput(data);
    } catch (error) {
      return error;
    }

    const args = {
      externalId: eventId,
      event: {
        title: data.title,
        location: data.location,
        startDate: data.startDate ? new Date(data.startDate + ' 12:00:00') : null,
        endDate: data.endDate ? new Date(data.endDate + ' 12:00:00') : null,
        calendarExternalId: (data.calendarExternalId ? data.calendarExternalId : null),
      },
    };
    // console.log('args: ', args);

    await updateEvent(args, authUser);
    return redirect('/events');
  }
  else if (request.method === 'DELETE') {
    const args = {
      externalId: eventId
    };
    await deleteEvent(args, authUser);
    return redirect('/events');
  }
}