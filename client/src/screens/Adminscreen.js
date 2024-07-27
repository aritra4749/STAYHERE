import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Swal from 'sweetalert2'

const { TabPane } = Tabs;

const Adminscreen = () => {

    useEffect(()=>{
        if(!JSON.parse(localStorage.getItem("currentUser")).isAdmin){
            window.location.href='/home'
        }
    },[])



  return (
    <div className='mt-3 ml-3 mr-3 bs'>
      <h2 className='text-center' style={{ fontSize: '30px' }}><b>ADMIN PANEL</b></h2>
      <div className='ml-3 mt-3'>
        <Tabs defaultActiveKey='1'>
          <TabPane tab="Bookings" key='1'>
            <Bookings />
          </TabPane>
          <TabPane tab="Rooms" key='2'>
            <Rooms />
          </TabPane>
          <TabPane tab="Add Room" key='3'>
            <Addroom/>
          </TabPane>
          <TabPane tab="Users" key='4'>
            <Users />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default Adminscreen;

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/booking/getallbookings');
        setBookings(response.data);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className='row'>
      <div className='col-md-12'>
        {loading && <Loading />}
        {error && <Error />}
        {!loading && !error && bookings.length > 0 && (
          <table className='table table-bordered table-dark'>
            <thead className='bs'>
              <tr>
                <th>Booking Id</th>
                <th>User Id</th>
                <th>Room</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.userid}</td>
                  <td>{booking.room}</td>
                  <td>{formatDate(booking.fromDate)}</td>
                  <td>{formatDate(booking.toDate)}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && bookings.length === 0 && <h4>No bookings found</h4>}
      </div>
    </div>
  );
};

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('/api/rooms/getallrooms');
        setRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className='row'>
      <div className='col-md-12'>
        {loading && <Loading />}
        {error && <Error />}
        {!loading && !error && rooms.length > 0 && (
          <table className='table table-bordered table-dark'>
            <thead className='bs'>
              <tr>
                <th>Room Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Type</th>
                <th>Rent Per Day</th>
                <th>Max Count</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id}>
                  <td>{room._id}</td>
                  <td>{room.name}</td>
                  <td>{room.description}</td>
                  <td>{room.type}</td>
                  <td>{room.rentperday}</td>
                  <td>{room.maxcount}</td>
                  <td>{room.phonenumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && !error && rooms.length === 0 && <h4>No rooms found</h4>}
      </div>
    </div>
  );
};

export const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.post('/api/users/getallusers'); // Use the correct method and URL
          setUsers(response.data);
          setLoading(false);
        } catch (error) {
          console.log(error);
          setError(true);
          setLoading(false);
        }
      };
  
      fetchUsers();
    }, []);
  
    return (
      <div className='row'>
        <div className='col-md-12'>
          {loading && <Loading />}
          {error && <Error />}
          {!loading && !error && (
            <table className='table table-bordered table-dark'>
              <thead className='bs'>
                <tr>
                  <th>User Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Is Admin?</th>
                </tr>
              </thead>
              <tbody>
                {users.length && users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };


  export const Addroom = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [name, setname] = useState('');
    const [rentperday, setrentperday] = useState('');
    const [maxcount, setmaxcount] = useState('');
    const [description, setdescription] = useState('');
    const [type, settype] = useState('');
    const [phonenumber, setphonenumber] = useState('');
    const [imageurl1, setimageurl1] = useState('');
    const [imageurl2, setimageurl2] = useState('');
    const [imageurl3, setimageurl3] = useState('');

    async function addRoom() {
        const newRoom = {
            name,
            rentperday,
            maxcount,
            description,
            type,
            phonenumber,
            imageurls: [imageurl1, imageurl2, imageurl3]
        };

        try {
            setLoading(true);
            const response = await axios.post('/api/rooms/addroom', newRoom);
            console.log(response.data);
            setLoading(false);
            Swal.fire('Congratulations', 'New Room is Added Successfully', 'success').then(result => {
                window.location.href = '/home';
            });
        } catch (error) {
            console.log('Axios error:', error);
            if (error.response) {
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);
            } else if (error.request) {
                console.log('Request data:', error.request);
            } else {
                console.log('Error message:', error.message);
            }
            setLoading(false);
            setError(true);
            Swal.fire('OOPS', 'Something Went Wrong', 'error');
        }
    }

    return (
        <div className='row'>
            {loading && <Loading />}
            {error && <Error />}
            {!loading && !error && (
                <>
                    <div className='col-md-5'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Room Name'
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                        />
                        <input
                            type='number'
                            className='form-control'
                            placeholder='Rent Per Day'
                            value={rentperday}
                            onChange={(e) => setrentperday(e.target.value)}
                        />
                        <input
                            type='number'
                            className='form-control'
                            placeholder='Max Count'
                            value={maxcount}
                            onChange={(e) => setmaxcount(e.target.value)}
                        />
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Description'
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                        />
                        <input
                            type='number'
                            className='form-control'
                            placeholder='Phone Number'
                            value={phonenumber}
                            onChange={(e) => setphonenumber(e.target.value)}
                        />
                    </div>
                    <div className='col-md-5'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Type'
                            value={type}
                            onChange={(e) => settype(e.target.value)}
                        />
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Image URL 1'
                            value={imageurl1}
                            onChange={(e) => setimageurl1(e.target.value)}
                        />
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Image URL 2'
                            value={imageurl2}
                            onChange={(e) => setimageurl2(e.target.value)}
                        />
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Image URL 3'
                            value={imageurl3}
                            onChange={(e) => setimageurl3(e.target.value)}
                        />
                        <div className='text-right'>
                            <button className='btn btn-primary mt-2' onClick={addRoom}>Add Room</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}