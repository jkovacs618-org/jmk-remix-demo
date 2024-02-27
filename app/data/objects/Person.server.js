import { prisma } from '~/data/database.server';

export async function createPerson(args, user) {
  // Construct input model with every property except 'relationship' input:
  const { relationship, ...personInput } = args.person;
  const accountId = user.accountId;
  const userId = user.id;

  const newPerson = await _createPersonOnly(accountId, userId, personInput);
  if (newPerson) {
    // After new Person is created, attempt to create PersonRelationship record between Self Person and New Person.
    if (user.personId && relationship !== '') {
      const selfPerson = await getSelfPerson(user);
      const newPersonRelationship = await createPersonRelationship(selfPerson, newPerson, relationship);
      if (newPersonRelationship) {
        return newPerson;
      }
    } else {
      return newPerson;
    }
  }
  throw new Error('Failed to create new person');
}

export async function _createPersonOnly(accountId, userId, personInput) {
  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const birthDate = personInput.birthDate ? new Date(personInput.birthDate) : null;
  const deathDate = personInput.deathDate ? new Date(personInput.deathDate) : null;

  const newPerson = await prisma.person.create({
    data: {
      ...personInput,
      accountId: accountId,
      birthDate: birthDate,
      deathDate: deathDate,
      createdUserId: userId,
    },
  });
  if (newPerson) {
    const updatedPerson = await prisma.person.update({
      where: { id: newPerson.id },
      data: {
        externalId: 'Person' + newPerson.id,
      },
    });
    if (updatedPerson) {
      return updatedPerson;
    }
  }
  return null;
}

export async function updatePerson(args, user) {
  const model = await getPerson(args.externalId, user);
  if (model) {
    // Construct input model with every property except 'relationship' input:
    const { relationship, ...personInput } = args.person;

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const birthDate = personInput.birthDate ? new Date(personInput.birthDate) : null;
    const deathDate = personInput.deathDate ? new Date(personInput.deathDate) : null;

    const updatedPerson = await prisma.person.update({
      where: { id: model.id },
      data: {
        ...personInput,
        birthDate: birthDate,
        deathDate: deathDate,
      },
    });

    // After Person is updated, conditionally sync the PersonRelationship record between Self Person and New Person.
    // If PersonRelationship exists, but type is different than input relationship, logically-delete PR and recreate PR.
    if (user.personId) {
      const selfPerson = await getSelfPerson(user);
      if (selfPerson.id !== updatedPerson.id) {
        const personRelationship = await getPersonRelationship(selfPerson, updatedPerson);
        if (!personRelationship) {
          await createPersonRelationship(selfPerson, updatedPerson, relationship);
        } else {
          if (personRelationship.type !== relationship) {
            /*
            const deletedRecord = await prisma.personRelationship.update({
              where: { id: personRelationship.id },
              data: {
                deleted: true,
                deletedAt: new Date(),
              },
            });
            */
            // TO-DO: Physically delete the record for now, until PersonsList join of PR considers logically-deleted.
            const deletedRecord = await prisma.personRelationship.delete({
              where: { id: personRelationship.id },
            });
            if (deletedRecord) {
              await createPersonRelationship(selfPerson, updatedPerson, relationship);
            }
          }
        }
      }
    }

    return updatedPerson;
  } else {
    throw new Error(`Failed to find Person by ID: ${args.externalId} to update`);
  }
}

export async function deletePerson(args, user) {
  const selfPerson = await prisma.person.findFirst({
    where: { id: user.personId },
  });
  if (selfPerson.externalId === args.externalId) {
    throw new Error('Cannot delete Person for current user');
  }

  const model = await getPerson(args.externalId, user);
  if (model) {
    const deletedModel = await prisma.person.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find Person by ID: ${args.externalId} to delete`);
  }
}

export async function getPersons(user) {
  if (!user) {
    throw new Error('Failed to get persons.');
  }
  try {
    const persons = await prisma.person.findMany({
      select: {
        id: true,
        externalId: true,
        nameFirst: true,
        nameMiddle: true,
        nameLast: true,
        gender: true,
        birthDate: true,
        deathDate: true,
        personRelatioships2: {
          select: {
            person1Id: true,
            person2Id: true,
            type: true,
            deleted: true,
          },
        },
      },
      where: {
        accountId: user.accountId,
        deleted: false,
      },
    });
    return persons;
  }
  catch (error) {
    console.log(error);
    throw new Error('Failed to get persons.');
  }
}

export async function getPerson(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const person = await prisma.person.findFirst({
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  const selfPerson = await getSelfPerson(user);
  const personRelationship = await getPersonRelationship(selfPerson, person);
  person.relationship = (personRelationship ? personRelationship.type : '');
  return person;
}

export async function getSelfPerson(user) {
  const selfPerson = await prisma.person.findUnique({
    where: {
      id: user.personId,
      accountId: user.accountId,
    },
  });
  return selfPerson;
}

export async function createPersonRelationship(person1, person2, relationship) {
  const newPersonRelationship = await prisma.personRelationship.create({
    data: {
      person1Id: person1.id,
      person2Id: person2.id,
      type: relationship,
    },
  });
  return newPersonRelationship;
}

export async function getPersonRelationship(person1, person2) {
  const personRelationship = await prisma.personRelationship.findFirst({
    where: {
      person1Id: person1.id,
      person2Id: person2.id,
      deleted: false,
    },
  });
  return personRelationship;
}
