import { useState, useEffect } from "react";
import { fetchSeats, bookSeats } from "../services/api";
import { useNavigate } from "react-router-dom";

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
            setSuccessMessage(`Booking confirmed! Seats: ${selectedSeats.join(", ")}`);
            setSelectedSeats([]); // Clear selection after booking
        } catch (error) {
            setError("Booking failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Select Your Seats</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                {seats.map((seat) => (
                    <button
                        key={seat}
                        onClick={() => toggleSeatSelection(seat)}
                        style={{
                            padding: "10px",
                            backgroundColor: selectedSeats.includes(seat) ? "green" : "lightgray",
                            cursor: "pointer",
                        }}
                    >
                        {seat}
                    </button>
                ))}
            </div>
            <button onClick={handleBooking} disabled={loading} style={{ marginTop: "20px" }}>
                {loading ? "Booking..." : "Confirm Booking"}
            </button>
        </div>
    );
};

export default SeatSelection;
