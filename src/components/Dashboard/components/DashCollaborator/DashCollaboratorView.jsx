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
import Client, { PluginMeta } from '@fnndsc/chrisstoreapi';
import { PlusCircleIcon } from '@patternfly/react-icons';
import BrainyTeammatesPointer from '../../../../assets/img/brainy_teammates-pointer.png';
import ChrisStore from '../../../../store/ChrisStore';
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
    const storeURL = process.env.REACT_APP_STORE_URL;
    const auth = { token: props.store.get('authToken') };
    this.client = new Client(storeURL, auth);
    

  }

  async componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    const { pluginName } = this.props.match.params;
    try {
      const pluginMeta = await this.fetchPluginMeta(pluginName);
       alert(pluginMeta)
      const collaboratorList = await this.fetchPluginCollaborators(pluginMeta);
      alert(collaboratorList)
     
    

     
      if (this.isLoggedIn())
       

      this.setState({
        loading: false,
        pluginData: {
          ...pluginMeta.data,
          collaboratorList,},
          collaborators:[...collaboratorList]
       
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
   async fetchPluginMeta(pluginName) {
    const metas = await this.client.getPluginMetas({ name_exact: pluginName, limit: 1 });
    return metas.getItems().shift();
  }
  async fetchPluginCollaborators(pluginMeta) {
    const collaborators = (await pluginMeta.getCollaborators()).getItems();
   	return collaborators.map((collaborator, index) => collaborators[index].data.username)
  
   ;
  }
   

  render() {
   
    const { rows, columns,errors,pluginData,collaborators  } = this.state;
    const showEmptyState = isEmpty(errors);
    

    return (
   
  
      <Grid>
       <div>
                 
                 
                 
                  <h4>{collaborators.</h4>
                  
                  {collaborators.map((value,index) => (
                    <a key={collaborator.id} href={`#${collaborator.username}`}>
                          <li> {value}</li>
                    </a>
                  ))}
                
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
<h4>{collaborators}</h4>
                  
                  {collaborators.map((collaborator,index) => (
                    <a key={collaborator.id} href={`#${collaborator.username}`}>
                          <li> {collaborator.username}</li>
                    </a>
                  ))}
            </CardFooter>
            )}
          </Card>
        </GridItem>
      </Grid>
    );
  }
}




DashCollaboratorView.propTypes = {
  store: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      plugin: PropTypes.string,
    })
  })
};

DashCollaboratorView.defaultProps = {
  store: new Map(),
  match: {
    params: {
      plugin: undefined,
    }
  }
};

export default ChrisStore.withStore(DashCollaboratorView);
