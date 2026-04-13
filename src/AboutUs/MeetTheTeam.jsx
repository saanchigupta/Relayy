import React from 'react';
import { Linkedin, Github } from 'lucide-react';

import yajatImage from './yajat.jpg'; 
import aryanImage from './aryan.jpg'; 
import safalImage from './safal.jpg';
import saanchiImage from './saanchi.jpg';

// This component contains the 4-member team grid
const MeetTheTeam = () => {
    return (
        <section className="py-24 bg-emerald-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-display text-4xl font-bold text-center text-gray-900 mb-16">
              Meet the Team
            </h2>
            
            {/* 4-Member Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            
              {/* --- Team Member 1 --- */}
              <div className="text-center group">
                <img
                  className="w-48 h-48 rounded-full mx-auto mb-5 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  src={yajatImage}
                  alt="Team Member 1"
                />
                <h3 className="font-display text-2xl font-bold text-gray-900">Yajat Kumar Bharaj</h3>
                <p className=" text-md text-emerald-700 font-medium">AI/ML Model Specialist</p>
                <p className=" text-gray-600 text-sm mt-2">
                  Leads the development of our AI and machine learning models. Responsible for building and refining the price prediction system that delivers accurate valuations for all listed items.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <a href="https://www.linkedin.com/in/yajat-kumar-bharaj-6a6669295/" target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                  <a href="https://github.com/Sermystico" target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                </div>
              </div>

              {/* --- Team Member 2 --- */}
              <div className="text-center group">
                <img
                  className="w-48 h-48 rounded-full mx-auto mb-5 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  src={aryanImage}
                  alt="Team Member 2"
                />
                <h3 className="font-display text-2xl font-bold text-gray-900">Aryan Bansal</h3>
                <p className=" text-md text-emerald-700 font-medium">Full-Stack Developer</p>
                <p className=" text-gray-600 text-sm mt-2">
                  Focuses on designing and building the backend architecture of the platform. Ensures that all core systems run smoothly, securely, and efficiently, powering the application’s overall functionality.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <a href="https://www.linkedin.com/in/aryan-bansal-44a2a6260?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                  <a href="http://Github.com/aryanbansal-05" target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                </div>
              </div>

              {/* --- Team Member 3 --- */}
              <div className="text-center group">
                <img
                  className="w-48 h-48 rounded-full mx-auto mb-5 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  src={safalImage}
                  alt="Team Member 3"
                />
                <h3 className="font-display text-2xl font-bold text-gray-900">Safal Kaur</h3>
                <p className=" text-md text-emerald-700 font-medium">Full-Stack Developer</p>
                <p className=" text-gray-600 text-sm mt-2">
                  Specializes in crafting clean, responsive, and intuitive user interfaces. Transforms designs into seamless user experiences and ensures the platform looks and feels great across all devices.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <a href="https://www.linkedin.com/in/safal-kaur-67379727a?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                  <a href="https://github.com/safalkaur03" target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                </div>
              </div>

              {/* --- Team Member 4 --- */}
              <div className="text-center group">
                <img
                  className="w-48 h-48 rounded-full mx-auto mb-5 shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                  src={saanchiImage}
                  alt="Team Member 4"
                />
                <h3 className="font-display text-2xl font-bold text-gray-900">Saanchi Gupta</h3>
                <p className=" text-md text-emerald-700 font-medium">Chat System Engineer</p>
                <p className=" text-gray-600 text-sm mt-2">
                  Manages the real-time communication system powered by Socket.IO. Ensures fast, stable, and low-latency chat interactions, enabling users to communicate instantly and reliably.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <a href="https://www.linkedin.com/in/saanchi-gupta-9711942a8/" target="_blank" rel="noopener noreferrer"><Linkedin className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                  <a href="https://github.com/saanchigupta/" target="_blank" rel="noopener noreferrer"><Github className="w-5 h-5 text-gray-500 hover:text-emerald-600 transition-colors" /></a>
                </div>
              </div>

            </div>
          </div>
        </section>
    );
};

export default MeetTheTeam;