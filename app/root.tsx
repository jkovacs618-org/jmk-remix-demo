import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Link,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse
} from "@remix-run/react";
import { ReactNode } from "react";

import ErrorBox from '~/components/util/ErrorBox';
import mainStyles from '~/styles/index.css';

export const meta: MetaFunction = () => {
  return [
    { title: "JMK Remix Demo" },
    { name: "description", content: "JMK Remix Demo" },
  ];
}

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : [{ rel: "stylesheet", href: mainStyles }]),
];

function Document({title, children}: {title?: string, children: ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title && <title>{title}</title>}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    const status = error.status;
    const title = status === 404 ? 'Page Not Found' : 'An error occurred';

    return (
      <Document title={title}>
        <main className="error">
          <ErrorBox title="An error occurred">
            <p>
              {
                error.data.message || 'Something went wrong. Please try again later.'
              }
            </p>
            <p>Return to <Link to="/">Home page</Link></p>
          </ErrorBox>
        </main>
      </Document>
    );
  }
  else if (error instanceof Error) {
    // Uncaught Errors, such as DB errors thrown from server.js files.
    return (
      <Document title="An error occurred">
        <main className="error">
          <ErrorBox title="An error occurred">
            <p>
              {
                error.message || 'Something went wrong. Please try again later.'
              }
            </p>
            <p>Return to <Link to="/">Home page</Link></p>
          </ErrorBox>
        </main>
      </Document>
    );
  }
  else {
    return <h1>Unknown Error</h1>;
  }
}
