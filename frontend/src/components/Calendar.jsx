import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Calendar = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch items and create calendar events
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/items', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { limit: 1000 } // Get all items for calendar
      });
      console.log(response)
      const calendarEvents = response.data.items.map(item => {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(deliveryDate.getDate() + (item.leadTime || 7));
        return {
          id: item._id,
          title: `${item.name} - Delivery`,
          start: deliveryDate.toISOString().split('T')[0],
          extendedProps: {
            item: item,
            deliveryDate: deliveryDate,
            leadTime: item.leadTime,
            supplier: item.supplier?.name || 'N/A'
          }
        };
      });

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Failed to fetch items for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [user.token]);

  const handleEventClick = (clickInfo) => {
    setSelectedItem(clickInfo.event.extendedProps.item);
  };

  const handleDateClick = (dateClickInfo) => {
    const clickedDate = dateClickInfo.dateStr;
    const today = new Date();
    const clickedDateObj = new Date(clickedDate);
    
    // Find items that would be delivered on this date
    const itemsForDate = events
      .filter(event => event.start === clickedDate)
      .map(event => event.extendedProps.item);
    
    if (itemsForDate.length > 0) {
      setSelectedItem({
        deliveryDate: clickedDate,
        items: itemsForDate
      });
    }
  };

  const renderEventContent = (eventInfo) => {
    const item = eventInfo.event.extendedProps.item;
    return (
      <div className="p-1">
        <div className="font-medium text-sm truncate">
          {item.name}
        </div>
        <div className="text-xs opacity-75">
          Lead Time: {item.leadTime} days
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 shadow-md rounded">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Calendar</h2>
        <p className="text-gray-600">
          View scheduled deliveries based on item lead times.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading calendar...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            eventContent={renderEventContent}
            height="auto"
            dayMaxEvents={3}
            moreLinkClick="popover"
            eventDisplay="block"
            weekends={true}
            selectable={true}
            selectMirror={true}
            dayMaxEventRows={true}
            eventOverlap={false}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
              startTime: '08:00',
              endTime: '18:00',
            }}
          />

          {/* Item Details Modal */}
          {selectedItem && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Item Details</h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {selectedItem.items ? (
                  // Multiple items for a date
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Items scheduled for delivery on {selectedItem.deliveryDate}:
                    </p>
                    {selectedItem.items.map((item, index) => (
                      <div key={index} className="border-b pb-2 mb-2 last:border-b-0">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          Supplier: {item.supplier?.name || 'N/A'} | 
                          Lead Time: {item.leadTime} days
                        </div>
                        <div className="text-sm text-gray-600">
                          Stock: {item.quantity} / {item.reorderLevel}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single item details
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Name:</span> {selectedItem.name}
                    </div>
                    <div>
                      <span className="font-medium">Current Stock:</span> {selectedItem.quantity} {selectedItem.unit}
                    </div>
                    <div>
                      <span className="font-medium">Reorder Level:</span> {selectedItem.reorderLevel} {selectedItem.unit}
                    </div>
                    <div>
                      <span className="font-medium">Lead Time:</span> {selectedItem.leadTime} days
                    </div>
                    <div>
                      <span className="font-medium">Supplier:</span> {selectedItem.supplier?.name || 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Expected Delivery:</span> {selectedItem.extendedProps?.deliveryDate?.toLocaleDateString() || 'N/A'}
                    </div>
                    <div className="pt-2">
                      {/* Removed stock status badge for calendar modal */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
