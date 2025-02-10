import { useEffect, useState } from "react";
import { fetchBookingHistory, cancelBooking } from "../services/api";

const BookingHistoryPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchBookingHistory();
                setBookings(data);
            } catch (error) {
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await cancelBooking(bookingId);
            alert("Booking canceled successfully.");
            setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
        } catch (error) {
            alert("Failed to cancel booking.");
        }
    };

    if (loading) return <p>Loading bookings...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Your Booking History</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking._id}>
                            <strong>Showtime:</strong> {new Date(booking.showtime).toLocaleString()} <br />
                            <strong>Seats:</strong> {booking.seats.join(", ")} <br />
                            <strong>Status:</strong> {booking.paymentStatus} <br />
                            {!booking.canceled && (
                                <button onClick={() => handleCancel(booking._id)}>Cancel Booking</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default BookingHistoryPage;
