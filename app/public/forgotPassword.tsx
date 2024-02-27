import { redirect, type ActionFunctionArgs, type MetaFunction } from "@remix-run/node";

import ForgotPasswordForm from '~/components/auth/ForgotPasswordForm';
// import { forgotPassword } from "~/data/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Forgot Password" },
    { name: "description", content: "Forgot Password" },
  ];
};

export default function ForgotPasswordPage() {
  return (
    <ForgotPasswordForm />
  );
}

export async function action({ request }: ActionFunctionArgs) {
  // const formData = await request.formData();
  // const credentials = Object.fromEntries(formData);
  // return await forgotPassword(credentials as {email: string});
  return redirect('/login');
}
