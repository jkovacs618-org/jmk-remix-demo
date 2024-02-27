import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import ServiceAccountForm from "~/components/services/ServiceAccountForm";
import Breadcrumbs from '~/components/navigation/Breadcrumbs';
import { requireAuthUser } from '~/data/auth.server';
import { createServiceAccount, getOrganizations, getServiceTypes } from '~/data/objects/ServiceAccount.server';
import { validateServiceAccountInput } from '~/data/serviceAccounts.server';

export const meta: MetaFunction = () => {
  return [
    { description: "Add Account" },
    { name: "description", content: "Add Account" },
  ];
};

export default function ServiceAccountAddPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('/services');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/services', label: 'Accounts' },
    { path: '', label: 'New Account' },
  ];

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">New Account</h2>

      <ServiceAccountForm />
    </>
  );
}

export async function loader({params, request}: LoaderFunctionArgs) {
  // Must authenticate user for all nested loader() functions.
  const authUser = await requireAuthUser(request);

  const serviceAccount = null;
  const organizations = await getOrganizations(authUser);
  const serviceTypes = await getServiceTypes(authUser);
  return {serviceAccountData: serviceAccount, organizations: organizations, serviceTypes: serviceTypes};
}

export async function action({ request }: ActionFunctionArgs) {
  const authUser = await requireAuthUser(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    validateServiceAccountInput(data);
  }
  catch (error) {
    return error;
  }
  // console.log('data: ', data);

  const args = {
    serviceAccount: {
      organizationExternalId: (data.organizationExternalId ? data.organizationExternalId : null),
      serviceTypeExternalId: (data.serviceTypeExternalId ? data.serviceTypeExternalId : null),
      description: data.description,
      accountNumber: data.accountNumber,
      startDate: data.startDate ? new Date(data.startDate + ' 12:00:00') : null,
      endDate: data.endDate ? new Date(data.endDate + ' 12:00:00') : null,
    },
    newOrganizatioName: (data.organizationExternalId === 'NEW' && data.newOrganizatioName ? data.newOrganizatioName : ''),
  };
  // console.log('args: ', args);

  const newServiceAccount = await createServiceAccount(args, authUser);
  if (!newServiceAccount) {
    return 'Failed to add new account.';
  }

  return redirect('/services');
}