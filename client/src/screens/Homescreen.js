import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { DatePicker } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [frmdt, setFrmdt] = useState(null);
  const [todt, setTodt] = useState(null);
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [searchkey, setSearchKey] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setDuplicateRooms(response.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterByDate = (dates) => {
    if (dates && dates.length === 2) {
      const fromDate = dates[0];
      const toDate = dates[1];

      setFrmdt(fromDate.format('DD-MM-YYYY'));
      setTodt(toDate.format('DD-MM-YYYY'));

      console.log(`Filtering from ${fromDate.format('DD-MM-YYYY')} to ${toDate.format('DD-MM-YYYY')}`);

      const tempRooms = duplicateRooms.filter((room) => {
        if (room.currentbookings.length === 0) return true;

        const isAvailable = room.currentbookings.every((booking) => {
          const bookingFromDate = moment(booking.fromDate, 'DD-MM-YYYY', true);
          const bookingToDate = moment(booking.toDate, 'DD-MM-YYYY', true);

          if (!bookingFromDate.isValid() || !bookingToDate.isValid()) {
            console.error(`Invalid date format for booking: ${booking.fromDate} - ${booking.toDate}`);
            return true; // Skip this booking
          }

          console.log(`Checking booking from ${bookingFromDate.format('DD-MM-YYYY')} to ${bookingToDate}`);

          // Check if the selected date range overlaps with any existing bookings
          const doesOverlap = !(fromDate.isAfter(bookingToDate) || toDate.isBefore(bookingFromDate));
          
          console.log(`Overlap: ${doesOverlap}`);

          // If the dates overlap, the room is not available
          return !doesOverlap;
        });

        // If the room has no overlapping bookings, it's available
        return isAvailable;
      });

      setRooms(tempRooms);
    } else {
      console.log("No dates selected, resetting rooms.");
      setRooms(duplicateRooms); // Reset rooms if no dates are selected
    }
  };

  function filterbysearch() {
    const temprooms = duplicateRooms.filter((room) =>
      room.name.toLowerCase().includes(searchkey.toLowerCase())
    );
    setRooms(temprooms);
  }

  function filterbytype(e) {
    setType(e);

    if (e !== "all") {
      const temprooms = duplicateRooms.filter(
        (room) => room.type.toLowerCase() === e.toLowerCase()
      );
      setRooms(temprooms);
    } else {
      setRooms(duplicateRooms);
    }
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-5">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Rooms"
            value={searchkey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyUp={filterbysearch}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={type}
            onChange={(e) => filterbytype(e.target.value)}
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>

      <div className='row justify-content-center mt-5'>
        {loading ? (
          <Loading />
        ) : error ? (
          <Error />
        ) : rooms.length > 0 ? (
          rooms.map(room => (
            <div className='col-md-9 mt-2' key={room._id}>
              <Room room={room} fromdate={frmdt} todate={todt} />
            </div>
          ))
        ) : (
          <Error message="No rooms available for the selected dates." />
        )}
      </div>
    </div>
  );
}

export default Homescreen;
