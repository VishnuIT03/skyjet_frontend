import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Store } from '../Store';
import Axios from 'axios';
import { getError } from '../Utils';
import { toast } from 'react-toastify';
import { Link, useParams } from 'react-router-dom';
import Flights from './Flights';
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

export default function Airlines() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, airlines } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const params = useParams();
  const { airline: airlineId } = params;

  const [isUpdate, setUpdate] = useState(false);
  const [isFormOpen, setFormOpen] = useState(0);
  const [bigAirlines, setBigAirlines] = useState(0);

  const [airlinesName, setAirlinesName] = useState('');

  const [flightNumber, setFlightNumber] = useState('');
  const [flightName, setFlightName] = useState('');
  const [flightCategory, setFlightCategory] = useState('');

  const fetchAirlines = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/airlines', {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('airlines', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRLINES', payload: data });
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

  useEffect(() => {
    fetchAirlines();
    fetchFlights();
  }, []);

  const addAirlinesHandler = async (e) => {
    e.preventDefault();
    setFormOpen(false);

    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        'https://airlines-be.onrender.com/api/airlines/add',
        {
          airlinesName,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('airlines', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRLINES', payload: data });
      toast.success(airlinesName + ' added successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const deleteAirline = async (airlineName, airlineId) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const flight = await Axios.get(
        `https://airlines-be.onrender.com/api/flights/admin/airline/delete/${airlineId}`,
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );

      localStorage.setItem('flights', JSON.stringify(flight.data.flights));
      ctxDispatch({ type: 'ADD_FLIGHTS', payload: flight.data.flights });

      var flightIds = [];
      flight.data.removedFlights.map((flt) => {
        flightIds.push(flt._id);
      });

      if (flightIds) {
        const schedule = await Axios.put(
          `https://airlines-be.onrender.com/api/schedules/admin/airline/delete`,
          {
            flightIds,
          },
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );

        localStorage.setItem(
          'schedules',
          JSON.stringify(schedule.data.schedules)
        );
        ctxDispatch({
          type: 'ADD_SCHEDULES',
          payload: schedule.data.schedules,
        });

        var scheduleIds = [];
        schedule.data.removedSchedules.map((sch) => {
          scheduleIds.push(sch._id);
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
      }

      const airlines = await Axios.get(
        `https://airlines-be.onrender.com/api/airlines/admin/delete/${airlineId}`,

        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );

      localStorage.setItem('airlines', JSON.stringify(airlines.data));
      ctxDispatch({ type: 'ADD_AIRLINES', payload: airlines.data });

      toast.success(airlineName + ' removed successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const flightList = () => {
    const flights = airlines.find((airline) => {
      return airline._id === airlineId;
    });
    if (!flights.flights.includes(flightNumber)) {
      flights.flights.push(flightNumber);
    }
    return flights.flights;
  };

  const addFlightHandler = async (e) => {
    e.preventDefault();
    setFormOpen(false);
    const flights = flightList();
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/flights/add/${airlineId}`,
        {
          flights,
          flightNumber,
          flightName,
          flightCategory,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('flights', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_FLIGHTS', payload: data });
      toast.success(flightName + ' added successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  return (
    <section className="airport-container">
      {' '}
      {loading && <Loading />}{' '}
      <div className="airport-container-header">
        <h3> AIRLINES </h3>{' '}
        <button onClick={() => setFormOpen(1)} className="admin-add-button">
          ADD AIRLINES{' '}
        </button>{' '}
      </div>{' '}
      <div className="airport-list-container">
        {' '}
        {airlines &&
          airlines.map((airline, index) => (
            <div
              className={
                bigAirlines === index + 1
                  ? 'airlines-list-container big-airlines-list-container'
                  : 'airlines-list-container'
              }
              key={index}
            >
              <div className="airlines-list-container-header">
                <div className="airlines-image-container">
                  <div className="airlines-image">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh8i3TloHnlczFAInYtSYsFzhk-SQGL_E22A&usqp=CAU" />
                  </div>{' '}
                  <div>
                    <h3> {airline.name} </h3>{' '}
                    <p>
                      {' '}
                      {airline.flights.length}{' '}
                      {airline.flights.length === 1 ? 'flight' : 'flights'}{' '}
                    </p>{' '}
                  </div>{' '}
                </div>{' '}
                <div className="airline-button-container">
                  <Link
                    to={`/dashboard/${airline._id}`}
                    onClick={() => setFormOpen(2)}
                    className="admin-add-button"
                  >
                    ADD FLIGHTS{' '}
                  </Link>{' '}
                  <Link
                    to={`/dashboard/${airline._id}`}
                    onClick={() => deleteAirline(airline.name, airline._id)}
                    className="admin-add-button airport-card-delete-button"
                  >
                    DELETE AIRLINES{' '}
                  </Link>{' '}
                </div>{' '}
              </div>{' '}
              <Flights airline={airline} />
              <h5
                onClick={() => {
                  bigAirlines === index + 1
                    ? setBigAirlines(0)
                    : setBigAirlines(index + 1);
                }}
              >
                {bigAirlines === index + 1 ? 'Hide flights ' : 'View flights '}(
                {airline.flights.length}){' '}
                <i
                  className={
                    bigAirlines === index + 1
                      ? 'fa-solid fa-angle-up'
                      : 'fa-solid fa-angle-down'
                  }
                ></i>{' '}
              </h5>{' '}
            </div>
          ))}{' '}
      </div>
      <form
        className={
          isFormOpen === 1
            ? 'add-airport-form active-add-airport-form'
            : 'add-airport-form'
        }
        onSubmit={addAirlinesHandler}
      >
        <div className="add-airport-form-header">
          <h3> ADD AIRLINES </h3>{' '}
          <i
            onClick={() => {
              setFormOpen(0);
            }}
            className="fa-solid fa-xmark"
          ></i>{' '}
        </div>{' '}
        <div className="input-fields">
          <label htmlFor="airlineName">
            Airlines Name <span> * </span>{' '}
          </label>{' '}
          <input
            type="text"
            id="airlineName"
            value={airlinesName}
            onChange={(e) => setAirlinesName(e.target.value)}
            required
          />
        </div>
        <div className="airport-form-button-container">
          <button type="reset" className="airport-cancel-button">
            CANCEL{' '}
          </button>{' '}
          <button type="submit" className="airport-add-button">
            {' '}
            {isUpdate ? 'SAVE' : 'ADD'}{' '}
          </button>{' '}
        </div>{' '}
      </form>
      <form
        className={
          isFormOpen === 2
            ? 'add-airport-form active-add-airport-form'
            : 'add-airport-form'
        }
        onSubmit={addFlightHandler}
      >
        <div className="add-airport-form-header">
          <h3> ADD FLIGHTS </h3>{' '}
          <i
            onClick={() => {
              setFormOpen(0);
            }}
            className="fa-solid fa-xmark"
          ></i>{' '}
        </div>
        <div className="input-fields">
          <label htmlFor="flightNumber">
            Flight Number <span> * </span>{' '}
          </label>{' '}
          <input
            type="text"
            id="flightNumber"
            value={flightNumber}
            onChange={(e) => setFlightNumber(e.target.value)}
            required
          />
        </div>
        <div className="input-fields">
          <label htmlFor="flightName">
            Flight Name <span> * </span>{' '}
          </label>{' '}
          <input
            type="text"
            id="flightName"
            value={flightName}
            onChange={(e) => setFlightName(e.target.value)}
            required
          />
        </div>
        <div className="input-fields">
          <label htmlFor="flightCategory">
            Flight Category <span> * </span>{' '}
          </label>{' '}
          <select
            id="flightCategory"
            value={flightCategory}
            onChange={(e) => setFlightCategory(e.target.value)}
          >
            <option> </option> <option value="Domestic"> Domestic </option>{' '}
            <option value="International"> International </option>{' '}
          </select>{' '}
        </div>
        <div className="airport-form-button-container">
          <button type="reset" className="airport-cancel-button">
            CANCEL{' '}
          </button>{' '}
          <button type="submit" className="airport-add-button">
            {' '}
            {isUpdate ? 'SAVE' : 'ADD'}{' '}
          </button>{' '}
        </div>{' '}
      </form>{' '}
    </section>
  );
}
