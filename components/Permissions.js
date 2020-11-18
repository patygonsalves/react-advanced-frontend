import React, { useState } from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import Table from './styles/Table'
import SickButton from './styles/SickButton'
import Error from './ErrorMessage'

const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId){
      id,
      permissions
      name
      email
    }
  }
`

const possiblePermission = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const Permissions = (props) => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermission.map(p => <th key={p}>{p}</th>)}
                <th>+</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => <UserPermissions key={u.id} user={u} />)}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
)

function UserPermissions({
  user
}) {

  const [permission, setPermission] = useState(user.permissions)

  const handlePermissionChange = e => {
    const checkbox = e.target

    let updatePermissions = [...permission]
    if(checkbox.checked) {
      updatePermissions.push(checkbox.value)
    } else {
      updatePermissions = updatePermissions.filter(u => u !== checkbox.value)
    }

    setPermission(updatePermissions)
  }

  return(
    <Mutation
      mutation={UPDATE_PERMISSIONS_MUTATION}
      variables={{
        permissions: permission,
        userId: user.id,
      }}
    >
      {(updatePermissions, { loading, error }) => (
        <>
          {error && <tr><td colspan='8'><Error error={error} /></td></tr>}
          <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {possiblePermission.map(p => (
              <td key={p}>
                <label htmlFor={`${user.id}-permission-${p}`}>
                  <input
                    id={`${user.id}-permission-${p}`}
                    type='checkbox'
                    checked={permission.includes(p)}
                    value={p}
                    onChange={handlePermissionChange}
                  />
                </label>
              </td>
            ))}
            <td>
              <SickButton
                type='button'
                disabled={loading}
                onClick={updatePermissions}
              >
                Updat{loading ? 'ing' : 'e'}
              </SickButton>
            </td>
        </tr>
       </>
      )}
    </Mutation>
  )
}

UserPermissions.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    id: PropTypes.string,
    permissions: PropTypes.array,
  }).isRequired
}

export default Permissions