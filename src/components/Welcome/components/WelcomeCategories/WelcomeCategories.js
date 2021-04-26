import React, { useState } from "react";
import sampleCategories from "./sampleCategories";
import "./welcomeCategories.css";
import WelcomeCategory from "../WelcomeCategory/WelcomeCategory";

const WelcomeCategories = () => {
  const [categories, setCategories] = useState(sampleCategories);

  return (
    <div className="welcome-categories">
      <div className="welcome-categories-header">
        Browse our catalog of tools ready to deploy to ChRIS
      </div>
      <div className="welcome-categories-container">
        {categories.map((category) => (
          <WelcomeCategory category={category} key={category.name} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeCategories;