import { Outlet } from "@remix-run/react";
import { LoaderFunctionArgs } from '@remix-run/node';

import navStyles from '~/styles/nav.css';
import ProtectedHeader from '~/components/navigation/ProtectedHeader';
import { getUserFromSession, requireAuthUser } from "~/data/auth.server";

export default function ProtectedLayout() {
  return (
    <>
      <ProtectedHeader />
      <div className="px-8 py-6">
        <Outlet />
      </div>
    </>
  );
}

export function links() {
  return [{ rel: 'stylesheet', href: navStyles }];
}

export async function loader({request}: LoaderFunctionArgs) {
  // Require a Logged In user on the Protected layout, otherwise redirect to /login:
  const user = await requireAuthUser(request);

  // Returns a Promise with AuthUser (OK for loaders):
  return getUserFromSession(request);
}