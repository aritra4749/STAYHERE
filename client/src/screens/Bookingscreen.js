import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import Swal from 'sweetalert2'


function Bookingscreen() {
  const { roomid, fromdate, todate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);


  
  useEffect(() => {

    if(!localStorage.getItem('currentUser')){
      window.location.reload='/login'
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/rooms/getroombyid", { roomid });
        setRoom(response.data);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching room data:', error);
        setLoading(false);
        setError(true);
      }
    };
    fetchData();
  }, [roomid]);

  if (loading) {
    return <Loading />;
  }

  if (error || !room) {
    return <Error />;
  }

  const fromDate = moment(fromdate, 'DD-MM-YYYY');
  const toDate = moment(todate, 'DD-MM-YYYY');
  const totalDays = toDate.diff(fromDate, 'days'); // Include both start and end dates
  const totalAmount = room.rentperday * totalDays;


  
  async function onToken(token){
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromDate: fromDate.format('DD-MM-YYYY'),
      toDate: toDate.format('DD-MM-YYYY'),
      totalAmount,
      totalDays,
      token
    };

    try {
      setLoading(true)
      const result = await axios.post('/api/booking/bookroom', bookingDetails);
      console.log('Booking result:', result);
      setLoading(false)
      Swal.fire('Congratulations','Your room booked successfully','success').then(result=>window.location.href='/profile')
      // Handle booking success (e.g., redirect to a success page or show a success message)
    } catch (error) {
      console.error('Error booking room:', error);
      setLoading(false)
      Swal.fire('Oops','Something went wrong','error')
      // Handle booking error (e.g., show an error message)
    }
  }

  return (
    <div className="m-5">
      <div>
        <div className="row justify-content-center mt-5 bs">
          <div className="col-md-6">
            <h1>{room.name}</h1>
            <img src={room.imageurls[0]} className="bigimg" alt={room.name} />
          </div>
          <div className="col-md-6">
            <div style={{ textAlign: "right" }}>
              <h1>Booking Details</h1>
              <hr />
              <p><b>Name:</b> {JSON.parse(localStorage.getItem('currentUser')).name}</p>
              <p><b>From Date:</b> {fromDate.format('DD-MM-YYYY')}</p>
              <p><b>To Date:</b> {toDate.format('DD-MM-YYYY')}</p>
              <p><b>Max Count:</b> {room.maxcount}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h1>Amount</h1>
              <hr />
              <p><b>Total Days:</b> {totalDays}</p>
              <p><b>Rent per day:</b> {room.rentperday}</p>
              <p><b>Total Amount:</b> {totalAmount}</p>
            </div>
            <div style={{ float: 'right' }}>

              <StripeCheckout
              amount={totalAmount*100}
        token={onToken}
        currency='INR'
        stripeKey="pk_test_51Ph2CGJ1aBo9Rqaz6skufVcb1NJDhhIoayMozL5Fm6dDUL5hZtMxeCKIKVtXAsPJGDIrIZr7ufo25qq9AdNKnZyf00PIkVtNip"
      >
              <button className='btn btn-primary'>Pay Now</button>

      </StripeCheckout>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
