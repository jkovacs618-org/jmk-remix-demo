import { Table } from "flowbite-react";
import { ServiceAccount } from '~/interfaces/interfaces';
import { Link, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import { AuthUser } from "~/interfaces/Auth";

export default function ServicesList({ serviceAccounts, authUser }: {serviceAccounts: ServiceAccount[], authUser: AuthUser}) {

  // Programmatic Delete: behind-the-scenes submission, and Redirect back to same page:
  const submit = useSubmit();

  const handleClickDelete = (e: React.MouseEvent, serviceAccount: ServiceAccount) => {
    e.preventDefault()
    if (
        confirm(
            `Are you sure you want to remove the account${serviceAccount.organization ? ': ' + serviceAccount.organization.name : ''}?`
        )
    ) {
        submit(null, {method: 'delete', action: `/services/edit/${serviceAccount.externalId}`});
      }
  };

  const maskAccountNumber = (str: string | null) => {
    if (str) {
        const numChars = Math.min(4, str.length)
        return 'X'.repeat(str.length - numChars) + str.slice(numChars * -1)
    }
    return '-'
  }

  return (
    <div className="mt-3 mb-10">
      <div className="overflow-x-auto">
          <Table striped className="text-left">
              <Table.Head>
                <Table.HeadCell className="py-3">Organization</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Service Type</Table.HeadCell>
                <Table.HeadCell>Account Number</Table.HeadCell>
                <Table.HeadCell>Start</Table.HeadCell>
                <Table.HeadCell>End</Table.HeadCell>
                <Table.HeadCell>
                    <span className="sr-only">Actions</span>
                </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                  {serviceAccounts.map((serviceAccount: ServiceAccount) => (
                        <Table.Row
                            key={serviceAccount.externalId}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-2">
                                <Link to={`/services/edit/${serviceAccount.externalId}`}>
                                    <span className="font-medium">
                                        {serviceAccount.organization
                                            ? serviceAccount.organization.name
                                            : '-'}
                                        <br />
                                    </span>
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-xs">
                                    {serviceAccount.description
                                        ? serviceAccount.description
                                        : '-'}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                <span className="text-xs">
                                    {serviceAccount.serviceType
                                        ? serviceAccount.serviceType.name
                                        : '-'}
                                </span>
                            </Table.Cell>
                            <Table.Cell>
                                {serviceAccount.accountNumber
                                    ? maskAccountNumber(
                                            serviceAccount.accountNumber
                                        )
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {serviceAccount.startDate
                                    ? dayjs(serviceAccount.startDate).format('M/D/YY')
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {serviceAccount.endDate
                                    ? dayjs(serviceAccount.endDate).format('M/D/YY')
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/services/edit/${serviceAccount.externalId}`}>
                                    <FaPenToSquare
                                        className="text-gray-400 text-lg mr-6 inline"
                                        title="Edit Account"
                                    />
                                </Link>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        handleClickDelete(e, serviceAccount)
                                    }}
                                >
                                    <FaTrashCan
                                        className="text-gray-400 text-lg inline"
                                        title="Remove Account"
                                    />
                                </Link>
                            </Table.Cell>
                        </Table.Row>
                      ))
                  }
              </Table.Body>
          </Table>
      </div>
  </div>
  );
}
