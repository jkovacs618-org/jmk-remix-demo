import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";

import LoginForm from '~/components/auth/LoginForm';
import { login, validateLogin } from "~/data/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Login" },
  ];
};

export default function LoginPage() {
  return (
    <LoginForm />
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  // Validate user input server-side
  try {
    validateLogin(credentials);
  }
  catch (error) {
    return error;
  }

  return await login(credentials as {email: string, password: string});
}
