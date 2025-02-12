import { useState, useEffect } from "react";
import { fetchSeats, bookSeats } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Spinner } from "react-bootstrap";

const SeatSelection = ({ showtimeId }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    return (
        <Container className="mt-4">
            <h2 className="text-center text-primary">Select Your Seats</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Seat Grid */}
            <Row className="justify-content-center mt-3">
                {seats.map((seat) => (
                    <Col xs={2} md={1} key={seat} className="mb-2">
                        <Button
                            variant={selectedSeats.includes(seat) ? "success" : "secondary"}
                            onClick={() => toggleSeatSelection(seat)}
                            className="w-100"
                        >
                            {seat}
                        </Button>
                    </Col>
                ))}
            </Row>

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
