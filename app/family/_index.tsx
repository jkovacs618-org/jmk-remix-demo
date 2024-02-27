import { User } from "@prisma/client";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import PersonsList from "~/components/family/PersonsList";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { requireAuthUser } from "~/data/auth.server";
import { getPersons, getSelfPerson } from "~/data/objects/Person.server";
import { AuthUser } from "~/interfaces/Auth";
import { Person } from "~/interfaces/interfaces";

type PageData = {
  authUser: AuthUser;
  selfPerson: Person;
  persons: Person[];
}

export const meta: MetaFunction = () => {
  return [
    { title: "Family" },
    { name: "description", content: "Family" },
  ];
};

export default function FamilyPage() {
  const { authUser, selfPerson, persons }: PageData = useLoaderData();
  // const hasPersons = persons && persons.length > 0;

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/family', label: 'Family' },
  ];

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <div className="flex gap-4">
          <div>
              <h2 className="text-3xl text-slate-600 font-bold">Family</h2>
          </div>
          <div className="ml-auto">
              <Link to="/family/person/add" className="text-white">
                  <button className="rounded-md bg-sky-600 py-2 px-3 text-sm font-semibold text-white hover:text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
                      New Person
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
                  {persons ? persons.length : 0}
              </span>
          </div>
      </div>

      <PersonsList persons={persons} authUser={authUser} selfPerson={selfPerson} />
    </>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  // Require a Logged In user, otherwise redirect to /login:
  const user = await requireAuthUser(request);
  const selfPerson = await getSelfPerson(user);
  const persons = await getPersons(user);

  const pageData: PageData = {
    authUser: user,
    selfPerson: selfPerson,
    persons: persons,
  };
  return pageData;
}