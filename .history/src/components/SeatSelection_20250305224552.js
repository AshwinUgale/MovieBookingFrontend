import { useState, useEffect } from "react";
import { fetchSeats, bookSeats } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Alert, Spinner, Card, Badge } from "react-bootstrap";
import "../styles/SeatSelection.css"; // Custom CSS for styling

const SeatSelection = ({ showtimeId }) => {
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Seat Pricing
    const seatPrices = {
        VIP: 30,
        Platinum: 25,
        Gold: 20,
        Silver: 15,
        Economy: 10
    };

    useEffect(() => {
        const loadSeats = async () => {
            try {
                const availableSeats = await fetchSeats(showtimeId);

                // If no seats are returned, generate default seats
                if (!availableSeats || availableSeats.length === 0) {
                    setSeats(generateSeats());
                } else {
                    setSeats(availableSeats);
                }
            } catch (error) {
                setError("Failed to fetch seats.");
                setSeats(generateSeats()); // Use default if API fails
            }
        };
        loadSeats();
    }, [showtimeId]);

    const generateSeats = () => {
        const sections = ["VIP", "Platinum", "Gold", "Silver", "Economy"];
        let generatedSeats = [];

        sections.forEach((section) => {
            for (let row = 1; row <= 8; row++) { // Increased rows for better layout
                for (let seat = 1; seat <= 20; seat++) { // More seats per row
                    generatedSeats.push({
                        id: `${section}-${row}-${seat}`,
                        number: `${section[0]}${row}${seat}`, // Format: V12, P32
                        type: section,
                        booked: Math.random() < 0.1 // 10% seats randomly booked
                    });
                }
            }
        });

        return generatedSeats;
    };

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

    // Organize seats into sections
    const groupedSeats = seats.reduce((acc, seat) => {
        if (!acc[seat.type]) acc[seat.type] = [];
        acc[seat.type].push(seat);
        return acc;
    }, {});

    return (
        <Container className="mt-4 seat-selection-container">
            <h2 className="text-center text-primary">🎭 Select Your Seats</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {/* Screen View */}
            <div className="text-center my-3">
                <Card className="bg-dark text-white p-3 screen-card">
                    <h5 className="mb-0">🎬 SCREEN 🎬</h5>
                    <p className="text-muted">All eyes this way please!</p>
                </Card>
            </div>

            {/* Seat Grid with Sections */}
            {Object.entries(groupedSeats).map(([section, seats]) => (
                <div key={section}>
                    <h5 className="text-center mt-3">{section} Section (${seatPrices[section]} per seat)</h5>
                    <div className="seat-grid">
                        {seats.map((seat) => (
                            <Button
                                key={seat.id}
                                className={`seat-btn ${selectedSeats.includes(seat) ? "selected" : seat.booked ? "booked" : "available"}`}
                                onClick={() => !seat.booked && toggleSeatSelection(seat)}
                                disabled={seat.booked}
                            >
                                {seat.number}
                            </Button>
                        ))}
                    </div>
                </div>
            ))}

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

            {/* Seat Legend */}
            <div className="text-center mt-4 seat-legend">
                <span className="legend-item"><span className="legend-box available"></span> Available</span>
                <span className="legend-item"><span className="legend-box selected"></span> Selected</span>
                <span className="legend-item"><span className="legend-box booked"></span> Sold</span>
            </div>
        </Container>
    );
};

export default SeatSelection;
