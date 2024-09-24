import React, { useContext, useEffect, useReducer } from 'react';
import '../styles/BookingScreen.css';
import Navbar from '../components/Navbar';
import HomeSearch from '../components/HomeSearch';
import { Store } from '../Store';
import { getDate, getError } from '../Utils';
import { toast } from 'react-toastify';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import Loading from '../components/Loading';
import NoDocumentsFound from '../components/NoDocumentsFound';

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

export default function BookingScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, flights, airports, schedules, search } = state;


  
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const fetchFlights = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/flights/fetch');
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
      const { data } = await Axios.get('https://airlines-be.onrender.com/api/schedules/fetch');
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
  }, []);

  if (search.isSearched) {
    var schedulesList = search.searchSchedules;
  } else {
    var schedulesList = schedules;
  }

  return (
    <section className="booking-page">
      {loading && <Loading />}
      <Navbar />
      <h1>Available Flights</h1>
      <HomeSearch />

      <div className="flight-booking-card-container">
        {search.isSearched ? (
          search.searchSchedules ? (
            search.searchSchedules.map((schedule) => (
              <ScheduleCard schedule={schedule} key={schedule._id} />
            ))
          ) : (
            <div>Hi</div>
          )
        ) : (
          schedulesList &&
          schedulesList.map((schedule) => (
            <ScheduleCard schedule={schedule} key={schedule._id} />
          ))
        )}
      </div>
    </section>
  );
}
