import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import AccountInfo from "~/components/account/AccountInfo";
import { getUserFromSession, requireAuthUser } from "~/data/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "My Account" },
    { name: "description", content: "My Account" },
  ];
};

export default function AccountPage() {
  return (
    <div className="relative flex flex-col">
      <div className="mb-4">
          <h2 className="text-3xl text-slate-600 font-bold">My Account</h2>
      </div>

      <AccountInfo />
  </div>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  // Require a Logged In user, otherwise redirect to /login:
  const user = await requireAuthUser(request);
  return getUserFromSession(request);
}