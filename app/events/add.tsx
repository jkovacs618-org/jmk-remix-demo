import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import EventForm from "~/components/events/EventForm";
import Breadcrumbs from '~/components/navigation/Breadcrumbs';
import { requireAuthUser } from '~/data/auth.server';
import { createEvent, getDefaultCalendar } from '~/data/objects/Event.server';
import { validateEventInput } from '~/data/events.server';

export const meta: MetaFunction = () => {
  return [
    { title: "Add Event" },
    { name: "description", content: "Add Event" },
  ];
};

export default function EventAddPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('/events');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/events', label: 'Events' },
    { path: '', label: 'New Event' },
  ];

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">New Event</h2>

      <EventForm />
    </>
  );
}

export async function loader({params, request}: LoaderFunctionArgs) {
  // Must authenticate user for all nested loader() functions.
  const authUser = await requireAuthUser(request);

  const event = null;
  const defaultCalendar = await getDefaultCalendar(authUser);
  return {event: event, defaultCalendar: defaultCalendar};
}

export async function action({ request }: ActionFunctionArgs) {
  const authUser = await requireAuthUser(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    validateEventInput(data);
  }
  catch (error) {
    return error;
  }

  const args = {
    event: {
      title: data.title,
      location: data.location,
      startDate: data.startDate ? new Date(data.startDate + ' 12:00:00') : null,
      endDate: data.endDate ? new Date(data.endDate + ' 12:00:00') : null,
      calendarExternalId: (data.calendarExternalId ? data.calendarExternalId : ''),
      newCalendarTitle: (data.newCalendarTitle ? data.newCalendarTitle : ''),
    },
  };
  // console.log('args: ', args);

  const newEvent = await createEvent(args, authUser);
  if (!newEvent) {
    return 'Failed to add new event.';
  }

  return redirect('/events');
}