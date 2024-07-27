import React, { useEffect, useState } from 'react';
import { Tabs, Tag, Button } from 'antd';
import axios from 'axios';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Swal from 'sweetalert2';

const { TabPane } = Tabs;

const Profilescreen = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  return (
    <div className='ml-3 mt-3'>
      <Tabs defaultActiveKey='1'>
        <TabPane tab="Account" key='1'>
          <h1>My Account</h1>
          <br />
          <h1><b>Name:</b> {user.name}</h1>
          <h1><b>Email:</b> {user.email}</h1>
          <h1><b>isAdmin:</b> {user.isAdmin ? 'Yes' : 'No'}</h1>
        </TabPane>
        <TabPane tab="Bookings" key='2'>
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profilescreen;

export const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    let isMounted = true;

    const fetchBookings = async () => {
      try {
        const response = await axios.post('/api/booking/getbookingsbyuserid', { userid: user._id });
        if (isMounted) {
          setBookings(response.data);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        if (isMounted) {
          setError('Error fetching bookings');
          Swal.fire('Oops', 'Something went wrong', 'error');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [user._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleCancelBooking = async (bookingId, roomId) => {
    try {
      setLoading(true);
      await axios.post('/api/booking/cancelbooking', { bookingId, roomId });
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      Swal.fire('Success', 'Your booking has been cancelled', 'success');
    } catch (err) {
      console.error('Error canceling booking:', err);
      Swal.fire('Oops', 'Error canceling booking', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  return (
    <div>
      <div className='row'>
        <div className='col-md-6'>
          {bookings.map(booking => (
            <div className='bs' key={booking._id}>
              <h1>{booking.room}</h1>
              <p><b>Booking Id:</b> {booking._id}</p>
              <p><b>Check In Date:</b> {formatDate(booking.fromDate)}</p>
              <p><b>Check Out Date:</b> {formatDate(booking.toDate)}</p>
              <p><b>Amount:</b> {booking.totalAmount}</p>
              <p><b>Status:</b> {booking.status === 'cancelled' ? <Tag color="red">CANCELLED</Tag> : <Tag color="green">CONFIRMED</Tag>}</p>

              {booking.status !== 'cancelled' && (
                <div className='text-right'>
                  <Button className='btn btn-primary' onClick={() => handleCancelBooking(booking._id, booking.roomid)}>CANCEL BOOKING</Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
