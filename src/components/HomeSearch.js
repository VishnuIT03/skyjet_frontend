import React, { useContext, useEffect, useReducer, useState } from 'react';
import '../styles/HomeScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { getError } from '../Utils';
import { toast } from 'react-toastify';
import { Store } from '../Store';
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

export default function HomeSearch() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, airports } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [departureAirport, setDepartureAirport] = useState('');
  const [arrivalAirport, setArrivalAirport] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const fetchAirports = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/airport/fetch');
      localStorage.setItem('airports', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRPORT', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    fetchAirports();
  }, []);

  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.post(`https://airlines-be.onrender.com/api/search/`, {
        departureAirport,
        arrivalAirport,
        searchDate,
      });
      ctxDispatch({
        type: 'SEARCH',
        payload: { isSearch: true, searchSchedules: data },
      });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
    navigate('/bookings');
  };

  return (
    <section className="booking-search-container">
      {' '}
      {loading && (
        <div className="home-search-loading">
          <Loading />
        </div>
      )}{' '}
      <form className="booking-search-form" onSubmit={searchHandler}>
        <div className="input-fields">
          <label htmlFor="departureAirport"> Departure Airport </label>{' '}
          <select
            id="departureAirport"
            value={departureAirport}
            onChange={(e) => setDepartureAirport(e.target.value)}
            required
          >
            <option> </option>{' '}
            {airports &&
              airports.map((airport) => (
                <option key={airport._id} value={airport.code}>
                  {' '}
                  {airport.name}({airport.locationCode}) - {airport.location}{' '}
                </option>
              ))}{' '}
          </select>{' '}
        </div>{' '}
        <i className="fa-solid fa-right-left"> </i>{' '}
        <div className="input-fields">
          <label htmlFor="arrivalAirport"> Arrival Airport </label>{' '}
          <select
            id="arrivalAirport"
            value={arrivalAirport}
            onChange={(e) => setArrivalAirport(e.target.value)}
            required
          >
            <option> </option>{' '}
            {airports &&
              airports.map((airport) => (
                <option key={airport._id} value={airport.code}>
                  {' '}
                  {airport.name}({airport.code}) - {airport.location}{' '}
                </option>
              ))}{' '}
          </select>{' '}
        </div>{' '}
        <div className="input-fields">
          <label htmlFor="departureAirport"> Departure Time </label>{' '}
          <input
            type="date"
            id="departureTimet"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            required
          />{' '}
        </div>{' '}
        <button type="submit" className="booking-search-button">
          SEARCH{' '}
        </button>{' '}
      </form>{' '}
    </section>
  );
}
