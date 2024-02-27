import { useActionData, Form, useNavigation, useParams, useLoaderData } from '@remix-run/react';
import { Label } from "flowbite-react";
import SubmitButton from '~/components/shared/SubmitButton';
import CancelButton from '~/components/shared/CancelButton';
import { useState } from 'react';
import dayjs from 'dayjs';

export default function PersonForm() {
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const params = useParams();

  const personData = useLoaderData();
  // console.log('personData: ', personData);

  const genders = ['Male', 'Female', 'Other', 'Not Specified'];

  const relationships = [
      'Self',
      'Parent',
      'Guardian',
      'Spouse',
      'Partner',
      'Child',
      'Step Child',
      'Sibling',
      'Aunt',
      'Uncle',
      'Niece',
      'Nephew',
      'Friend',
      'Colleague',
      'Contact',
      'Other',
  ];

  const getAllowedRelationships = (person) => {
    let allowedRelationships = []
    if (person?.relationship === 'Self') {
        allowedRelationships = ['Self']
    } else {
        allowedRelationships = relationships.filter((value) => value !== 'Self')
    }
    return allowedRelationships
  }

  // If ID is invalid, add form is shown; Instead, handle if ID is set.
  if (params.id && !personData) {
    return <p>Invalid Person ID</p>;
  }

  const errors = {};

  const defaultValues = personData ? {
    nameFirst: personData.nameFirst,
    nameMiddle: personData.nameMiddle,
    nameLast: personData.nameLast,
    gender: personData.gender,
    birthDate: personData.birthDate
        ? dayjs(personData.birthDate).format('YYYY-MM-DD')
    : '',
    deathDate: personData.deathDate
        ? dayjs(personData.deathDate).format('YYYY-MM-DD')
    : '',
    relationship: personData.relationship,
    isDeceased: personData.deathDate && personData.deathDate !== ''
  } : {
    nameFirst: '',
    nameMiddle: '',
    nameLast: '',
    gender: '',
    birthDate: '',
    deathDate: '',
    relationship: '',
    isDeceased: false
  };

  const [isDeceased, setIsDeceased] = useState(defaultValues.isDeceased);

  return (
    <Form method={personData ? 'patch' : 'post'} className="form" id="person-form">

      <div className="form-group">
          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="nameFirst" value="First Name *" />
              </div>
              <div>
                  <input
                      id="nameFirst"
                      name="nameFirst"
                      defaultValue={defaultValues.nameFirst}
                      className="form-control"
                      aria-invalid={errors.nameFirst ? 'true' : 'false'}
                      autoComplete='off'
                      data-lpignore="true"
                      required
                  />
                  {errors.nameFirst?.type === 'required' && (
                      <span role="alert" className="text-red-500 text-sm font-bold">
                          First name is required
                      </span>
                  )}
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="nameMiddle" value="Middle Name" />
              </div>
              <div>
                  <input
                      id="nameMiddle"
                      name="nameMiddle"
                      defaultValue={defaultValues.nameMiddle}
                      className="form-control"
                      aria-invalid={errors.nameMiddle ? 'true' : 'false'}
                      autoComplete='off'
                  />
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="nameLast" value="Last Name *" />
              </div>
              <div>
                  <input
                      id="nameLast"
                      name="nameLast"
                      defaultValue={defaultValues.nameLast}
                      className="form-control"
                      aria-invalid={errors.nameLast ? 'true' : 'false'}
                      autoComplete='off'
                      required
                  />
                  {errors.nameLast?.type === 'required' && (
                      <span role="alert" className="text-red-500 text-sm font-bold">
                          Last name is required
                      </span>
                  )}
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="gender" value="Gender" />
              </div>
              <div>
                  <select
                      id="gender"
                      name="gender"
                      defaultValue={defaultValues.gender}
                      className="form-control"
                      autoComplete='off'
                  >
                      <option value="">Select...</option>
                      {genders.map((value) => {
                          return (
                              <option key={value} value={value}>
                                  {value}
                              </option>
                          )
                      })}
                  </select>
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="birthDate" value="Date of Birth" />
              </div>
              <div>
                  <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      defaultValue={defaultValues.birthDate}
                      className="form-control"
                      autoComplete='off'
                  />
              </div>
          </div>

          <div className="mb-2">
              <input
                  type="checkbox"
                  id="isDeceasedAdd"
                  name="isDeceased"
                  checked={isDeceased}
                  onChange={(e) => setIsDeceased(e.target.checked)}
                  className="mr-2"
              />
              <Label htmlFor="isDeceasedAdd" value="Deceased?" />
          </div>

          {isDeceased ? (
              <div className="mb-2">
                  <div className="mb-1 block">
                      <Label htmlFor="deathDate" value="Date of Death" />
                  </div>
                  <div>
                      <input
                          type="date"
                          id="deathDate"
                          name="deathDate"
                          defaultValue={defaultValues.deathDate}
                          className="form-control"
                      />
                  </div>
              </div>
          ) : (
              ''
          )}

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="relationship" value="Relationship" />
              </div>
              <div>
                  <select
                      id="relationship"
                      name="relationship"
                      defaultValue={defaultValues.relationship}
                      className="form-control"
                      autoComplete='off'
                      disabled={personData && personData.relationship === 'Self'}
                  >
                      <option value="">Select...</option>
                      {getAllowedRelationships(personData)
                          .map((value) => {
                              const label =
                                  (![
                                      'Self',
                                      'Friend',
                                      'Colleague',
                                      'Contact',
                                      'Other',
                                  ].includes(value)
                                      ? 'My '
                                      : '') + value
                              return (
                                  <option key={value} value={value}>
                                      {label}
                                  </option>
                              )
                          })}
                  </select>
              </div>
          </div>
      </div>

      <div className="form-group mt-4">
          <SubmitButton label={isSubmitting ? 'Saving...' : (params.id ? 'Update' : 'Add Person')} disabled={isSubmitting} />
          <CancelButton path="/family" />
      </div>

      {validationErrors && (
        <ul>
        {Object.values(validationErrors).map((error) => (
          <li key={error}>{error}</li>
        ))}
        </ul>
      )}
    </Form>
  );
}
