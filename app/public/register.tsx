import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";

import RegisterForm from '~/components/auth/RegisterForm';
import { register, validateRegister } from "~/data/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Register" },
    { name: "description", content: "Register" },
  ];
};

export default function RegisterPage() {
  return (
    <RegisterForm />
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const inputs = Object.fromEntries(formData);

  // Validate user input server-side
  try {
    validateRegister(inputs);
  }
  catch (error) {
    return error;
  }

  return await register(inputs as {name_first: string, name_last: string, email: string, password: string});
}
