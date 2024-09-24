import React, { useContext, useReducer, useState } from 'react';
import { Store } from '../Store';
import { getDate, getError } from '../Utils';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from 'axios';
import PDFGenerator from './PDFGenerator';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAILED':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function ActivityCard({ activity, schedule, index, type }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, flights, airports } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [bigActivity, setBigActivity] = useState(0);

  const removeBookingHandler = async (bookingId, schedule, classType) => {
    const classno = classType === 'Economy' ? 0 : 1;
    schedule.seats[classno].countSeats = schedule.seats[classno].countSeats + 1;
    const seats = schedule.seats;
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/schedules/seat/${schedule._id}`,
        {
          seats,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('schedules', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_SCHEDULES', payload: data });
      try {
        const { data } = await Axios.put(
          `https://airlines-be.onrender.com/api/booking/delete/${bookingId}`,
          {},
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );
        localStorage.setItem('activities', JSON.stringify(data));
        ctxDispatch({ type: 'ADD_ACTIVITIES', payload: data });
        toast.success(
          'You have successfully cancelled the ' + classType + ' ticket!'
        );
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAILED' });
        toast.error(getError(err));
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };
  const [generatePDF, setGeneratePDF] = useState(false);
  


  return (
    <section
      className={
        bigActivity === index + 1
          ? 'activity-list-card big-activity-list-card'
          : 'activity-list-card'
      }
    >
      <div className="flight-booking-card">
        <div className="flight-booking-card-image">
          <img
            src="https://images.ixigo.com/img/common-resources/airline-new/SG.png"
            alt="image"
          />
          <p>
            {flights.find((flight) => flight._id === schedule.flightId).name} -{' '}
            {flights.find((flight) => flight._id === schedule.flightId).number}
            <br></br>
            {
              flights.find((flight) => flight._id === schedule.flightId)
                .category
            }{' '}
            Flight
          </p>
        </div>
        <div className="flight-route-details">
          <div className="flight-departure-details">
            <h2>
              {
                airports.find(
                  (airport) => airport.code === schedule.departureAirport
                ).locationCode
              }{' '}
              <br></br>
              <span>
                (
                {
                  airports.find(
                    (airport) => airport.code === schedule.departureAirport
                  ).location
                }
                )
              </span>
            </h2>
            <h1>{schedule.departureTime}</h1>
            <h3>{getDate(schedule.date)}</h3>
          </div>
          <div className="line-container">
            <h2>2hr 5min</h2>
            <i className="fa-regular fa-clock"></i>
          </div>
          <div className="flight-arrival-details">
            <h2>
              {
                airports.find(
                  (airport) => airport.code === schedule.arrivalAirport
                ).locationCode
              }{' '}
              <br></br>
              <span>
                (
                {
                  airports.find(
                    (airport) => airport.code === schedule.arrivalAirport
                  ).location
                }
                )
              </span>
            </h2>
            <h1>{schedule.arrivalTime}</h1>
            <h3>{getDate(schedule.date)}</h3>
          </div>
        </div>

        <div
          className={
            schedule.status === 'On time'
              ? 'flight-status green'
              : schedule.status === 'Delay'
              ? 'flight-status yellow'
              : schedule.status === 'Cancelled' && 'flight-status red'
          }
        >
          {schedule.status}
        </div>

        {type && (
          
          <Link
            to="#"
            onClick={() =>
              removeBookingHandler(activity._id, schedule, activity.class)
            }
            className="flight-book-button"
          >
            CANCEL
          </Link>
          
          
        )}
      </div>

      <h5
        onClick={() => {
          bigActivity === index + 1
            ? setBigActivity(0)
            : setBigActivity(index + 1);
        }}
      >
        {bigActivity === index + 1 ? 'Hide details ' : 'View details '}

        <i
          className={
            bigActivity === index + 1
              ? 'fa-solid fa-angle-up'
              : 'fa-solid fa-angle-down'
          }
        ></i>
      </h5>


 

      <div className="activity-details-container">
        <table>
          <tr>
            <td>First Name </td>
            <td>:</td>
            <td>{activity.firstname} </td>
          </tr>
          <tr>
            <td>Last Name </td>
            <td>:</td>
            <td>{activity.lastname} </td>
          </tr>
          <tr>
            <td>Phone </td>
            <td>:</td>
            <td>{activity.phone} </td>
          </tr>
          <tr>
            <td>Age </td>
            <td>:</td>
            <td>{activity.age} years old</td>
          </tr>
          <tr>
            <td> Gender </td>
            <td>:</td>
            <td>{activity.gender} </td>
          </tr>
          <tr>
            <td>Nationality </td>
            <td>:</td>
            <td>{activity.nationality} </td>
          </tr>
        </table>
        <table>
          <tr>
            <td>Class </td>
            <td>:</td>
            <td>{activity.class} </td>
          </tr>

          <tr>
            <td>Fare </td>
            <td>:</td>
            <td>
              Rs {schedule.seats[activity.class === 'Economy' ? 0 : 1].fare}
              /-{' '}
            </td>
          </tr>
          <tr>
            <td>Passenger type </td>
            <td>:</td>
            <td>
              {activity.age > 0 && activity.age <= 2
                ? 'Infant'
                : activity.age > 2 && activity.age <= 12
                ? 'Child'
                : 'Adult'}{' '}
            </td>
          </tr>
          <tr>
            <td>Seat Number </td>
            <td>:</td>
            <td>{activity.seatNumber} </td>
          </tr>
          <tr>
            <td>Booked Date </td>
            <td>:</td>
            <td>{getDate(activity.createdAt.slice(0, 10))}</td>
          </tr>
          <tr>
            <td>Booked Time</td>
            <td>:</td>
            <td>{activity.createdAt.slice(11, 16)} </td>
          </tr>
        </table>

{/* 
        <button
              onClick={() => setGeneratePDF(true)} // Update state to trigger PDF generation
            >
              Generate PDF
            </button> */}
      </div>
      <PDFGenerator activity={activity} schedule={schedule}/>

    </section>
  );
}
