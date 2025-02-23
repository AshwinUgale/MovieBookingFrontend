import React, { useEffect, useState } from "react";
import { fetchEvents } from "../services/api";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEvents = async () => {
      const data = await fetchEvents();
      setEvents(data);
      setLoading(false);
    };

    getEvents();
  }, []);

  if (loading) {
    return <div className="text-center text-xl font-bold mt-10">Loading Events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-center mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="border rounded-lg shadow-md p-4">
              <img src={event.image} alt={event.name} className="w-full h-48 object-cover rounded" />
              <h3 className="text-lg font-semibold mt-2">{event.name}</h3>
              <p className="text-gray-600">{event.date}</p>
              <p className="text-sm text-gray-500">{event.venue}</p>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-blue-500 hover:underline"
              >
                View Details
              </a>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full">No events available.</p>
        )}
      </div>
    </div>
  );
};

export default Events;
