import React from 'react'
import {Grid,GridItem,
} from '@patternfly/react-core';

const UserTable = props => (
<Grid>
 <GridItem sm={12}>
 
 <table
  class="pf-c-table pf-m-grid-md"
  role="grid"
>
  <thead>
    <tr role="row">
      <th>Usename</th>
        <th>Role</th>
        <th>Actions</th>
    </tr>
  </thead>

  <tbody role="rowgroup">
   {props.collaborators.length > 0 ? (
        props. collaborators.map( collaborator => (
          <tr key={ collaborator.id}>
            <td>{collaborator.data.username}</td>
            <td>{collaborator.data.role}</td>
            
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
