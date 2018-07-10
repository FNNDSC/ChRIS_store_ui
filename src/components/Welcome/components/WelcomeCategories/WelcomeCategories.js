import React, { Component } from 'react';
import sampleCategories from './sampleCategories';
import './welcomeCategories.css';

import WelcomeCategory from '../WelcomeCategory/WelcomeCategory';

class WelcomeCategories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: sampleCategories,
    };
  }

  render() {
    return (
      <div className="welcome-categories">
        <div className="welcome-categories-header">Browse our catalog of tools ready to deploy to ChRIS</div>
        <div className="welcome-categories-container">
          {
            this.state.categories.map(category => (
              <WelcomeCategory category={category} key={category.name} />
            ))
          }
        </div>
      </div>
    );
  }
}

export default WelcomeCategories;
