import { type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";
import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

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
    <LoginForm error={null} />
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

export function ErrorBoundary() {
  const error = useRouteError();
  // console.error(error);

  if (isRouteErrorResponse(error)) {
    return (
      <LoginForm error={error.data?.message || 'Something went wrong'} />
    );
  }
  else if (error instanceof Error) {
    // Uncaught Errors, such as DB errors thrown from server.js files.
    return (
      <LoginForm error={error.message || 'Something went wrong'} />
    );
  }
  else {
    <LoginForm error={'Unknown Error'} />;
  }
}
