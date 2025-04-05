import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button, Spinner } from 'react-bootstrap';
import { verifyPayment, getPaymentStatus } from '../services/api';

const PaymentStatus = () => {
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPaymentStatus = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const bookingId = searchParams.get('bookingId') || localStorage.getItem('currentBookingId');
                const paymentId = searchParams.get('paymentId');
                const PayerID = searchParams.get('PayerID');

                if (!bookingId) {
                    setError('No booking ID found');
                    setStatus('error');
                    return;
                }

                if (paymentId && PayerID) {
                    // Verify the payment with PayPal
                    const verificationResult = await verifyPayment( paymentId, PayerID);
                    if (verificationResult.success) {
                        setStatus('success');
                        localStorage.removeItem('currentBookingId');
                    } else {
                        setError(verificationResult.message || 'Payment verification failed');
                        setStatus('error');
                    }
                } else {
                    // Check payment status
                    const paymentStatus = await getPaymentStatus(bookingId);
                    setStatus(paymentStatus.status.toLowerCase());
                    if (paymentStatus.status === 'error') {
                        setError(paymentStatus.message);
                    }
                }
            } catch (error) {
                console.error('Payment verification error:', error);
                setError(error.response?.data?.message || 'An error occurred while verifying payment');
                setStatus('error');
            }
        };

        verifyPaymentStatus();
    }, [location]);

    const handleViewBooking = () => {
        const searchParams = new URLSearchParams(location.search);
        const bookingId = searchParams.get('bookingId') || localStorage.getItem('currentBookingId');
        navigate(`/bookings/${bookingId}`);
    };

    if (status === 'loading') {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Card className="shadow-sm">
                <Card.Body className="text-center">
                    {status === 'success' && (
                        <>
                            <div className="mb-4">
                                <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h2 className="text-success mb-4">Payment Successful!</h2>
                            <p className="mb-4">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
                            <Button variant="success" onClick={handleViewBooking}>
                                View Booking Details
                            </Button>
                        </>
                    )}

                    {status === 'cancelled' && (
                        <>
                            <div className="mb-4">
                                <i className="fas fa-times-circle text-warning" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h2 className="text-warning mb-4">Payment Cancelled</h2>
                            <p className="mb-4">Your payment was cancelled. No charges were made.</p>
                            <Button variant="primary" onClick={() => navigate(-1)}>
                                Try Again
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="mb-4">
                                <i className="fas fa-exclamation-circle text-danger" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h2 className="text-danger mb-4">Payment Error</h2>
                            <Alert variant="danger">
                                {error || 'An error occurred during payment processing.'}
                            </Alert>
                            <Button variant="primary" onClick={() => navigate(-1)}>
                                Try Again
                            </Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default PaymentStatus;