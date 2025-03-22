import { useEffect, useState } from "react";
import { fetchBookingHistory, cancelBooking } from "../services/api";
import { Container, Card, Button, ListGroup, Alert, Spinner } from "react-bootstrap"; // ✅ Bootstrap Components

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

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">📅 Your Booking History</h2>

            {loading ? (
                <div className="text-center mt-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{error}</Alert>
            ) : bookings.length === 0 ? (
                <Alert variant="warning" className="text-center">No bookings found.</Alert>
            ) : (
                <Card className="shadow-sm mt-3">
                    <ListGroup variant="flush">
                        {bookings.map((booking) => (
                            <ListGroup.Item key={booking._id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>🎭 Showtime:</strong> {booking.showtime?.showtime ? new Date(booking.showtime.showtime).toLocaleString() : "Invalid Date"} <br />
                                    <strong>🎟️ Seats:</strong> {booking.seats.map(seat => seat.number).join(", ")}
                                    <strong>💳 Status:</strong> 
                                    <span className={`ms-1 ${booking.paymentStatus === "paid" ? "text-success" : "text-danger"}`}>
                                        {booking.paymentStatus}
                                    </span>
                                </div>
                                {!booking.canceled && (
                                    <Button 
                                        variant="danger" 
                                        size="sm" 
                                        onClick={() => handleCancel(booking._id)}
                                    >
                                        ❌ Cancel
                                    </Button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
};

export default BookingHistoryPage;
