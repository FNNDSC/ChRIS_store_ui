import React from 'react';
import sampleCategories from './sampleCategories';
import './welcomeCategories.css';
import Category from '../WelcomeCategory/WelcomeCategory';

const WelcomeCategories = () => {
  const categories = sampleCategories ;

  return (
    <div className="welcome-categories">
      <div className="welcome-categories-header">
        <span className="tag">TOOLS</span><br/>
        <h1>Browse our Catalog of <br/> Tools ready to Deploy to ChRIS</h1>
        <p>
          ChRIS is an democratizing the development and usage of image processing
          <br/> software with an ecosystem following common standards.
        </p>
      </div>
      <div className="welcome-categories-container">
        {categories.map((category) => (
          <Category category={category} key={category.name} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeCategories;
