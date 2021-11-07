import React, { Component } from 'react';

import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import {
  Table,
  TableHeader,
  TableBody,
  info,
} from '@patternfly/react-table';
import {
  CardTitle,
  CardBody,
  Card,
  CardFooter,
  Grid,
  GridItem,
  CardActions,
  Button,
} from '@patternfly/react-core';

import { PlusCircleIcon } from '@patternfly/react-icons';
import BrainyTeammatesPointer from '../../../../assets/img/brainy_teammates-pointer.png';
import './DashCollaboratorView.css';


const DashTeamEmptyState = () => (
  <div className="card-body-content-parent">
    <p>
      In this area, you will be able to add and manage coll to help you
      with each plugin.
    </p>
    <img style={{ marginLeft: '2em' }} src={BrainyTeammatesPointer} alt="Click Add Plugin" />
  </div>
);

class DashCollaboratorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      pluginData: undefined,
      errors: [],
      rows: [],
      columns: [
        {
          title: 'Name',
          property: 'name',
          
        },
        {
          title: 'Role',
          property: 'title',
          
        },
        {
          title: 'Date Joined',
          property: 'date_joined',
          transforms: [
            info({
              tooltip: 'More information about teammates',
            }),
           
          ],
        },
      ],
      
    };

    

  }

  async componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginName } = this.props.match.params;
    try {
      const pluginMeta = await this.fetchPluginMeta(pluginName);
       console.log(pluginMeta)
      const collaborators = await this.fetchPluginCollaborators(pluginMeta);
     console.log( collaborators)

     
      if (this.isLoggedIn())
       

      this.setState({
        loading: false,
       collaborators:[...collaborators],
       
      });
    } catch (error) {
      this.setState((prev) => ({
        loading: false,
        errors: [...prev.errors, error]
      }));
    }
  }
  
/**
  * Fetch all versions of a plugin.
  * @param {PluginMeta} pluginMeta
  * @returns {Promise<any[]>} Collaborators of the plugin
  */
  // eslint-disable-next-line class-methods-use-this
  async fetchPluginCollaborators(pluginMeta) {
    const collaborators = (await pluginMeta.getCollaborators()).getItems();
    return collaborators.map((collaborator, index) => collaborators[index].data);
  }
  

  render() {
   
    const { rows, columns,errors,collaborators } = this.state;
    const showEmptyState = isEmpty(collaborators);

    return (
   
  
      <Grid>
       <div className="plugin-body-detail-section">
                  <h4>Contributors</h4>
                  {collaborators.map((collaborator) => (
                    <a key={collaborator.id} href={`#${collaborator.username}`}>
                      <p> {collaborator.username}</p>
                    </a>
                  ))}<br />
                
                </div>
        <GridItem sm={12}>
          <Card>
            <CardTitle>Collaborators</CardTitle>
            <CardBody>
              {showEmptyState ? (
                <DashTeamEmptyState />
              ) : (
                <>
                  <Table
                    aria-label="Sortable Table"
                    cells={columns}
                    rows={rows}
                    actions={([
                      {
                        title: <a href="https://www.patternfly.org">Link action</a>,
                      },
                      {
                        title: 'Some action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Some action, on row: ', rowId);
                        },
                      },
                      {
                        title: 'Third action',
                        // eslint-disable-next-line no-unused-vars
                        onClick: (event, rowId, rowData, extra) => {
                          // console.log('clicked on Third action, on row: ', rowId);
                        },
                      },
                    ])}
                    areActionsDisabled={false}
                    dropdownPosition="left"
                    dropdownDirection="bottom"
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                </>
              )}
            </CardBody>
            {!showEmptyState && (
            <CardFooter
              className="card-footer"
            >
              <CardActions>
                <Button variant="secondary">
                  <PlusCircleIcon type="pf" style={{ margin: '0 1em 0 0' }} />
                  <span>Add Collaborator</span>
                </Button>
              </CardActions>

            </CardFooter>
            )}
          </Card>
        </GridItem>
      </Grid>
    );
  }
}




export default DashCollaboratorView;
