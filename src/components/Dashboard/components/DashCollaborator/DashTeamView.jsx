import React from 'react'
import {Grid,GridItem,
} from '@patternfly/react-core';

const UserTable = props => (
<Grid>
 <GridItem sm={12}>

 <table
  className="pf-c-table pf-m-grid-md"

>
  <thead>
    <tr>
      <th>Usename</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>
  </thead>

  <tbody>
   {props.collaborators.length > 0 ? (
        // eslint-disable-next-line react/destructuring-assignment
        props.collaborators.map( collaborator => (
          <tr key={ collaborator.data.id}>

            <td>{collaborator.data.username}</td>
            <td>{collaborator.data.role==='O'? 'Owner' :'Maintainer'}</td>

          </tr>
        ))
      ):


  (
        <tr>
          <td colSpan={3}>Add more collaborators</td>
        </tr>
      )}
    </tbody>
  </table>
  </GridItem>
      </Grid>
)

export default UserTable
