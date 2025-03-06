import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge, Alert, Spinner } from "react-bootstrap";

const FallbackSeatSelection = () => {
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Default Seat Data for Fallback
    const defaultSeats = [
        { id: "A1", number: "A1", type: "VIP", booked: false },
        { id: "A2", number: "A2", type: "VIP", booked: false },
        { id: "B1", number: "B1", type: "Standard", booked: false },
        { id: "B2", number: "B2", type: "Standard", booked: false },
        { id: "C1", number: "C1", type: "Economy", booked: false },
        { id: "C2", number: "C2", type: "Economy", booked: false },
    ];

    // Seat Pricing
    const seatPrices = { VIP: 20, Standard: 15, Economy: 10 };

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
        setTimeout(() => {
            alert("Mock booking confirmed! Proceeding to payment...");
            setSelectedSeats([]);
            navigate(`/payment/mock`);
            setLoading(false);
        }, 1500);
    };

    // Calculate total price
    const totalPrice = selectedSeats.reduce((total, seat) => total + seatPrices[seat.type], 0);

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">🎭 Select Your Seats</h2>
            
            {/* Screen View */}
            <div className="text-center my-3">
                <Card className="bg-dark text-white p-2">
                    <h5 className="mb-0">🎬 SCREEN 🎬</h5>
                </Card>
            </div>

            {/* Seat Grid */}
            <Row className="justify-content-center mt-3">
                {defaultSeats.map((seat) => (
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

export default FallbackSeatSelection;
