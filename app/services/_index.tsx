import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { requireAuthUser } from "~/data/auth.server";
import { getServiceAccounts } from "~/data/objects/ServiceAccount.server";
import { AuthUser } from "~/interfaces/Auth";
import { ServiceAccount } from "~/interfaces/interfaces";
import ServicesList from "~/components/services/ServicesList";

type PageData = {
  authUser: AuthUser;
  serviceAccounts: ServiceAccount[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Accounts" },
    { name: "description", content: "Accounts" },
  ];
};

export default function ServicesPage() {
  const { authUser, serviceAccounts }: PageData = useLoaderData();

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/services', label: 'Accounts' },
  ]

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <div className="flex gap-4">
          <div>
              <h2 className="text-3xl text-slate-600 font-bold">Service Accounts</h2>
          </div>
          <div className="ml-auto">
              <Link to="/services/add" className="text-white">
                  <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                      New Account
                  </button>
              </Link>
          </div>
      </div>

      <div className="mt-2">
        {/*SEARCH: TO-DO*/}
      </div>

      <div>
          <div className="d-inline col-4 text-sm mt-2">
              Total items: &nbsp;
              <span className="badge badge-info">
                  {serviceAccounts ? serviceAccounts.length : 0}
              </span>
          </div>
      </div>

      <ServicesList serviceAccounts={serviceAccounts} authUser={authUser} />
    </>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  // Require a Logged In user, otherwise redirect to /login:
  const user = await requireAuthUser(request);
  const serviceAccounts = await getServiceAccounts(user);

  const pageData: PageData = {
    authUser: user,
    serviceAccounts: serviceAccounts,
  };
  return pageData;
}