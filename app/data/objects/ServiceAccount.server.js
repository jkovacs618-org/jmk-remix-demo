import { prisma } from '~/data/database.server';

export async function getServiceAccounts(user) {
  if (!user) {
    throw new Error('Failed to get accounts.');
  }
  try {
    const serviceAccounts = await prisma.serviceAccount.findMany({
      select: {
        id: true,
        externalId: true,
        organizationId: true,
        serviceTypeId: true,
        description: true,
        accountNumber: true,
        startDate: true,
        endDate: true,
        organization: {
          select: {
            externalId: true,
            name: true,
          },
        },
        serviceType: {
          select: {
            externalId: true,
            name: true,
          },
        },
      },
      where: {
        accountId: user.accountId,
        deleted: false,
      },
    });
    return serviceAccounts;
  }
  catch (error) {
    console.log(error);
    throw new Error('Failed to get accounts.');
  }
}

export async function getServiceAccount(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.serviceAccount.findFirst({
    select: {
      id: true,
      externalId: true,
      organizationId: true,
      serviceTypeId: true,
      description: true,
      accountNumber: true,
      startDate: true,
      endDate: true,
      organization: {
        select: {
          externalId: true,
          name: true,
        },
      },
      serviceType: {
        select: {
          externalId: true,
          name: true,
        },
      },
    },
    where: {
      externalId: externalId,
      accountId: user.accountId,
      deleted: false,
    },
  });
  model.organizationExternalId = (model.organization ? model.organization.externalId : '');
  model.serviceTypeExternalId = (model.serviceType ? model.serviceType.externalId : '');
  return model;
}

export async function getOrganizations(user) {
  const models = await prisma.organization.findMany({
    where: {
      AND: [
        { deleted: false },
        {
          OR: [{ accountId: 1 }, { accountId: user.accountId }],
        },
      ],
    },
    orderBy: {
      name: 'asc'
    }
  });
  return models;
}

export async function getOrganization(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  const model = await prisma.organization.findFirst({
    where: {
      AND: [
        { externalId: externalId },
        { deleted: false },
        {
          OR: [{ accountId: 1 }, { accountId: user.accountId }],
        },
      ],
    },
  });
  return model;
}

export async function getServiceTypes(user) {
  const model = await prisma.serviceType.findMany({
    where: {
      AND: [
        { deleted: false },
        {
          OR: [{ accountId: 1 }, { accountId: user.accountId }],
        },
      ],
    },
    orderBy: {
      name: 'asc'
    }
  });
  return model;
}

export async function getServiceType(externalId, user) {
  // The externalId cannot be made unique since starts empty, so use findFirst, not findUnique.
  if (externalId && externalId !== '') {
    const model = await prisma.serviceType.findFirst({
      where: {
        AND: [
          { externalId: externalId },
          { deleted: false },
          {
            OR: [{ accountId: 1 }, { accountId: user.accountId }],
          },
        ],
      },
    });
    return model;
  }
  return null;
}

export async function createServiceAccount(args, user) {
  // Construct input model with every property except specific input fields not on ServiceAccount:
  const { organizationExternalId, serviceTypeExternalId, ...serviceAccountInput } = args.serviceAccount;
  const newOrganizationName = (args.newOrganizationName ? args.newOrganizationName : '');

  // Convert date/time inputs from String to Date objects for schema DateTime columns.
  const startDate = serviceAccountInput.startDate ? new Date(serviceAccountInput.startDate) : null;
  const endDate = serviceAccountInput.endDate ? new Date(serviceAccountInput.endDate) : null;

  // Look up the Organization record by externalId to get the organization.id or null for ServiceAccount.
  // Create a new Organization for this Account if the organizationExternalId value is 'NEW' and newOrganizationName is set.
  let organizationId = null;
  if (organizationExternalId === 'NEW') {
    if (newOrganizationName !== '') {
      const organization = await createOrganization(newOrganizationName, user);
      organizationId = organization ? organization.id : null;
    }
  } else {
    const organization = await getOrganization(organizationExternalId, user);
    organizationId = organization ? organization.id : null;
  }

  // Look up the ServiceType record by externalId to get the serviceType.id or null for ServiceAccount.
  const serviceType = await getServiceType(serviceTypeExternalId, user);
  const serviceTypeId = serviceType ? serviceType.id : null;

  const newServiceAccount = await prisma.serviceAccount.create({
    data: {
      ...serviceAccountInput,
      accountId: user.accountId,
      organizationId: organizationId,
      serviceTypeId: serviceTypeId,
      startDate: startDate,
      endDate: endDate,
      createdUserId: user.id,
    },
  });

  if (newServiceAccount) {
    const serviceAccount = await prisma.serviceAccount.update({
      where: { id: newServiceAccount.id },
      data: {
        externalId: 'ServiceAccount' + newServiceAccount.id,
      },
    });
    return serviceAccount;
  }
  return null;
}

export async function updateServiceAccount(args, user) {
  const model = await getServiceAccount(args.externalId, user);
  if (model) {
    // Construct input model with every property except specific input fields not on ServiceAccount:
    const { organizationExternalId, serviceTypeExternalId, ...serviceAccountInput } = args.serviceAccount;
    const newOrganizationName = (args.newOrganizationName ? args.newOrganizationName : '');
    // console.log('newOrganizationName: ', newOrganizationName);
    // console.log('serviceAccountInput: ', serviceAccountInput);

    // Convert date/time inputs from String to Date objects for schema DateTime columns.
    const startDate = serviceAccountInput.startDate ? new Date(serviceAccountInput.startDate) : null;
    const endDate = serviceAccountInput.endDate ? new Date(serviceAccountInput.endDate) : null;

    // Look up the Organization record by externalId to get the organization.id or null for ServiceAccount.
    // Create a new Organization for this Account if the organizationExternalId value is 'NEW' and newOrganizationName is set.
    let organizationId = null;
    if (organizationExternalId === 'NEW') {
      if (newOrganizationName !== '') {
        const organization = await createOrganization(newOrganizationName, user);
        organizationId = organization ? organization.id : null;
      }
    } else {
      const organization = await getOrganization(organizationExternalId, user);
      organizationId = organization ? organization.id : null;
    }

    // Look up the ServiceType record by externalId to get the serviceType.id or null for ServiceAccount.
    const serviceType = await getServiceType(serviceTypeExternalId, user);
    const serviceTypeId = serviceType ? serviceType.id : null;

    const updatedServiceAccount = await prisma.serviceAccount.update({
      where: { id: model.id },
      data: {
        ...serviceAccountInput,
        organizationId: organizationId,
        serviceTypeId: serviceTypeId,
        startDate: startDate,
        endDate: endDate,
      },
    });

    return updatedServiceAccount;
  } else {
    throw new Error(`Failed to find ServiceAccount by ID: ${args.externalId} to update`);
  }
}

export async function deleteServiceAccount(args, user) {
  const model = await getServiceAccount(args.externalId, user);
  if (model) {
    const deletedModel = await prisma.serviceAccount.update({
      where: { id: model.id },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });
    return deletedModel;
  } else {
    throw new Error(`Failed to find ServiceAccount by ID: ${args.externalId} to delete`);
  }
}

async function createOrganization(newOrganizationName, user) {
  const newOrganization = await prisma.organization.create({
    data: {
      accountId: user.accountId,
      name: newOrganizationName,
      createdUserId: user.id,
    },
  });
  if (newOrganization) {
    const organization = await prisma.organization.update({
      where: { id: newOrganization.id },
      data: {
        externalId: 'Organization' + newOrganization.id,
      },
    });
    return organization;
  }
  return null;
}
