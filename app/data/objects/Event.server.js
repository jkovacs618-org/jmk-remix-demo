import { prisma } from '~/data/database.server';

export async function getEvent(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.event.findFirst({
    select: {
      id: true,
      externalId: true,
      title: true,
      location: true,
      startDate: true,
      endDate: true,
      calendar: {
        select: {
          externalId: true,
          title: true,
          deleted: true,
        },
      },
    },
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  model.calendarExternalId = model.calendar.externalId;
  return model;
}

export async function getEvents(user) {
  if (!user) {
    throw new Error('Failed to get events.');
  }
  try {
    const events = await prisma.event.findMany({
      select: {
        id: true,
        externalId: true,
        title: true,
        location: true,
        startDate: true,
        endDate: true,
        calendar: {
          select: {
            title: true,
            deleted: true,
          },
        },
      },
      where: {
        accountId: user.accountId,
        deleted: false,
      },
    });
    return events;
  }
  catch (error) {
    console.log(error);
    throw new Error('Failed to get events.');
  }
}

export async function getCalendar(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.calendar.findFirst({
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  return model;
}

export async function getDefaultCalendar(user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.calendar.findFirst({
    where: {
      accountId: user.accountId,
      deleted: false,
    },
  });
  return model;
}

export async function createEvent(args, user) {
  // Construct input model with every property except 'calendarExternalId' input:
  const { calendarExternalId, newCalendarTitle, ...eventInput } = args.event;

  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const startDate = eventInput.startDate ? new Date(eventInput.startDate) : null;
  const endDate = eventInput.endDate ? new Date(eventInput.endDate) : null;

  // Look up the Calendar record by externalId to get the calendar.id or null for Event.
  // Create a new Calendar for this Account if the calendarExternalId value is 'NEW' and newCalendarTitle is set.
  let calendarId = null;
  if (calendarExternalId === 'NEW') {
    if (newCalendarTitle !== '') {
      const calendar = await createCalendar(newCalendarTitle, user);
      calendarId = calendar ? calendar.id : null;
    }
  } else {
    const calendar = await getCalendar(calendarExternalId, user);
    calendarId = calendar ? calendar.id : null;
  }

  const newEvent = await prisma.event.create({
    data: {
      ...eventInput,
      accountId: user.accountId,
      calendarId: calendarId,
      startDate: startDate,
      endDate: endDate,
      createdUserId: user.id,
    },
  });

  if (newEvent) {
    const event = await prisma.event.update({
      where: { id: newEvent.id },
      data: {
        externalId: 'Event' + newEvent.id,
      },
    });
    return event;
  }
  return null;
}

export async function updateEvent(args, user) {
  const model = await getEvent(args.externalId, user);
  if (model) {
    // Construct input model with every property except 'calendarExternalId' input:
    const { calendarExternalId, newCalendarTitle, ...eventInput } = args.event;
    // console.log('updateEvent: calendarExternalId: ', calendarExternalId);

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const startDate = eventInput.startDate ? new Date(eventInput.startDate) : null;
    const endDate = eventInput.endDate ? new Date(eventInput.endDate) : null;

    // Look up the Calendar record by externalId to get the calendar.id or null for Event.
    // Create a new Calendar for this Account if the calendarExternalId value is 'NEW' and newCalendarTitle is set.
    let calendarId = null;
    if (calendarExternalId === 'NEW') {
      if (newCalendarTitle !== '') {
        const calendar = await createCalendar(newCalendarTitle, user);
        calendarId = calendar ? calendar.id : null;
      }
    } else {
      const calendar = await getCalendar(calendarExternalId, user);
      calendarId = calendar ? calendar.id : null;
    }

    const updatedEvent = await prisma.event.update({
      where: { id: model.id },
      data: {
        ...eventInput,
        calendarId: calendarId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return updatedEvent;
  } else {
    throw new Error(`Failed to find Event by ID: ${args.externalId} to update`);
  }
}

export async function deleteEvent(args, user) {
  const model = await getEvent(args.externalId, user);
  if (model) {
    const deletedModel = await prisma.event.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Event by ID: ${args.externalId} to delete`);
  }
}

async function createCalendar(newCalendarTitle, user) {
  const newCalendar = await prisma.calendar.create({
    data: {
      accountId: user.accountId,
      title: newCalendarTitle,
      createdUserId: user.id,
    },
  });
  if (newCalendar) {
    const calendar = await prisma.calendar.update({
      where: { id: newCalendar.id },
      data: {
        externalId: 'Calendar' + newCalendar.id,
      },
    });
    return calendar;
  }
  return null;
}
