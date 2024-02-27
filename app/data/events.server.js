
function isValidTitle(value) {
  return value && value.trim().length > 0 && value.trim().length <= 200;
}

function isValidDate(value) {
  // return value && new Date(value).getTime() < new Date().getTime();
  return value && !isNaN(new Date(value).valueOf());
}

export function validateEventInput(input) {
  let validationErrors = {};

  if (!isValidTitle(input.title)) {
    validationErrors.title = 'Invalid title.'
  }

  if (input.startDate !== '' && !isValidDate(input.startDate)) {
    validationErrors.startDate = 'Invalid start date.'
  }

  if (input.endDate !== '' && !isValidDate(input.endDate)) {
    validationErrors.startDate = 'Invalid end date.'
  }

  if (Object.keys(validationErrors).length > 0) {
    throw validationErrors;
  }
}