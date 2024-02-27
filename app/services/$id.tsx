import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useNavigate } from "@remix-run/react";

import ServiceAccountForm from "~/components/services/ServiceAccountForm";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { requireAuthUser } from "~/data/auth.server";
import { validateServiceAccountInput } from "~/data/serviceAccounts.server";
import { getServiceAccount, getOrganizations, getServiceTypes, updateServiceAccount, deleteServiceAccount } from "~/data/objects/ServiceAccount.server";

export const meta: MetaFunction = () => {
  return [
    { description: "Edit Account" },
    { name: "description", content: "Edit Account" },
  ];
};

export default function EventEditPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('..');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/services', label: 'Accounts' },
    { path: '', label: 'Edit Account' },
  ]

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">Edit Account</h2>

      <ServiceAccountForm />
    </>
  );
}

export async function loader({params, request}: LoaderFunctionArgs) {
  // Must authenticate user for all nested loader() functions.
  const authUser = await requireAuthUser(request);

  const serviceAccountId = params.id;
  const serviceAccount = await getServiceAccount(serviceAccountId, authUser);
  const organizations = await getOrganizations(authUser);
  const serviceTypes = await getServiceTypes(authUser);
  return {serviceAccountData: serviceAccount, organizations: organizations, serviceTypes: serviceTypes};
}

export async function action({params, request }: ActionFunctionArgs) {
  const serviceAccountId = params.id;
  const authUser = await requireAuthUser(request);

if (request.method === 'PATCH') {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      validateServiceAccountInput(data);
    } catch (error) {
      return error;
    }
    // console.log('data: ', data);

    const args = {
      externalId: serviceAccountId,
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

    await updateServiceAccount(args, authUser);
    return redirect('/services');
  }
  else if (request.method === 'DELETE') {
    const args = {
      externalId: serviceAccountId
    };
    await deleteServiceAccount(args, authUser);
    return redirect('/services');
  }
}