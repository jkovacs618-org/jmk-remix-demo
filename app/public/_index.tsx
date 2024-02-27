import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, redirect, useLoaderData } from "@remix-run/react";
import { getUserIdFromSession } from "~/data/auth.server";

export default function IndexPage() {
  // const userId = useLoaderData();
  // console.log('userId: ', userId);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Remix Demo</h1>

      <ul>
        <li>
          <Link to="/login">
            Login
          </Link>
        </li>
      </ul>
    </div>
  );
}

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserIdFromSession(request);

  if (userId) {
    return redirect('/dashboard');
  }
  else {
    return redirect('/login');
  }
}