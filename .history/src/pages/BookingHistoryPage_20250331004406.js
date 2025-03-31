import { useEffect, useState } from "react";
import { fetchBookingHistory, cancelBooking } from "../services/api";
import { Container, Card, Button, Alert, Spinner, Badge, Row, Col, Form, InputGroup, Tabs, Tab, Accordion } from "react-bootstrap";
import { FaCalendarAlt, FaFilm, FaTicketAlt, FaCreditCard, FaBan, FaSearch, FaFilter } from "react-icons/fa";

const BookingHistoryPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [cancelInProgress, setCancelInProgress] = useState(null);

    useEffect(() => {
        const loadBookings = async () => {
            try {
                const data = await fetchBookingHistory();
                setBookings(data);
            } catch (error) {
                setError("Failed to load bookings.");
            } finally {
                setLoading(false);
            }
        };
        loadBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        setCancelInProgress(bookingId);
        try {
            await cancelBooking(bookingId);
            setBookings((prev) => 
                prev.map(booking => 
                    booking._id === bookingId 
                        ? {...booking, canceled: true}
                        : booking
                )
            );
        } catch (error) {
            alert("Failed to cancel booking.");
        } finally {
            setCancelInProgress(null);
        }
    };

    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const calculateStatus = (booking) => {
        if (booking.canceled) return "canceled";
        if (booking.paymentStatus !== "paid") return "pending";
        
        const showtimeDate = new Date(booking.showtime?.showtime);
        const now = new Date();
        
        if (showtimeDate < now) return "completed";
        return "upcoming";
    };

    const getStatusColor = (status) => {
        switch(status) {
            case "upcoming": return "success";
            case "completed": return "info";
            case "canceled": return "secondary";
            case "pending": return "warning";
            default: return "primary";
        }
    };

    const getFilteredBookings = () => {
        return bookings
            .filter(booking => {
                // Text search
                const movieTitle = booking.showtime?.movie?.title?.toLowerCase() || "";
                const searchLower = searchTerm.toLowerCase();
                if (searchTerm && !movieTitle.includes(searchLower)) {
                    return false;
                }
                
                // Status filter
                if (filterStatus !== "all") {
                    const status = calculateStatus(booking);
                    if (status !== filterStatus) {
                        return false;
                    }
                }
                
                return true;
            })
            .sort((a, b) => {
                const dateA = new Date(a.showtime?.showtime || 0);
                const dateB = new Date(b.showtime?.showtime || 0);
                return dateB - dateA; // Sort by date, most recent first
            });
    };

    const filteredBookings = getFilteredBookings();
    
    // Group bookings by month
    const groupedBookings = filteredBookings.reduce((groups, booking) => {
        const date = new Date(booking.showtime?.showtime || 0);
        const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        if (!groups[monthYear]) {
            groups[monthYear] = [];
        }
        groups[monthYear].push(booking);
        return groups;
    }, {});

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">
                <FaTicketAlt className="me-2" />
                Your Booking History
            </h2>

            {/* Search and filter controls */}
            {!loading && !error && bookings.length > 0 && (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Row>
                            <Col md={6} className="mb-3 mb-md-0">
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search by movie title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FaFilter />
                                    </InputGroup.Text>
                                    <Form.Select 
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                    >
                                        <option value="all">All Bookings</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="completed">Completed</option>
                                        <option value="canceled">Canceled</option>
                                        <option value="pending">Payment Pending</option>
                                    </Form.Select>
                                </InputGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {loading ? (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Loading your bookings...</p>
                </div>
            ) : error ? (
                <Alert variant="danger" className="text-center">
                    <FaBan className="me-2" />
                    {error}
                </Alert>
            ) : bookings.length === 0 ? (
                <div className="text-center my-5">
                    <Alert variant="warning" className="d-inline-block">
                        <h4>No bookings found</h4>
                        <p className="mb-0">You haven't made any bookings yet. Ready to watch a movie?</p>
                    </Alert>
                    <div className="mt-3">
                        <Button variant="primary" href="/movies">
                            Browse Movies
                        </Button>
                    </div>
                </div>
            ) : filteredBookings.length === 0 ? (
                <Alert variant="info" className="text-center">
                    No bookings match your search or filter criteria.
                </Alert>
            ) : (
                <div>
                    <p className="text-muted mb-4">
                        Showing {filteredBookings.length} of {bookings.length} bookings
                    </p>
                    
                    <Accordion defaultActiveKey="0" className="mb-4">
                        {Object.entries(groupedBookings).map(([monthYear, monthBookings], groupIndex) => (
                            <Accordion.Item key={monthYear} eventKey={String(groupIndex)}>
                                <Accordion.Header>
                                    <FaCalendarAlt className="me-2" />
                                    {monthYear} ({monthBookings.length} {monthBookings.length === 1 ? 'booking' : 'bookings'})
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Row>
                                        {monthBookings.map((booking) => {
                                            const status = calculateStatus(booking);
                                            const statusColor = getStatusColor(status);
                                            
                                            return (
                                                <Col key={booking._id} md={6} lg={4} className="mb-4">
                                                    <Card className="h-100 shadow-sm booking-card">
                                                        <Card.Header className="d-flex justify-content-between align-items-center">
                                                            <Badge bg={statusColor} className="px-3 py-2">
                                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                                            </Badge>
                                                            <small className="text-muted">
                                                                Booking #{booking._id.slice(-6)}
                                                            </small>
                                                        </Card.Header>
                                                        <Card.Body>
                                                            <Card.Title className="mb-3 d-flex align-items-center">
                                                                <FaFilm className="me-2 text-primary" />
                                                                {booking.showtime?.movie?.title || "Untitled"}
                                                            </Card.Title>
                                                            
                                                            <div className="mb-3">
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <FaCalendarAlt className="me-2 text-muted" />
                                                                    <span>
                                                                        {booking.showtime?.showtime 
                                                                            ? formatDateTime(booking.showtime.showtime) 
                                                                            : "Invalid Date"}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <FaTicketAlt className="me-2 text-muted" />
                                                                    <span>
                                                                        {booking.seats.length} {booking.seats.length === 1 ? 'seat' : 'seats'}:
                                                                        {' '}
                                                                        {booking.seats.map((seat) => seat.number).join(', ')}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="d-flex align-items-center">
                                                                    <FaCreditCard className="me-2 text-muted" />
                                                                    <Badge bg={booking.paymentStatus === "paid" ? "success" : "warning"}>
                                                                        {booking.paymentStatus.toUpperCase()}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="bg-white">
                                                            {booking.canceled ? (
                                                                <div className="text-center text-muted">
                                                                    <FaBan className="me-1" />
                                                                    This booking has been cancelled
                                                                </div>
                                                            ) : status === "upcoming" ? (
                                                                <Button 
                                                                    variant="outline-danger" 
                                                                    className="w-100"
                                                                    onClick={() => handleCancel(booking._id)}
                                                                    disabled={cancelInProgress === booking._id}
                                                                >
                                                                    {cancelInProgress === booking._id ? (
                                                                        <>
                                                                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                                            Cancelling...
                                                                        </>
                                                                    ) : (
                                                                        <>Cancel Booking</>
                                                                    )}
                                                                </Button>
                                                            ) : (
                                                                <Button 
                                                                    variant="outline-secondary" 
                                                                    className="w-100"
                                                                    disabled
                                                                >
                                                                    {status === "completed" ? "Booking Completed" : "Cannot Cancel"}
                                                                </Button>
                                                            )}
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            )}
        </Container>
    );
};

export default BookingHistoryPage;
