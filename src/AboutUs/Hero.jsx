import React from 'react';

// This is the hero section specific to the About Us page,
// now styled to match your generic Hero component's theme.
const AboutHero = () => {
    return (
        // 1. Using the outer wrapper styles from Hero:
        // (font, background gradient, text color, shadow)
        <div className="font-poppins bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md">
            
            {/* 2. Using the inner layout styles from Hero: */}
            {/* (max-width, padding, text-center) */}
            <div className="max-w-7xl mx-auto py-20 px-4 text-center">

                {/* 3. Using the H1 styles from Hero */}
                <h1 className="text-5xl font-bold mb-3">
                    About Relayy
                </h1>
                
                {/* 4. Using the P styles from Hero */}
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    The story behind "The story of stuff. Relayed."
                </p>

            </div>
        </div>
    );
};

export default AboutHero;