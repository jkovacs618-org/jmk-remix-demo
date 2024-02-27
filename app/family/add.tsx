import { redirect } from '@remix-run/node';
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";

import PersonForm from "~/components/family/PersonForm";
import Breadcrumbs from '~/components/navigation/Breadcrumbs';
import { requireAuthUser } from '~/data/auth.server';
import { createPerson } from '~/data/objects/Person.server';
import { validatePersonInput } from '~/data/persons.server';

export const meta: MetaFunction = () => {
  return [
    { title: "Add Person" },
    { name: "description", content: "Add Person" },
  ];
};

export default function PersonAddPage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate('/family');
  }

  const breadcrumbLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/family', label: 'Family' },
    { path: '', label: 'New Person' },
  ];

  return (
    <>
      <Breadcrumbs links={breadcrumbLinks} />

      <h2 className="text-3xl text-slate-600 font-bold">New Person</h2>

      <PersonForm />
    </>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const authUser = await requireAuthUser(request);

  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    validatePersonInput(data);
  }
  catch (error) {
    return error;
  }

  const {isDeceased, ...personInput} = data;
  const args = {
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

  const newPerson = await createPerson(args, authUser);
  if (!newPerson) {
    return 'Failed to add new person.';
  }

  return redirect('/family');
}