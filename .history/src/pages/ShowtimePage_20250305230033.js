import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchSeats } from "../services/api"; 
import SeatSelection from "../components/SeatSelection";
import { Spinner, Alert, Container } from "react-bootstrap";

const ShowtimePage = () => {
    const { showtimeId } = useParams();
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFallback, setIsFallback] = useState(false);  // Track fallback usage

    useEffect(() => {
        const getSeats = async () => {
            try {
                const data = await fetchSeats(showtimeId);
                
                // Check if the returned data is fallback data
                if (data.length > 0 && data[0].id.startsWith("A")) {
                    setIsFallback(true);
                }

                setSeats(data);
            } catch (err) {
                setError("Failed to load seats. Using fallback data.");
                setIsFallback(true);
            }
            setLoading(false);
        };

        getSeats();
    }, [showtimeId]);

    return (
        <Container className="mt-4">
           

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <>
                    {isFallback && (
                        <Alert variant="warning" className="text-center">
                            ⚠️ No real showtime found. Using fallback seat selection.
                        </Alert>
                    )}
                    <SeatSelection showtimeId={showtimeId} seats={seats} />
                </>
            )}

            {error && (
                <Alert variant="danger" className="text-center">
                    {error}
                </Alert>
            )}
        </Container>
    );
};

export default ShowtimePage;
