import React from 'react';

const features = [
  { title: "Seamless Data Sharing", description: "Easily share data across departments." },
  { title: "Unified Planning", description: "Collaborate on projects with a unified platform." },
  { title: "Efficient Project Management", description: "Track project progress and updates efficiently." }
];

const FeatureHighlights = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-20">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-12 text-sky-900">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-10">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
