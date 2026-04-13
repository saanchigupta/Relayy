import React from 'react';

// This component contains the "Our Mission" text
const OurMission = () => {
    return (
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <div className="font-sans text-lg text-gray-700 leading-relaxed space-y-4">
              <p>
                Our journey began with a simple idea: campus life is full of stuff, and that stuff has a story. From textbooks passed down through semesters to dorm essentials finding a new home, every item has a journey.
              </p>
              <p>
                Relayy was born to connect these stories. We're a hyper-local marketplace exclusively for students, designed to make buying and selling pre-owned items safe, easy, and sustainable. We believe in reducing waste, saving money, and building a stronger campus community, one relayed item at a time.
              </p>
            </div>
          </div>
        </section>
    );
};

export default OurMission;