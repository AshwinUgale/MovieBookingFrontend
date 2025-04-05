import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { getSeats, bookSeats } from "../services/api";

const SeatSelection = ({ showtimeId }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSeats();
    }, [showtimeId]);

    const fetchSeats = async () => {
        try {
            const data = await fetchSeats(showtimeId);
            setSeats(data);
        } catch (error) {
            console.error("Error fetching seats:", error);
            setError("Failed to load seats. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSeatClick = (seat) => {
        if (seat.status === "booked") return;

        setSelectedSeats((prev) => {
            const isSelected = prev.some((s) => s.id === seat.id);
            if (isSelected) {
                return prev.filter((s) => s.id !== seat.id);
            } else {
                return [...prev, seat];
            }
        });
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }

        setLoading(true);

        try {
            // Clean the seat data before sending to API
            const sanitizedSeats = selectedSeats.map(seat => ({
                id: seat.id,
                number: seat.number,
                price: 1
            }));

            console.log("📤 Sending cleaned seats:", sanitizedSeats);

            const response = await bookSeats(showtimeId, sanitizedSeats);
            
            // Store booking ID and redirect to PayPal
            if (response.paymentUrl) {
                console.log("💳 Redirecting to PayPal...");
                localStorage.setItem('currentBookingId', response.booking._id);
                window.location.href = response.paymentUrl;
            } else {
                throw new Error("Payment URL not received from server");
            }
        } catch (error) {
            console.error("🚨 Booking Error:", error);
            setError(error.response?.data?.message || "Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // 💰 Calculate total price
    const totalPrice = selectedSeats.reduce((total, seat) => total + (seat.price || 1), 0);

    // 📌 Group seats by row
    const groupedByRow = seats.reduce((acc, seat) => {
        const row = seat.number.charAt(0);
        if (!acc[row]) acc[row] = [];
        acc[row].push(seat);
        return acc;
    }, {});

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center mt-5">
                <div className="alert alert-danger">{error}</div>
                <Button variant="primary" onClick={fetchSeats}>
                    Try Again
                </Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">🎬 Select Your Seats</h2>

            {/* Screen */}
            <div className="screen mb-4 p-3 bg-light text-center rounded">
                <h5>SCREEN</h5>
            </div>

            {/* Seat Legend */}
            <div className="seat-legend mb-4">
                <div className="d-flex justify-content-center gap-4">
                    <div>
                        <div className="seat available"></div>
                        <span>Available</span>
                    </div>
                    <div>
                        <div className="seat selected"></div>
                        <span>Selected</span>
                    </div>
                    <div>
                        <div className="seat booked"></div>
                        <span>Booked</span>
                    </div>
                </div>
            </div>

            {/* Seats Grid */}
            <div className="seats-container">
                {Object.entries(groupedByRow).map(([row, rowSeats]) => (
                    <Row key={row} className="mb-3">
                        <Col className="text-center">
                            <strong>Row {row}</strong>
                        </Col>
                        <Col>
                            <div className="d-flex justify-content-center gap-2">
                                {rowSeats.map((seat) => (
                                    <div
                                        key={seat.id}
                                        className={`seat ${seat.status} ${
                                            selectedSeats.some((s) => s.id === seat.id)
                                                ? "selected"
                                                : ""
                                        }`}
                                        onClick={() => handleSeatClick(seat)}
                                    >
                                        {seat.number.slice(1)}
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                ))}
            </div>

            {/* Booking Summary */}
            <Card className="mt-4 p-3 shadow-sm">
                <h5 className="text-center">🎟️ Booking Summary</h5>
                {selectedSeats.length > 0 ? (
                    <>
                        <p className="text-muted">
                            Selected Seats: <strong>{selectedSeats.map((seat) => seat.number).join(", ")}</strong><br />
                            Seat Price: <strong>${selectedSeats[0].price || 1}</strong><br />
                            Total Seats: <strong>{selectedSeats.length}</strong><br />
                            Total Price: <strong>${totalPrice}</strong>
                        </p>
                    </>
                ) : (
                    <p className="text-muted">No seats selected.</p>
                )}
            </Card>

            {/* Booking Button */}
            <div className="text-center mt-4">
                <Button
                    variant="primary"
                    onClick={handleBooking}
                    disabled={loading || selectedSeats.length === 0}
                >
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" /> Processing...
                        </>
                    ) : (
                        "Proceed to Payment"
                    )}
                </Button>
            </div>
        </Container>
    );
};

export default SeatSelection;