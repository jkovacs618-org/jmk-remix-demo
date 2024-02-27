import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import PublicHeader from '~/components/navigation/PublicHeader';
import { getUserIdFromSession } from "~/data/auth.server";

import publicStyles from '~/styles/public.css';

export default function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <Outlet />
    </>
  );
}

export function loader({request}: LoaderFunctionArgs) {
  // Returns a Promise with userId or null:
  return getUserIdFromSession(request);
}

export function links() {
  return [{ rel: 'stylesheet', href: publicStyles }];
}