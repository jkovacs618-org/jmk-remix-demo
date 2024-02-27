import { prisma } from '~/data/database.server';
import { getEvent } from './Event.server.js';
import { getServiceAccount } from './ServiceAccount.server.js';

export async function createEventNote(args, user) {
  const eventExternalId = args.eventExternalId;
  const noteInput = args.note;

  // Look up the Event record by externalId to get the event.id or null for Note.
  const event = eventExternalId ? await getEvent(eventExternalId, user) : null;
  if (event) {
    return await _createNote(noteInput, 'Event', event.id, user);
  } else {
    throw new Error(`Failed to find Event by ID: ${eventExternalId} to create Note`);
  }
}

export async function createServiceNote(args, user) {
  const serviceAccountExternalId = args.serviceAccountExternalId;
  const noteInput = args.note;

  // Look up the ServiceAccount record by externalId to get the event.id or null for Note.
  const serviceAccount = serviceAccountExternalId ? await getServiceAccount(serviceAccountExternalId, user) : null;
  if (serviceAccount) {
    return await _createNote(noteInput, 'ServiceAccount', serviceAccount.id, user);
  } else {
    throw new Error(`Failed to find ServiceAccount by ID: ${serviceAccountExternalId} to create Note`);
  }
}

async function _createNote(noteInput, refType, refId, user) {
  const newNote = await prisma.note.create({
    data: {
      ...noteInput,
      accountId: user.accountId,
      refType: refType,
      refId: refId,
      eventId: refType === 'Event' ? refId : null,
      serviceAccountId: refType === 'ServiceAccount' ? refId : null,
      createdUserId: user.id,
    },
  });

  if (newNote) {
    const note = await prisma.note.update({
      where: { id: newNote.id },
      data: {
        externalId: 'Note' + newNote.id,
      },
    });
    return note;
  }
  return null;
}

export async function updateNote(args, user) {
  const model = await getNote(args.externalId, user);
  if (model) {
    // Once a Note is set on an Event or ServiceAccount, it cannot be moved to another object/type.
    // Deconstruct any NoteInput fields that cannot be updated on Note:
    const { eventExternalId, serviceAccountExternalId, ...noteInput } = args.note;

    const updatedNote = await prisma.note.update({
      where: { id: model.id },
      data: noteInput,
    });

    return updatedNote;
  } else {
    throw new Error(`Failed to find Note by ID: ${args.externalId} to update`);
  }
}

export async function deleteNote(args, user) {
  const model = await getNote(args.externalId, user);
  if (model) {
    const deletedModel = await prisma.note.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Note by ID: ${args.externalId} to delete`);
  }
}

async function getNote(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.note.findFirst({
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  return model;
}
