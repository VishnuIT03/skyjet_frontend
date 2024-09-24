import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getDate, getError } from '../Utils';
import Axios from 'axios';
import Loading from './Loading';

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

export default function Flights({ airline }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, flights, airports, schedules } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [isUpdate, setUpdate] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [bigFlightSchedules, setBigFlightSchedules] = useState(0);
  const [flightId, setFlightId] = useState('');

  const [departureAirport, setDepartureAirport] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [economySeats, setEconomySeats] = useState(40);
  const [economyFare, setEconomyFare] = useState(0);
  const [businessSeats, setBusinessSeats] = useState(20);
  const [businessFare, setBusinessFare] = useState(0);
  const [flightStatus, setFlightStatus] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  const fetchAirports = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/airport', {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('airports', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRPORT', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const fetchFlights = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/flights', {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('flights', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_FLIGHTS', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const fetchSchedules = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/schedules', {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('schedules', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_SCHEDULES', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchFlights();
    fetchAirports();
  }, []);

  const addScheduleHandler = async (e) => {
    e.preventDefault();
    setFormOpen(false);
    if(new Date(departureDate) < new Date()) {
      toast.error("Please check the date!");
      return;
    }
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const seats = [
        {
          class: 'Economy',
          countSeats: Number(economySeats),
          fare: Number(economyFare),
        },
        {
          class: 'Business',
          countSeats: Number(businessSeats),
          fare: Number(businessFare),
        },
      ];

      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/schedules/add/${flightId}`,
        {
          departureAirport,
          departureTime,
          arrivalAirport,
          arrivalTime,
          seats,
          flightStatus,
          departureDate,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('schedules', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_SCHEDULES', payload: data });
      toast.success('Scheduled successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const deleteSchedule = async (scheduleId) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });

      await Axios.get(`https://airlines-be.onrender.com/api/booking/admin/delete/${scheduleId}`, {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });

      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/schedules/delete/${scheduleId}`,

        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('schedules', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_SCHEDULES', payload: data });
      toast.success('Schedule removed successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const deleteFlights = async (
    flightId,
    flightName,
    flightCode,
    airlinesId
  ) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });

      const result = await Axios.put(
        `https://airlines-be.onrender.com/api/schedules/admin/delete/${flightId}`,
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );

      localStorage.setItem('schedules', JSON.stringify(result.data.schedules));
      ctxDispatch({ type: 'ADD_SCHEDULES', payload: result.data.schedules });

      var scheduleIds = [];
      result.data.removedSchedules.map((schd) => {
        scheduleIds.push(schd._id);
      });

      scheduleIds &&
        (await Axios.put(
          `https://airlines-be.onrender.com/api/booking/admin/delete`,
          {
            scheduleIds,
          },
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        ));

      const airlines = await Axios.put(
        `https://airlines-be.onrender.com/api/airlines/admin/delete/${airlinesId}`,
        {
          flightCode,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );

      localStorage.setItem('airlines', JSON.stringify(airlines.data));
      ctxDispatch({ type: 'ADD_AIRLINES', payload: airlines.data });

      const { data } = await Axios.get(
        `https://airlines-be.onrender.com/api/flights/admin/delete/${flightId}`,
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );

      localStorage.setItem('flights', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_FLIGHTS', payload: data });

      toast.success(flightName + ' removed successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  return (
    <section className="flight-list-container">
      {loading && <Loading />}
      {flights &&
        flights.map(
          (flight, index) =>
            flight.airlineId === airline._id && (
              <div
                className={
                  bigFlightSchedules === index + 1
                    ? 'airlines-list-container big-airlines-list-container'
                    : 'airlines-list-container'
                }
                key={index + 1}
              >
                <div className="airlines-list-container-header">
                  <div className="airlines-image-container">
                    <div className="airlines-image">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh8i3TloHnlczFAInYtSYsFzhk-SQGL_E22A&usqp=CAU" />
                    </div>
                    <div>
                      <h3>{flight.name}</h3>
                      <p>{flight.number}</p>
                      <p>{flight.category} flight</p>
                    </div>
                  </div>
                  <div className="airline-button-container">
                    <Link
                      to={`/dashboard/${flight._id}`}
                      onClick={() => {
                        setFormOpen(true);
                        setFlightId(flight._id);
                      }}
                      className="admin-add-button"
                    >
                      ADD SCHEDULES
                    </Link>
                    <Link
                      to={`/dashboard/${flight._id}`}
                      onClick={() =>
                        deleteFlights(
                          flight._id,
                          flight.name,
                          flight.number,
                          flight.airlineId
                        )
                      }
                      className="admin-add-button airport-card-delete-button"
                    >
                      DELETE FLIGHTS
                    </Link>
                  </div>
                </div>

                <div className="flights-schedule-list-container">
                  {schedules.map(
                    (schedule) =>
                      schedule.flightId === flight._id && (
                        <div className="flight-booking-card" key={schedule._id}>
                          <div className="flight-booking-card-image">
                            <img
                              src="https://images.ixigo.com/img/common-resources/airline-new/SG.png"
                              alt="image"
                            />
                            <p>
                              {flight.name} - {flight.number}
                            </p>
                          </div>

                          <div className="flight-route-details">
                            <div className="flight-departure-details">
                              <h2>
                                {airports &&
                                  airports.find(
                                    (airport) =>
                                      airport.code === schedule.departureAirport
                                  ).locationCode}{' '}
                                <br></br>
                                <span>
                                  (
                                  {airports &&
                                    airports.find(
                                      (airport) =>
                                        airport.code ===
                                        schedule.departureAirport
                                    ).location}
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
                                {airports &&
                                  airports.find(
                                    (airport) =>
                                      airport.code === schedule.arrivalAirport
                                  ).locationCode}{' '}
                                <br></br>
                                <span>
                                  (
                                  {airports &&
                                    airports.find(
                                      (airport) =>
                                        airport.code === schedule.arrivalAirport
                                    ).location}
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
                                  {seat.class} -{' '}
                                  <i className="fa-solid fa-indian-rupee-sign"></i>{' '}
                                  {seat.fare}
                                </h2>
                                <p>Available {seat.countSeats} seats</p>
                              </div>
                            ))}
                          </div>
                          <div className="schedule-button-container">
                            <div
                              className={
                                schedule.status === 'On time'
                                  ? 'flight-status green'
                                  : schedule.status === 'Delay'
                                  ? 'flight-status yellow'
                                  : schedule.status === 'Cancelled' &&
                                    'flight-status red'
                              }
                            >
                              {schedule.status}
                            </div>
                            <Link
                              to={`/dashboard/${flight._id}`}
                              onClick={() => {
                                setFormOpen(true);
                                setFlightId(flight._id);
                              }}
                              className="admin-add-button airport-card-edit-button"
                            >
                              EDIT
                            </Link>
                            <Link
                              to={`/dashboard/${flight._id}`}
                              onClick={() => deleteSchedule(schedule._id)}
                              className="admin-add-button airport-card-delete-button"
                            >
                              DELETE
                            </Link>
                          </div>
                        </div>
                      )
                  )}
                </div>
                <h5
                  onClick={() => {
                    bigFlightSchedules === index + 1
                      ? setBigFlightSchedules(0)
                      : setBigFlightSchedules(index + 1);
                  }}
                >
                  {bigFlightSchedules === index + 1
                    ? 'Hide schedules '
                    : 'View schedules '}

                  <i
                    className={
                      bigFlightSchedules === index + 1
                        ? 'fa-solid fa-angle-up'
                        : 'fa-solid fa-angle-down'
                    }
                  ></i>
                </h5>
              </div>
            )
        )}
      <form
        className={
          isFormOpen
            ? 'add-airport-form add-schedule-form active-add-airport-form'
            : 'add-airport-form add-schedule-form'
        }
        onSubmit={addScheduleHandler}
      >
        <div className="add-airport-form-header">
          <h3>ADD SCHEDULES</h3>
          <i
            onClick={() => {
              setFormOpen(false);
            }}
            className="fa-solid fa-xmark"
          ></i>
        </div>

        <div className="input-fields">
          <label htmlFor="departureAirport">
            Departure Airport<span>*</span>
          </label>
          <select
            id="departureAirport"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
          >
            <option></option>
            {airports &&
              airports.map((airport) => (
                <option key={airport._id} value={airport.code}>
                  {airport.locationCode}({airport.code}) - {airport.location}
                </option>
              ))}
          </select>
        </div>

        <div className="input-fields">
          <label htmlFor="departureTime">
            Departure Time<span>*</span>
          </label>
          <input
            type="time"
            id="departureTime"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="arrivalAirport">
            Arrival Airport<span>*</span>
          </label>
          <select
            id="arrivalAirport"
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value)}
          >
            <option></option>
            {airports &&
              airports.map((airport) => (
                <option key={airport._id} value={airport.code}>
                  {airport.locationCode}({airport.code}) - {airport.location}
                </option>
              ))}
          </select>
        </div>

        <div className="input-fields">
          <label htmlFor="arrivalTime">
            Arrival Time<span>*</span>
          </label>
          <input
            type="time"
            id="arrivalTime"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="economySeats">
            Economy Seats<span>*</span>
          </label>
          <input
            type="text"
            id="economySeats"
            value={economySeats}
            onChange={(e) => setEconomySeats(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="economyFare">
            Economy Fare<span>*</span>
          </label>
          <input
            type="text"
            id="economyFare"
            value={economyFare}
            onChange={(e) => setEconomyFare(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="businessSeats">
            Business Seats<span>*</span>
          </label>
          <input
            type="text"
            id="businessSeats"
            value={businessSeats}
            onChange={(e) => setBusinessSeats(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="businessFare">
            Business Fare<span>*</span>
          </label>
          <input
            type="text"
            id="businessFare"
            value={businessFare}
            onChange={(e) => setBusinessFare(e.target.value)}
            required
          />
        </div>

        <div className="input-fields">
          <label htmlFor="status">
            Status<span>*</span>
          </label>
          <select
            id="status"
            value={flightStatus}
            onChange={(e) => setFlightStatus(e.target.value)}
          >
            <option></option>
            <option value="Delay">Delay</option>
            <option value="On time">On time</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="input-fields">
          <label htmlFor="date">
            Date<span>*</span>
          </label>
          <input
            type="date"
            id="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        <div className="airport-form-button-container">
          <button type="reset" className="airport-cancel-button">
            CANCEL
          </button>
          <button type="submit" className="airport-add-button">
            {isUpdate ? 'SAVE' : 'ADD'}
          </button>
        </div>
      </form>
    </section>
  );
}
