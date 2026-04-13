import React from 'react';
import AboutHero from './Hero';
import OurMission from './OurMission';
import MeetTheTeam from './MeetTheTeam';
import Navbar from '../Navbar';

const AboutUsPage = () => {
  return (
    <div className="font-display min-h-screen bg-white">

      <main>
      <Navbar />
        <AboutHero />
        <OurMission />
        <MeetTheTeam />
      </main>
    </div>
  );
};

export default AboutUsPage;