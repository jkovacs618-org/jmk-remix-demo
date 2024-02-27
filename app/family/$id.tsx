import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData, useNavigate } from "@remix-run/react";

import PersonForm from "~/components/family/PersonForm";
import Breadcrumbs from "~/components/navigation/Breadcrumbs";
import { getUserFromSession, requireAuthUser } from "~/data/auth.server";
import { getDefaultCalendar } from "~/data/objects/Event.server";
import { getPerson, updatePerson, deletePerson, getSelfPerson } from '~/data/objects/Person.server';
import { validatePersonInput } from "~/data/persons.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Person" },
    { name: "description", content: "Edit Person" },
  ];
};

export default function PersonEditPage() {
  const navigate = useNavigate();
  const person = useLoaderData();

  function closeHandler() {
    navigate('..');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/family', label: 'Family' },
    { path: '', label: 'Edit Person' },
  ]

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">Edit Person</h2>

      <PersonForm />
    </>
  );
}

export async function loader({params, request}: LoaderFunctionArgs) {
  // Must authenticate user for all nested loader() functions.
  const authUser = await requireAuthUser(request);

  const personId = params.id;
  const person = await getPerson(personId, authUser);
  return person;
}

export async function action({params, request }: ActionFunctionArgs) {
  const personId = params.id;
  // const authUser = await getUserFromSession(request);
  const authUser = await requireAuthUser(request);
  const selfPerson = await getSelfPerson(authUser);
  authUser.personId = (selfPerson ? selfPerson.id : null);

if (request.method === 'PATCH') {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      validatePersonInput(data);
    } catch (error) {
      return error;
    }

    const args = {
      externalId: personId,
      person: {
        nameFirst: data.nameFirst,
        nameMiddle: data.nameMiddle,
        nameLast: data.nameLast,
        gender: data.gender,
        birthDate: data.birthDate ? new Date(data.birthDate + ' 12:00:00') : null,
        deathDate:
            data.isDeceased && data.deathDate
                ? new Date(data.deathDate + ' 12:00:00')
                : null,
        relationship: data.relationship,
      },
    };
    // console.log('args: ', args);

    await updatePerson(args, authUser);
    return redirect('/family');
  }
  else if (request.method === 'DELETE') {
    const args = {
      externalId: personId
    };
    await deletePerson(args, authUser);
    return redirect('/family');
  }
}