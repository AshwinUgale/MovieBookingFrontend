import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPayment } from "../services/api";

const PaymentPage = () => {
    const { bookingId } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        try {
            const response = await mockPayment(bookingId);
            setMessage("Payment successful!");
            setTimeout(() => navigate("/bookings"), 2000); // Redirect after 2 sec
        } catch (error) {
            setMessage("Payment failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Confirm Payment</h2>
            <p>Booking ID: {bookingId}</p>
            {message && <p style={{ color: message.includes("failed") ? "red" : "green" }}>{message}</p>}
            <button onClick={handlePayment} disabled={loading}>
                {loading ? "Processing Payment..." : "Pay Now"}
            </button>
        </div>
    );
};

export default PaymentPage;
