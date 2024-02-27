import { Table } from "flowbite-react";
import { Event } from '~/interfaces/interfaces';
import { Link, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import { AuthUser } from "~/interfaces/Auth";

export default function EventsList({ events, authUser }: {events: Event[], authUser: AuthUser}) {

  // Programmatic Delete: behind-the-scenes submission, and Redirect back to same page:
  const submit = useSubmit();

  const handleClickDelete = (e: React.MouseEvent, event: Event) => {
    e.preventDefault()
    if (
        confirm(
            `Are you sure you want to remove the event${event.title ? ': ' + event.title : ''}?`
        )
    ) {
        submit(null, {method: 'delete', action: `/events/edit/${event.externalId}`});
      }
  };

  return (
    <div className="mt-3 mb-10">
      <div className="overflow-x-auto">
          <Table striped className="text-left">
              <Table.Head>
                <Table.HeadCell className="py-3">Event Title</Table.HeadCell>
                <Table.HeadCell>Location</Table.HeadCell>
                <Table.HeadCell>Starts</Table.HeadCell>
                <Table.HeadCell>Ends</Table.HeadCell>
                <Table.HeadCell>Calendar</Table.HeadCell>
                <Table.HeadCell>
                    <span className="sr-only">Actions</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                  {events.map((event: Event) => (
                        <Table.Row
                            key={event.externalId}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-2">
                                <Link to={`/events/edit/${event.externalId}`}>
                                    {event.title}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                {event.location ? event.location : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {event.startDate
                                    ? dayjs(event.startDate).format('M/D/YY')
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {event.endDate
                                    ? dayjs(event.endDate).format('M/D/YY')
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {event.calendar ? event.calendar.title : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/events/edit/${event.externalId}`}>
                                    <FaPenToSquare
                                        className="text-gray-400 text-lg mr-6 inline"
                                        title="Edit Event"
                                    />
                                </Link>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        handleClickDelete(e, event)
                                    }}
                                >
                                    <FaTrashCan
                                        className="text-gray-400 text-lg inline"
                                        title="Remove Event"
                                    />
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                      ))
                  }
              </Table.Body>
          </Table>
      </div>
  </div>
  );
}
