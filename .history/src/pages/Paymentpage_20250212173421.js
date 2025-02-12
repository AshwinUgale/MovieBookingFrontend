import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPayment } from "../services/api";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap"; // ✅ Import Bootstrap components

const PaymentPage = () => {
    const { bookingId } = useParams();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handlePayment = async () => {
        setLoading(true);
        try {
            await mockPayment(bookingId);
            setMessage("✅ Payment successful!");
            setTimeout(() => navigate("/bookings"), 2000); // Redirect after 2 sec
        } catch (error) {
            setMessage("❌ Payment failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow" style={{ width: "400px" }}>
                <h2 className="text-center text-primary">💳 Confirm Payment</h2>
                <p className="text-center text-muted">Booking ID: <strong>{bookingId}</strong></p>

                {message && <Alert variant={message.includes("failed") ? "danger" : "success"}>{message}</Alert>}

                <div className="text-center mt-3">
                    <Button 
                        variant="success" 
                        className="w-100"
                        onClick={handlePayment} 
                        disabled={loading}
                    >
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : "Pay Now"}
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default PaymentPage;
