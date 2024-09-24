import React, { useContext } from 'react';
import { getDate } from '../Utils';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

export default function ScheduleCard({ schedule }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, flights, airports, schedules, activities } = state;
  return (
    <section className="flight-booking-card">
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
            flights.find((flight) => flight._id === schedule.flightId).category
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
      <div className="flight-fare-details">
        {schedule.seats.map((seat, idx) => (
          <div key={idx + 1}>
            <h2>
              {seat.class} - <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
              {seat.fare}
            </h2>
            <p>Available {seat.countSeats} seats</p>
          </div>
        ))}
      </div>
      <Link
        to={userDetails ? `/bookings/${schedule._id}` : '/signin'}
        className="flight-book-button"
      >
        BOOK
      </Link>
    </section>
  );
}
