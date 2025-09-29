import React from 'react';
import Calendar from '../components/Calendar';

const CalendarPage = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Delivery Calendar</h1>
        <p className="text-gray-600">
          View and manage delivery schedules based on item lead times. 
          Click on events to see detailed information about items and their delivery dates.
        </p>
      </div>
      
      <Calendar />
    </div>
  );
};

export default CalendarPage;
