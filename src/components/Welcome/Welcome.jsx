import React from 'react';
import WelcomeCTA from './components/WelcomeCTA/WelcomeCTA';
import WelcomeCategories from './components/WelcomeCategories/WelcomeCategories';
import WelcomeChRIS from './components/WelcomeChRIS/WelcomeChRIS';
import WelcomeDevelopers from './components/WelcomeDevelopers/WelcomeDevelopers';

const Welcome = () => (
  <div>
    <WelcomeCTA />
    <WelcomeCategories />
    <WelcomeChRIS />
    <WelcomeDevelopers />
  </div>
);

export default Welcome;
