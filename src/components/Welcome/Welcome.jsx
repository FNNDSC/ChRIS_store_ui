import React from 'react';
import WelcomeCTA from './components/WelcomeCTA/WelcomeCTA';
import WelcomeChRIS from './components/WelcomeChRIS/WelcomeChRIS';
import WelcomeCategories from './components/WelcomeCategories/WelcomeCategories';
import WelcomeDevelopers from './components/WelcomeDevelopers/WelcomeDevelopers';

const Welcome = () => (
  <div>
    <WelcomeCTA />
    <WelcomeChRIS />
    <WelcomeCategories />
    <WelcomeDevelopers />
  </div>
);

export default Welcome;
