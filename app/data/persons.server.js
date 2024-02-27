function isValidName(value) {
  return value && value.trim().length > 0 && value.trim().length <= 200;
}

function isValidDate(value) {
  // return value && new Date(value).getTime() < new Date().getTime();
  return value && !isNaN(new Date(value).valueOf());
}

export function validatePersonInput(input) {
  let validationErrors = {};

  if (!isValidName(input.nameFirst)) {
    validationErrors.nameFirst = 'Invalid first name.'
  }

  if (!isValidName(input.nameLast)) {
    validationErrors.nameLast = 'Invalid last name.'
  }

  if (input.birthDate !== '' && !isValidDate(input.birthDate)) {
    validationErrors.birthDate = 'Invalid date.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}