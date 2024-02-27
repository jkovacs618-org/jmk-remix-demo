function isValidOrgName(value) {
  return value && value.trim().length > 0 && value.trim().length <= 200;
}

function isValidDate(value) {
  // return value && new Date(value).getTime() < new Date().getTime();
  return value && !isNaN(new Date(value).valueOf());
}

export function validateServiceAccountInput(input) {
  let validationErrors = {};

  if (input.organizationExternalId === 'NEW') {
    if (!isValidOrgName(input.newOrganizationName)) {
      validationErrors.newOrganizationName = 'Invalid organization name.'
    }
  }

  if (input.startDate !== '' && !isValidDate(input.startDate)) {
    validationErrors.startDate = 'Invalid start date.'
  }

  if (input.endDate !== '' && !isValidDate(input.endDate)) {
    validationErrors.endDate = 'Invalid end date.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}