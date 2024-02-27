import { prisma } from '~/data/database.server';
import { getEvent } from './Event.server.js';
import { getServiceAccount } from './ServiceAccount.server.js';

export async function createEventTag(args, user) {
  const { eventExternalId, ...tagInput } = args.eventTag;

  // Look up the Event record by externalId to get the event.id or null for Tag.
  const event = eventExternalId ? await getEvent(eventExternalId, user) : null;
  if (event) {
    const tag = await _getOrCreateTag(tagInput, user);
    if (tag) {
      // After the new Tag is found or created, then create the EventTag record, if not exists for Event+Tag.
      const eventTag = await prisma.eventTag.findFirst({
        where: { eventId: event.id, tagId: tag.id, deleted: false },
      });
      if (!eventTag) {
        await prisma.eventTag.create({
          data: {
            eventId: event.id,
            tagId: tag.id,
            createdUserId: user.id,
          },
        });
      }

      // Return Tag instead of EventTag (mapping), since createEventTag signature is for return Tag.
      return tag;
    } else {
      throw new Error('Failed to find or create Tag for Event');
    }
  } else {
    throw new Error(`Failed to find Event by ID: ${eventExternalId} to create Tag`);
  }
}

export async function createServiceTag(args, user) {
  const { serviceAccountExternalId, ...tagInput } = args.serviceTag;

  // Look up the ServiceAccount record by externalId to get the event.id or null for Tag.
  const serviceAccount = serviceAccountExternalId ? await getServiceAccount(serviceAccountExternalId, user) : null;
  if (serviceAccount) {
    const tag = await _getOrCreateTag(tagInput, user);
    if (tag) {
      // After the new Tag is found or created, then create the ServiceTag record, if not exists for Service+Tag.
      const serviceTag = await prisma.serviceTag.findFirst({
        where: { serviceAccountId: serviceAccount.id, tagId: tag.id, deleted: false },
      });
      if (!serviceTag) {
        await prisma.serviceTag.create({
          data: {
            serviceAccountId: serviceAccount.id,
            tagId: tag.id,
            createdUserId: user.id,
          },
        });
      }

      // Return Tag instead of ServiceTag (mapping), since createServiceTag signature is for return Tag.
      return tag;
    } else {
      throw new Error('Failed to find or create Tag for Service');
    }
  } else {
    throw new Error(`Failed to find ServiceAccount by ID: ${serviceAccountExternalId} to create Tag`);
  }
}

async function _getOrCreateTag(tagInput, user) {
  // First, check if a Tag exists for this account by 'title' to re-use it.
  const tag = await getTagByTitle(tagInput.title, user);
  if (tag) {
    return tag;
  } else {
    const newTag = await prisma.tag.create({
      data: {
        ...tagInput,
        accountId: user.accountId,
        createdUserId: user.id,
      },
    });
    if (newTag) {
      const tag = await prisma.tag.update({
        where: { id: newTag.id },
        data: {
          externalId: 'Tag' + newTag.id,
        },
      });
      return tag;
    }
  }
  return null;
}

export async function deleteEventTag(args, user) {
  const tag = await getTag(args.tagExternalId, user);
  if (tag) {
    const event = await getEvent(args.externalEventId, user);
    if (event) {
      const { count } = await prisma.eventTag.updateMany({
        where: { eventId: event.id, tagId: tag.id, deleted: false },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      return count > 0;
    } else {
      throw new Error(`Failed to find Event by ID: ${args.externalEventId} to delete tag`);
    }
  } else {
    throw new Error(`Failed to find Tag by ID: ${args.tagExternalId} to delete tag`);
  }
}

export async function deleteServiceTag(args, user) {
  const tag = await getTag(args.tagExternalId, user);
  if (tag) {
    const serviceAccount = await getServiceAccount(args.externalServiceAccountId, user);
    if (serviceAccount) {
      const { count } = await prisma.serviceTag.updateMany({
        where: { serviceAccountId: serviceAccount.id, tagId: tag.id, deleted: false },
        data: {
          deleted: true,
          deletedAt: new Date(),
        },
      });
      return count > 0;
    } else {
      throw new Error(`Failed to find Service by ID: ${args.externalServiceAccountId} to delete tag`);
    }
  } else {
    throw new Error(`Failed to find Tag by ID: ${args.tagExternalId} to delete tag`);
  }
}

async function getTag(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.tag.findFirst({
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  return model;
}

async function getTagByTitle(title, user) {
  const model = await prisma.tag.findFirst({
    where: {
      title: title,
      accountId: user.accountId,
      deleted: false,
    },
  });
  return model;
}
