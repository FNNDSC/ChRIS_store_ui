import React, { Component } from 'react';
import { Button, CardGrid } from 'patternfly-react';
import './Dashboard.css';
import DashPluginCardView from './components/DashPluginCardView/DashPluginCardView';
import DashTeamView from './components/DashTeamView/DashTeamView';
import DashGitHubView from './components/DashGitHubView/DashGitHubView';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plugins: [],
    };
    this.addPlugin = this.addPlugin.bind(this);
    this.initialize = this.initialize.bind(this);
  }

  /**
   * Callback for Add Plugin
   */
  addPlugin() {
    const { showGrid } = this.state;

    this.setState({
      showGrid: !showGrid,
    });
  }

  initialize() {
    const { arePluginsAvailable } = this.state;

    this.setState({
      arePluginsAvailable: !arePluginsAvailable,
    });
  }

  render() {
    const { plugins } = this.state;
    return (
      <React.Fragment>
        <div className="plugins-stats">
          <div className="row plugins-stats-row">
            <div className="title-bar">Dashboard</div>
            <div className="dropdown btn-group">
              <Button bsStyle="primary" bsSize="large" href="/create">
                Add Plugin
              </Button>
            </div>
          </div>
        </div>
        <body className="cards-pf dashboard-body">
          <CardGrid>
            <div className="dashboard-row">
              <div className="dashboard-left-column">
                <DashPluginCardView plugins={plugins} />
                <DashTeamView plugins={plugins} />
              </div>
              <div className="dashboard-right-column">
                <DashGitHubView plugins={plugins} />
              </div>
            </div>
          </CardGrid>
        </body>
      </React.Fragment>
    );
  }
}

export default Dashboard;
