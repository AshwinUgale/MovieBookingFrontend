import { useState, useEffect } from "react";
import { fetchSeats, bookSeats } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Container, Button, Alert, Spinner, Card } from "react-bootstrap";
import "../styles/SeatSelection.css";

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
            } catch (err) {
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
            // Clean the seat data before sending to API
            const sanitizedSeats = selectedSeats.map(seat => ({
                id: seat.id,
                number: seat.number,
                price: 1
            }));
    
            console.log("📤 Sending cleaned seats:", sanitizedSeats);
            const response = await bookSeats(showtimeId, sanitizedSeats);
    
            // Check for approvalUrl (not paymentUrl)
            if (response.booking && response.approvalUrl) {
                console.log("💳 Redirecting to PayPal...");
                localStorage.setItem('currentBookingId', response.booking._id);
                // Add a timestamp for potential cleanup of old bookings
                localStorage.setItem('bookingTimestamp', Date.now());
                window.location.href = response.approvalUrl;
            } else {
                console.error("Invalid response:", response);
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

    return (
        <Container className="mt-4 seat-selection-container">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Legend */}
            <div className="text-center mt-4 seat-legend">
                <span className="legend-item"><span className="legend-box available" /> Available</span>
                <span className="legend-item"><span className="legend-box selected" /> Selected</span>
                <span className="legend-item"><span className="legend-box booked" /> Sold</span>
            </div>

            {/* Screen Label */}
            <div className="text-center my-3">
                <Card className="bg-dark text-white p-3 screen-card">
                    <h5 className="mb-0">🎬 SCREEN 🎬</h5>
                </Card>
            </div>

            {/* Seat Grid */}
            <div className="text-center mt-3">
                {Object.entries(groupedByRow)
                    .sort(([a], [b]) => a.localeCompare(b)) // Sort rows alphabetically
                    .map(([row, rowSeats]) => (
                        <div key={row} className="seat-row mb-2">
                            {rowSeats
                                .sort((a, b) => {
                                    const numA = parseInt(a.number.slice(row.length));
                                    const numB = parseInt(b.number.slice(row.length));
                                    return numA - numB;
                                })
                                .map((seat) => (
                                    <Button
                                        key={seat.id}
                                        className={`seat-btn mx-1 ${selectedSeats.includes(seat)
                                            ? "selected"
                                            : seat.booked
                                                ? "booked"
                                                : "available"}`}
                                        onClick={() => !seat.booked && toggleSeatSelection(seat)}
                                        disabled={seat.booked}
                                    >
                                        {seat.number}
                                    </Button>
                                ))}
                        </div>
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
                    {loading ? <Spinner as="span" animation="border" size="sm" /> : "Confirm Booking"}
                </Button>
            </div>
        </Container>
    );
};

export default SeatSelection;
