import { useEffect, useState } from "react";
import { fetchBookingHistory, cancelBooking } from "../services/api";
import {
    Container, Card, Button, Alert, Spinner, Badge, Row, Col
} from "react-bootstrap";

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

    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const now = new Date();

    const upcomingBookings = bookings
        .filter(b => new Date(b.showtime?.showtime) > now)
        .sort((a, b) => new Date(a.showtime?.showtime) - new Date(b.showtime?.showtime));

    const pastBookings = bookings
        .filter(b => new Date(b.showtime?.showtime) <= now)
        .sort((a, b) => new Date(b.showtime?.showtime) - new Date(a.showtime?.showtime));

    const renderBookingCard = (booking) => (
        <Col key={booking._id} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
                <Card.Body>
                    <Card.Title className="mb-2">🎭 Showtime</Card.Title>
                    <Card.Text className="text-muted">
                        {booking.showtime?.showtime
                            ? formatDateTime(booking.showtime.showtime)
                            : "Invalid Date"}
                    </Card.Text>

                    <Card.Text>
                        <strong>🎬 Movie:</strong>{" "}
                        {booking.showtime?.movie?.title || "Untitled"}
                    </Card.Text>

                    <hr />

                    <Card.Text>
                        <strong>🎟️ Seats:</strong>{" "}
                        {booking.seats.map((seat, idx) => (
                            <Badge key={idx} bg="info" className="me-1">
                                {seat.number}
                            </Badge>
                        ))}
                    </Card.Text>

                    <Card.Text>
                        <strong>💳 Payment:</strong>{" "}
                        <Badge bg={booking.paymentStatus === "paid" ? "success" : "danger"}>
                            {booking.paymentStatus.toUpperCase()}
                        </Badge>
                    </Card.Text>

                    {booking.canceled ? (
                        <Badge bg="secondary" className="mt-2">❌ Cancelled</Badge>
                    ) : (
                        <Button
                            variant="outline-danger"
                            size="sm"
                            className="mt-2"
                            onClick={() => handleCancel(booking._id)}
                        >
                            Cancel Booking
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary mb-4">📅 Your Booking History</h2>

            {loading ? (
                <div className="text-center mt-4">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">{error}</Alert>
            ) : bookings.length === 0 ? (
                <Alert variant="warning" className="text-center">
                    😕 No bookings found.
                </Alert>
            ) : (
                <>
                    <h4 className="text-success mt-4">✅ Upcoming Bookings</h4>
                    {upcomingBookings.length === 0 ? (
                        <Alert variant="light">No upcoming bookings.</Alert>
                    ) : (
                        <Row>{upcomingBookings.map(renderBookingCard)}</Row>
                    )}

                    <h4 className="text-muted mt-5">📁 Past Bookings</h4>
                    {pastBookings.length === 0 ? (
                        <Alert variant="light">No past bookings.</Alert>
                    ) : (
                        <Row>{pastBookings.map(renderBookingCard)}</Row>
                    )}
                </>
            )}
        </Container>
    );
};

export default BookingHistoryPage;
