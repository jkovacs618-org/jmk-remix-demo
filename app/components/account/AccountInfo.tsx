import { useLoaderData } from "@remix-run/react";
import { AuthUser } from "~/interfaces/Auth";

export default function AccountInfo() {
  const user = useLoaderData<AuthUser>();
  // console.log('user: ', user);

  return user ? (
      <div className="block p-8 bg-white border border-gray-200 shadow-xl rounded-lg shadowdark:border-gray-700">
          <h5 className="mb-4 text-2xl font-bold tracking-tight">
              {user.nameFirst} {user.nameLast}
          </h5>
          <p className="font-normal text-gray-700">Email: {user.email}</p>
          <p className="font-normal text-gray-700">
              {/* Created: {dayjs(authUser.createdAt).format("M/DD/YYYY")} */}
          </p>
      </div>
  ) : (
      ''
  )
}
