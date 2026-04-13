import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import Contact from './Contact';
import Faqs from './faqs';

function ContactPage() {
  return (
    <div className="font-poppins min-h-screen bg-white">
      <Navbar />
      <Hero 
        title="Get in Touch" 
        subtitle="Have questions or feedback? We'd love to hear from you." 
      />
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-2 w-full">
            <Contact />
          </div>
          <div className="lg:col-span-3 w-full">
            <Faqs />
          </div>

        </div>
      </main>
    </div>
  );
}

export default ContactPage;


