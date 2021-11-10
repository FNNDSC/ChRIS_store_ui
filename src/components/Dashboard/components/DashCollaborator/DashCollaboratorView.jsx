/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';

import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types'
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
import Client from '@fnndsc/chrisstoreapi';
import BrainyTeammatesPointer from '../../../../assets/img/brainy_teammates-pointer.png';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ChrisStore from '../../../../store/ChrisStore';
import './DashCollaboratorView.css';
import UserTable from './DashTeamView';

class DashCollaboratorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collaborators: [],
      errors: [],
      
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
      const collaboratorList = await this.fetchPluginCollaborators(pluginMeta);
      
    	
    this.setState({
          collaborators:[...collaboratorList]
       
      });
    } catch (error) {
      this.setState((prev) => ({
        loading: false,
        errors: [...prev.errors, error]
      }));
    }
  }

  showNotifications = (error) => {
    this.setState((prev) => ({
      errors: [...prev.errors, error]
    }));
  }
 // eslint-disable-next-line react/destructuring-assignment

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

// eslint-disable-next-line class-methods-use-this
  async fetchPluginCollaborators(pluginMeta) {
    const collabitems = (await pluginMeta.getCollaborators()).getItems();
    const collablist= await collabitems.map((collaborator, index) => collabitems[index].data)
    const collaboratorlist=await collablist.map((collaborator, index) => collabitems[index])
    return Array.from(collaboratorlist.values())

   ;
  }
 
  render() {
   
    const {collaborators } = this.state;
    
    return (
    <Grid>
     <div >
    <h4>
      In this area, you will be able to add and manage collaborators to help you
      with each plugin.
    </h4>
    <img style={{ marginLeft: '2em' }} src={BrainyTeammatesPointer} alt="Click Add Collborators" />
  </div>
   <GridItem sm={12}>
  
          <Card>
            <CardTitle>Collaborators</CardTitle>
            
            
                  
                  
            <CardBody>
            <UserTable collaborators={collaborators} />
            </CardBody>
            
          
            
          </Card>
          
          
        </GridItem>
		
      </Grid>
      
    );
  }
}



 


export default ChrisStore.withStore(DashCollaboratorView);
