import { Link, NavLink, useLoaderData, Form } from '@remix-run/react';

function PublicHeader() {
  const userId = useLoaderData();

  return (
    <div>
      <div className="flex items-center bg-slate-800 h-16 pl-6 pr-8 text-white">
          <div className="flex gap-4">
            <h3 className="font-bold">Remix Demo</h3>
          </div>

          <div className="ml-auto">
              <div className="flex">
                <div className="flex-col">
                  <Link to="/login" className="text-white hover:text-slate-300">
                    Login
                  </Link>
                </div>
            </div>
          </div>
      </div>
    </div>
  );
}

export default PublicHeader;
