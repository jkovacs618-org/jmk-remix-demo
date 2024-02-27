import { useActionData, Form, useNavigation, useParams, useLoaderData } from '@remix-run/react';
import { Label } from "flowbite-react";
import SubmitButton from '~/components/shared/SubmitButton';
import CancelButton from '~/components/shared/CancelButton';
import dayjs from 'dayjs';

export default function EventForm() {
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const params = useParams();

  const {eventData, defaultCalendar} = useLoaderData();
  // console.log('eventData: ', eventData);
  // console.log('defaultCalendar: ', defaultCalendar);

  // If ID is invalid, add form is shown; Instead, handle if ID is set.
  if (params.id && !eventData) {
    return <p>Invalid Event ID</p>;
  }

  const errors = {};

  const defaultValues = eventData ? {
    title: eventData.title,
    location: eventData.location,
    startDate: eventData.startDate
        ? dayjs(eventData.startDate).format('YYYY-MM-DD')
    : '',
    endDate: eventData.endDate
        ? dayjs(eventData.endDate).format('YYYY-MM-DD')
    : '',
    calendarExternalId: eventData.calendarExternalId,
    newCalendarTitle: '',
  } : {
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    calendarExternalId: (defaultCalendar ? defaultCalendar.externalId : ''),
    newCalendarTitle: '',
  };
  // console.log('defaultValues: ', defaultValues);

  return (
    <Form method={eventData ? 'patch' : 'post'} className="form" id="event-form">

      <div className="form-group">
          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="title" value="Title *" />
              </div>
              <div>
                  <input
                      id="title"
                      name="title"
                      type="text"
                      defaultValue={defaultValues.title}
                      className="form-control"
                      aria-invalid={errors.title ? 'true' : 'false'}
                      autoComplete='off'
                      data-lpignore="true"
                      required
                  />
                  {errors.title?.type === 'required' && (
                      <span role="alert" className="text-red-500 text-sm font-bold">
                          Title is required
                      </span>
                  )}
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="location" value="Location" />
              </div>
              <div>
                  <input
                      id="location"
                      name="location"
                      type="text"
                      defaultValue={defaultValues.location}
                      className="form-control"
                      aria-invalid={errors.location ? 'true' : 'false'}
                      autoComplete='off'
                  />
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="startDate" value="Start Date" />
              </div>
              <div>
                  <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={defaultValues.startDate}
                      className="form-control"
                      autoComplete='off'
                  />
              </div>
          </div>

            <div className="mb-2">
                <div className="mb-1 block">
                    <Label htmlFor="endDate" value="End Date" />
                </div>
                <div>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        defaultValue={defaultValues.endDate}
                        className="form-control"
                    />
                </div>
            </div>

            <input type="hidden" id="calendarExternalId" name="calendarExternalId" defaultValue={defaultValues.calendarExternalId} />
      </div>

      <div className="form-group mt-4">
          <SubmitButton label={isSubmitting ? 'Saving...' : (params.id ? 'Update' : 'Add Event')} disabled={isSubmitting} />
          <CancelButton path="/events" />
      </div>

      {validationErrors && (
        <ul>
        {Object.values(validationErrors).map((error) => (
          <li key={error}>{error}</li>
        ))}
        </ul>
      )}
    </Form>
  );
}
