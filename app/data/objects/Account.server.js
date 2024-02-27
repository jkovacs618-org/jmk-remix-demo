import { prisma } from '~/data/database.server';
import { _createPersonOnly, createPersonRelationship } from './Person.server.js';
import bcrypt from 'bcryptjs';

export async function createAccountAndUser(args) {
    const newAccount = await prisma.account.create({
      data: {
        status: 'Active',
        accountType: 'Customer',
      },
    });
    if (newAccount) {
      const updatedAccount = await prisma.account.update({
        where: { id: newAccount.id },
        data: {
          externalId: 'Account' + newAccount.id,
        },
      });
      if (updatedAccount) {
        const user = await createUser(args, newAccount);
        if (user) {
          const person = await prisma.person.findFirst({
            where: { id: user.personId },
          });
          if (person) {
            return {
              user,
              personExternalId: person.externalId,
            };
          }
        }
      }
    }
    throw new Error('Failed to create new account');
}

async function createUser(args, newAccount) {
    const password = await bcrypt.hash(args.password, 12);
    const newUser = await prisma.user.create({
      data: { ...args, password, accountId: newAccount.id },
    });
    if (newUser) {
      const newUserUpdated = await prisma.user.update({
        where: { id: newUser.id },
        data: {
          externalId: 'User' + newUser.id,
          createdUserId: newUser.id,
        },
      });
      if (newUserUpdated) {
        // Create the initial Person record for this new User and set to 'Self'.
        const personInput = {
          nameFirst: newUser.nameFirst,
          nameLast: newUser.nameLast,
          accountId: newAccount.id,
        };

        const newPerson = await _createPersonOnly(newAccount.id, newUser.id, personInput);
        if (newPerson) {
          // After the Person is created, assign it to this new User.personId.
          const updatedUser = await prisma.user.update({
            where: { id: newUser.id },
            data: {
              personId: newPerson.id,
            },
          });
          if (updatedUser) {
            // Create the PersonRelationship record of 'Self' for this Person with local values, since user is not set.
            const newPersonRelationship = await createPersonRelationship(newPerson, newPerson, 'Self');
            if (newPersonRelationship) {
              // Create the Default Calendar for this new Account with local values, since user is not set.
              const newCalendar = await _createCalendar('Default', newAccount.id, updatedUser.id);
              if (newCalendar) {
                return updatedUser;
              }
            }
          }
        }
      }
    }
    throw new Error('Failed to create new user');
}

async function _createCalendar(newCalendarTitle, accountId, userId) {
    const newCalendar = await prisma.calendar.create({
      data: {
        accountId: accountId,
        title: newCalendarTitle,
        isDefault: true,
        createdUserId: userId,
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