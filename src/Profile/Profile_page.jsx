import React from 'react';
import Hero from './Hero';
import Navbar from '../Navbar';

function Profile_page() {
    return ( 
    // Set the light emerald background for the whole page
    <div className="bg-emerald-50 min-h-screen">
        <Navbar />
        <Hero />
    </div> 
    );
}

export default Profile_page;
