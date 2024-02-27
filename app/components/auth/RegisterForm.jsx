import { Link, Form, useNavigation, useActionData } from '@remix-run/react';
import { FaInfoCircle } from 'react-icons/fa';

function RegisterForm() {
  const navigation = useNavigation();
  const validationErrors = useActionData();
  const isSubmitting = navigation.state !== 'idle';

  const nameFirstError = null;
  const nameLastError = null;

  const useDefaultValues = false;
  const defaultValues = {
    name_first: (useDefaultValues ? 'Test' : ''),
    name_last: (useDefaultValues ? 'Name' : ''),
    email: (useDefaultValues ? 'test1@example.org' : ''),
    password: (useDefaultValues ? 'password' : ''),
  };

  return (
    <Form method="post" id="auth-form" className="form space-y-4 md:space-y-6">
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                  Create an account
              </h1>
              {validationErrors && (
                  <div
                      className="flex p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                      role="alert"
                  >
                      <FaInfoCircle className="text-red-500 text-lg mr-2" />
                      <span className="sr-only">Error</span>
                      <div>
                        <ul>
                          {Object.values(validationErrors).map((error) => (
                            <li key={error}>{error}</li>
                          ))}
                        </ul>
                      </div>
                  </div>
              )}

              <div>
                  <label
                      htmlFor="name_first"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                      First Name
                  </label>
                  <input
                      type="text"
                      name="name_first"
                      id="name_first"
                      placeholder=""
                      defaultValue={defaultValues.name_first}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                  />
                  {nameFirstError && (
                      <p className="text-sm text-red-600">{nameFirstError}</p>
                  )}
              </div>
              <div>
                  <label
                      htmlFor="name_last"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                      Last Name
                  </label>
                  <input
                      type="text"
                      name="name_last"
                      id="name_last"
                      placeholder=""
                      defaultValue={defaultValues.name_last}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                  />
                  {nameLastError && (
                      <p className="text-sm text-red-600">{nameLastError}</p>
                  )}
              </div>
              <div>
                  <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                      Your email
                  </label>
                  <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder=""
                      defaultValue={defaultValues.email}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                  />
              </div>
              <div>
                  <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                      Password
                  </label>
                  <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder=""
                      defaultValue={defaultValues.password}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      minLength={8}
                  />
              </div>
              <div>
                  <label
                      htmlFor="cpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                      Confirm password
                  </label>
                  <input
                      type="password"
                      name="cpassword"
                      id="cpassword"
                      autoComplete="new-cpassword"
                      defaultValue={defaultValues.password}
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-sky-600 focus:border-sky-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                      minLength={8}
                  />
              </div>

              <div className="form-actions">
                <button
                    type="submit"
                    className="w-full text-white bg-sky-600 hover:bg-sky-500 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-sky-600 dark:hover:bg-sky-700 dark:focus:ring-sky-800"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'SIGN UP'}
                </button>
              </div>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Already have an account?{' '}
                  <Link
                      to="/login"
                      className="font-medium text-sky-600 hover:underline dark:text-sky-500 ml-2"
                  >
                      Sign In
                  </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

    </Form>
  );
}

export default RegisterForm;
