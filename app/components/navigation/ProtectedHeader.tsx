import { NavLink, Form, useLoaderData } from '@remix-run/react';
import { FaBars, FaCircleUser, FaRightFromBracket } from 'react-icons/fa6';
import { AuthUser } from '~/interfaces/Auth';

export default function ProtectedHeader() {
  const user = useLoaderData<AuthUser>();
  // console.log('user: ', user);

  return (
    <div>
      <nav className="flex items-center bg-slate-800 h-16 pl-6 pr-8 text-white">
          <div className="flex gap-4">
              <NavLink to="/dashboard" className="nav-link">
                  Dashboard
              </NavLink>
              <NavLink to="/family" className="nav-link">
                  Family
              </NavLink>
              <NavLink to="/events" className="nav-link">
                  Events
              </NavLink>
              <NavLink to="/services" className="nav-link">
                  Accounts
              </NavLink>
          </div>

          <div className="ml-auto">
              <div className="flex">
                <NavLink to="/account" className="nav-link flex-col">
                    {user ? (
                        <div>
                          <div className="flex">
                            <div className="flex-col">
                              <FaCircleUser className="mr-2 text-lg" />
                            </div>
                            <div className="flex-col">
                                {user.nameFirst} {user.nameLast}
                            </div>
                          </div>
                        </div>
                    ) : null}
                </NavLink>

                <div className="flex-col">
                  <Form method='post' action="/logout" id="logout-form">
                    <button className="text-white hover:text-gray-300 cursor-pointer ml-6 bg-transparent p-0 mt-2">
                      <FaRightFromBracket className="text-lg" title="Log Out" />
                    </button>
                  </Form>
                </div>
            </div>
          </div>
      </nav>
    </div>
  );
}
