import React, { useEffect } from 'react';

const RhStats = ({employers = 0, department = 0}) => {
  const stats = [
    { title: "Nonbres des employés", value: employers, change: "+5%", trend: 'up' },
    { title: "Nombres du départements", value: department, change: "0%", trend: 'stable' },
    { title: "Congés ce mois", value: "18", change: "-2%", trend: 'down' },
    { title: "Formations en cours", value: "7", change: "+3%", trend: 'up' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          <div className={`flex items-center mt-2 ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
            {stat.trend === 'up' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : stat.trend === 'down' ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            <span className="ml-1 text-sm">{stat.change}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RhStats;