import { useState, useEffect } from "react";
import { fetchSeats, bookSeats } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Spinner, Card, Badge } from "react-bootstrap";

const SeatSelection = ({ showtimeId }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Seat Pricing
    const seatPrices = {
        VIP: 20,        // VIP seats
        Standard: 15,   // Standard seats
        Economy: 10     // Economy seats
    };

    useEffect(() => {
        const loadSeats = async () => {
            try {
                const availableSeats = await fetchSeats(showtimeId);
                setSeats(availableSeats);
            } catch (error) {
                setError("Failed to fetch seats.");
            }
        };
        loadSeats();
    }, [showtimeId]);

    const toggleSeatSelection = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        setLoading(true);
        try {
            const response = await bookSeats(showtimeId, selectedSeats);
            alert("Booking confirmed! Proceeding to payment...");
            setSelectedSeats([]);
            navigate(`/payment/${response.booking._id}`);
        } catch (error) {
            setError("Booking failed. Please try again.");
        }
        setLoading(false);
    };

    // Calculate total price
    const totalPrice = selectedSeats.reduce((total, seat) => total + seatPrices[seat.type], 0);

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">🎭 Select Your Seats</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Screen View */}
            <div className="text-center my-3">
                <Card className="bg-dark text-white p-2">
                    <h5 className="mb-0">🎬 SCREEN 🎬</h5>
                </Card>
            </div>

            {/* Seat Grid */}
            <Row className="justify-content-center mt-3">
                {seats.map((seat) => (
                    <Col xs={2} md={1} key={seat.id} className="mb-2 text-center">
                        <Button
                            variant={selectedSeats.includes(seat) ? "success" : seat.booked ? "danger" : "secondary"}
                            onClick={() => !seat.booked && toggleSeatSelection(seat)}
                            className="w-100 seat-btn"
                            disabled={seat.booked}
                        >
                            {seat.number}
                            <Badge bg="light" text="dark" className="d-block mt-1">
                                {seat.type} ${seatPrices[seat.type]}
                            </Badge>
                        </Button>
                    </Col>
                ))}
            </Row>

            {/* Booking Summary */}
            <Card className="mt-4 p-3 shadow-sm">
                <h5 className="text-center">🎟️ Booking Summary</h5>
                <p className="text-muted">
                    {selectedSeats.length > 0 ? (
                        <>
                            Selected Seats: <strong>{selectedSeats.map((seat) => seat.number).join(", ")}</strong>
                            <br />
                            Total Price: <strong>${totalPrice}</strong>
                        </>
                    ) : (
                        "No seats selected."
                    )}
                </p>
            </Card>

            {/* Booking Button */}
            <div className="text-center mt-4">
                <Button 
                    variant="primary" 
                    onClick={handleBooking} 
                    disabled={loading || selectedSeats.length === 0}
                >
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : "Confirm Booking"}
                </Button>
            </div>
        </Container>
    );
};

export default SeatSelection;
