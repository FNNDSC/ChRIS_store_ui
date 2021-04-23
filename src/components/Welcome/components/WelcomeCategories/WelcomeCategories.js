import React, { useState } from "react";
import sampleCategories from "./sampleCategories";
import styles from "./welcomeCategories.module.css";
import WelcomeCategory from "../WelcomeCategory/WelcomeCategory";

const WelcomeCategories = () => {
  const [categories, setCategories] = useState(sampleCategories);

  return (
    <div className={styles['welcome-categories']}>
      <div className={styles['welcome-categories-header']}>
        Browse our catalog of tools ready to deploy to ChRIS
      </div>
      <div className={styles['welcome-categories-container']}>
        {categories.map((category) => (
          <WelcomeCategory category={category} key={category.name} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeCategories;
