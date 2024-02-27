import { useActionData, Form, useNavigation, useParams, useLoaderData } from '@remix-run/react';
import { Label } from "flowbite-react";
import SubmitButton from '~/components/shared/SubmitButton';
import CancelButton from '~/components/shared/CancelButton';
import dayjs from 'dayjs';
import { useState } from 'react';

export default function ServiceAccountForm() {
  const validationErrors = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== 'idle';
  const params = useParams();

  const {serviceAccountData, organizations, serviceTypes} = useLoaderData();
  // console.log('serviceAccountData: ', serviceAccountData);
  // console.log('organizations: ', organizations);
  // console.log('serviceTypes: ', serviceTypes);

  // If ID is invalid, add form is shown; Instead, handle if ID is set.
  if (params.id && !serviceAccountData) {
    return <p>Invalid Account ID</p>;
  }

  const errors = {};

  const defaultValues = serviceAccountData ? {
    description: serviceAccountData.description,
    accountNumber: serviceAccountData.accountNumber,
    startDate: serviceAccountData.startDate
        ? dayjs(serviceAccountData.startDate).format('YYYY-MM-DD')
    : '',
    endDate: serviceAccountData.endDate
        ? dayjs(serviceAccountData.endDate).format('YYYY-MM-DD')
    : '',
    organizationExternalId: serviceAccountData.organizationExternalId,
    serviceTypeExternalId: serviceAccountData.serviceTypeExternalId,
    newOrganizationName: '',
  } : {
    description: '',
    accountNumber: '',
    startDate: '',
    endDate: '',
    organizationExternalId: '',
    serviceTypeExternalId: '',
    newOrganizationName: '',
  };
  // console.log('defaultValues: ', defaultValues);

  const [organizationExternalId, setOrganizationExternalId] = useState(defaultValues.organizationExternalId);

  return (
    <Form method={serviceAccountData ? 'patch' : 'post'} className="form" id="service-account-form">

      <div className="form-group">
            <div className="mb-2">
                <div className="mb-1 block">
                    <Label htmlFor="organization" value="Organization *" />
                </div>
                <div>
                    <select
                        id="organizationExternalId"
                        name="organizationExternalId"
                        className="form-control"
                        autoComplete="off"
                        value={organizationExternalId}
                        onChange={(e) => setOrganizationExternalId(e.target.value)}
                        required
                        data-lpignore="true"
                    >
                        <option value="">Select...</option>
                        {organizations.map((organization) => {
                            return (
                                <option
                                    key={organization.externalId}
                                    value={organization.externalId}
                                >
                                    {organization.name}
                                </option>
                            )
                        })}
                        {/*<option key="NEW" value="NEW">
                            Add New
                        </option>
                        */}
                    </select>
                    {errors.organizationExternalId?.type === 'required' && (
                        <span role="alert" className="text-red-500 text-sm font-bold">
                            Please select an organization
                        </span>
                    )}
                </div>
            </div>

            {/*
            {organizationExternalId === 'NEW' && (
                <div className="mb-2">
                    <div className="mb-1 block">
                        <Label
                            htmlFor="newOrganizationName"
                            value="New Organization Name *"
                        />
                    </div>
                    <input
                        type="text"
                        id="newOrganizationName"
                        name="newOrganizationName"
                        defaultValue=""
                        className="form-control"
                    />
                    {errors.newOrganizationName?.type === 'validate' && (
                        <span role="alert" className="text-red-500 text-sm font-bold">
                            Please enter an organization name
                        </span>
                    )}
                </div>
            )}
            */}

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="description" value="Description" />
              </div>
              <div>
                  <input
                      id="description"
                      name="description"
                      type="text"
                      defaultValue={defaultValues.description}
                      className="form-control"
                      aria-invalid={errors.description ? 'true' : 'false'}
                      autoComplete='off'
                      data-lpignore="true"
                  />
              </div>
          </div>

          <div className="mb-2">
                <div className="mb-1 block">
                    <Label htmlFor="serviceType" value="Service Type" />
                </div>
                <div>
                    <select
                        id="serviceTypeExternalId"
                        name="serviceTypeExternalId"
                        className="form-control"
                        defaultValue={defaultValues.serviceTypeExternalId}
                        data-lpignore="true"
                    >
                        <option value="">Select...</option>
                        {serviceTypes.map((serviceType) => {
                            return (
                                <option
                                    key={serviceType.externalId}
                                    value={serviceType.externalId}
                                >
                                    {serviceType.name}
                                </option>
                            )
                        })}
                    </select>
                </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="accountNumber" value="Account Number" />
              </div>
              <div>
                  <input
                      id="accountNumber"
                      name="accountNumber"
                      type="text"
                      defaultValue={defaultValues.accountNumber}
                      className="form-control"
                      aria-invalid={errors.accountNumber ? 'true' : 'false'}
                      autoComplete='off'
                      data-lpignore="true"
                  />
              </div>
          </div>

          <div className="mb-2">
              <div className="mb-1 block">
                  <Label htmlFor="startDate" value="Start" />
              </div>
              <div>
                  <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      defaultValue={defaultValues.startDate}
                      className="form-control"
                      autoComplete='off'
                      data-lpignore="true"
                  />
              </div>
          </div>

            <div className="mb-2">
                <div className="mb-1 block">
                    <Label htmlFor="endDate" value="End" />
                </div>
                <div>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        defaultValue={defaultValues.endDate}
                        className="form-control"
                        data-lpignore="true"
                    />
                </div>
            </div>

      </div>

      <div className="form-group mt-4">
          <SubmitButton label={isSubmitting ? 'Saving...' : (params.id ? 'Update' : 'Add Account')} disabled={isSubmitting} />
          <CancelButton path="/services" />
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
