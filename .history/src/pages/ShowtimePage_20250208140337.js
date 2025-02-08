import { useParams } from "react-router-dom";
import SeatSelection from "../components/SeatSelection";

const ShowtimePage = () => {
    const { showtimeId } = useParams();

    return (
        <div>
            <h1>Book Your Seats</h1>
            <SeatSelection showtimeId={showtimeId} />
        </div>
    );
};

export default ShowtimePage;
