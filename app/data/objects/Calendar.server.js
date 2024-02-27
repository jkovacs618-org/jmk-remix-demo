import { prisma } from '~/data/database.server';

export async function createCalendar(args, user) {
  const calendarInput = args.calendar;
  const newCalendar = await prisma.calendar.create({
    data: {
      ...calendarInput,
      accountId: user.accountId,
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

export async function updateCalendar(args, user) {
  const model = await getCalendar(args.externalId, user);
  if (model) {
    const calendarInput = args.calendar;
    const updatedCalendar = await prisma.calendar.update({
      where: { id: model.id },
      data: calendarInput,
    });

    return updatedCalendar;
  } else {
    throw new Error(`Failed to find Calendar by ID: ${args.externalId} to update`);
  }
}

export async function deleteCalendar(args, user) {
  const model = await getCalendar(args.externalId, user);
  if (model) {
    const deletedModel = await prisma.calendar.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Calendar by ID: ${args.externalId} to delete`);
  }
}

async function getCalendar(externalId, user) {
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
