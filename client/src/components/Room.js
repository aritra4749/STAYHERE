import React, { useState } from "react";
import { Modal, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import moment from 'moment';

function Room({ room, fromdate, todate }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let isAvailable = true;
  if (fromdate && todate) {
    isAvailable = room.currentbookings.every(booking => {
      if (!booking.fromDate || !booking.toDate) {
        return true; // Skip invalid bookings
      }

      const bookingStart = moment(booking.fromDate, 'DD-MM-YYYY', true);
      const bookingEnd = moment(booking.toDate, 'DD-MM-YYYY', true);
      const selectedStart = moment(fromdate, 'DD-MM-YYYY', true);
      const selectedEnd = moment(todate, 'DD-MM-YYYY', true);

      if (!bookingStart.isValid() || !bookingEnd.isValid()) {
        return true; // Skip invalid bookings
      }

      return (
        selectedStart.isAfter(bookingEnd) || selectedEnd.isBefore(bookingStart)
      );
    });
  }


  return (
    <div className='row bs'>
      <div className='col-md-4'>
        <img src={room.imageurls[0]} className='smallimg' alt="Room" />
      </div>
      <div className='col-md-7'>
        <h1>{room.name}</h1>
        <p>{room.facility}</p>
        <p><b>Max Count :</b> {room.maxcount}</p>
        <p><b>Phone Number :</b> {room.phonenumber}</p>
        <p><b>Type :</b> {room.type}</p>
        {fromdate && todate && (
          isAvailable ? (
            <p><i className="fas fa-check-circle" style={{ color: 'green' }} /> Available for {fromdate} - {todate}</p>
          ) : (
            <p><i className="fas fa-times-circle" style={{ color: 'red' }} /> Not available for {fromdate} - {todate}</p>
          )
        )}
        <div style={{ float: "right" }}>
          {(fromdate && todate) &&
            <Link to={`/book/${room._id}/${fromdate}/${todate}`}>
              <button className="btn btn-primary m-2">Book Now</button>
            </Link>
          }
          <button className='btn btn-primary' onClick={handleShow}>View Details</button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurls.map(url => (
              <Carousel.Item key={url}>
                <img
                  className="d-block w-100 bigimg"
                  src={url}
                  alt="Room"
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
