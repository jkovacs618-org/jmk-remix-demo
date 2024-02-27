import { Table } from "flowbite-react";
import { Person } from '~/interfaces/interfaces';
import { Link, useSubmit } from "@remix-run/react";
import dayjs from "dayjs";
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6';
import { AuthUser } from "~/interfaces/Auth";

export default function PersonsList({ persons, authUser, selfPerson }: {persons: Person[], authUser: AuthUser, selfPerson: Person}) {

  const getRelationship = (person: Person, selfPerson: Person): string => {
      const person2Relationship = person.personRelatioships2?.find((pr) => pr.person1Id === selfPerson.id && pr.deleted === false)
      const type = person2Relationship ? person2Relationship.type : null

      const relationship =
          type === 'Child'
              ? person.gender === 'Male'
                  ? 'Son'
                  : 'Daughter'
              : type === 'Parent'
                ? person.gender === 'Male'
                    ? 'Father'
                    : 'Mother'
                : type
                  ? type
                  : '-'
      return relationship
  };

  // Programmatic Delete: behind-the-scenes submission, and Redirect back to same page:
  const submit = useSubmit();

  const handleClickDelete = (e: React.MouseEvent, person: Person) => {
      e.preventDefault()
      const personExternalId = person.externalId
      const fullName = person.nameFirst + (person.nameMiddle && ' ') + person.nameMiddle + ' ' + person.nameLast
      if (personExternalId !== '') {
          if (authUser?.personExternalId == personExternalId) {
              alert('Cannot Remove Self')
          } else {
              if (confirm(`Are you sure you want to remove ${fullName}?`)) {
                  submit(null, {method: 'delete', action: `/family/person/edit/${personExternalId}`});
              }
          }
      }
  };

  return (
    <div className="mt-3 mb-10">
      <div className="overflow-x-auto">
          <Table striped className="text-left">
              <Table.Head>
                  <Table.HeadCell className="py-3">Name</Table.HeadCell>
                  <Table.HeadCell>Relationship</Table.HeadCell>
                  <Table.HeadCell>Gender</Table.HeadCell>
                  <Table.HeadCell>Birth Date</Table.HeadCell>
                  <Table.HeadCell>
                      <span className="sr-only">Actions</span>
                  </Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y">
                  {persons.map((person: Person) => (
                        <Table.Row
                            key={person.externalId}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800"
                        >
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white py-2">
                                <Link to={`/family/person/edit/${person.externalId}`}>
                                    {person.nameFirst} {person.nameMiddle}{' '}
                                    {person.nameLast}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{
                              // person.personRelatioships2.map((pr) => (pr.type))
                              getRelationship(person, selfPerson)
                            }</Table.Cell>
                            <Table.Cell>
                                {person.gender ? person.gender : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                {person.birthDate
                                    ? dayjs(person.birthDate).format('M/DD/YYYY')
                                    : '-'}
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={`/family/person/edit/${person.externalId}`}>
                                    <FaPenToSquare
                                        className="text-gray-400 text-lg mr-6 inline"
                                        title="Edit Person"
                                    />
                                </Link>
                                <Link
                                    to="#"
                                    onClick={(e) => {
                                        handleClickDelete(e, person)
                                    }}
                                    title={
                                        person.externalId === authUser?.personExternalId
                                            ? 'Cannot Remove Self'
                                            : 'Remove Person: ' + person.externalId
                                    }
                                >
                                    <FaTrashCan
                                        className={
                                            'text-lg inline ' +
                                            (person.externalId ===
                                            authUser?.personExternalId
                                                ? 'text-gray-200'
                                                : 'text-gray-400')
                                        }
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
