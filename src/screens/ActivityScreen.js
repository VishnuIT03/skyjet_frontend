




import React, { useContext, useEffect, useReducer, useState } from 'react';
import '../styles/ActivityScreen.css';
import Navbar from '../components/Navbar';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getDate, getError } from '../Utils';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import ScheduleCard from '../components/ScheduleCard';
import Loading from '../components/Loading';
import ActivityCard from '../components/ActivityCard';

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

export default function ActivityScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userDetails,
    flights,
    airports,
    schedules,
    activities,
    allActivities,
    searchBookings,
  } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [bigActivity, setBigActivity] = useState(0);
  const [isMyBooking, setMyBooking] = useState(true);

  const [flightNumber, setFlightNumber] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const fetchActivities = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get(
        `https://airlines-be.onrender.com/api/booking/${userDetails.users._id}`,
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('activities', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_ACTIVITIES', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const fetchAllActivities = async () => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get(`https://airlines-be.onrender.com/api/booking`, {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('allActivities', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_ALL_ACTIVITIES', payload: data });
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    userDetails.users.userType === 'admin' && fetchAllActivities();
    fetchActivities();
  }, []);

  const searchHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      if (flightNumber !== '' && searchDate === '') {
        const { data } = await Axios.get(
          `https://airlines-be.onrender.com/api/booking/flight/search/${flightNumber}`,
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );
        ctxDispatch({
          type: 'SEARCH_BOOKINGS',
          payload: { isSearch: true, searchSchedules: data },
        });
        dispatch({ type: 'FETCH_SUCCESS' });
      }

      if (flightNumber === '' && searchDate !== '') {
        const { data } = await Axios.get(
          `https://airlines-be.onrender.com/api/schedules/flight/search/${searchDate}`,
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );
        const bookings = await Axios.post(
          `https://airlines-be.onrender.com/api/booking/flight/search/date`,
          { data },
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );

        ctxDispatch({
          type: 'SEARCH_BOOKINGS',
          payload: { isSearch: true, searchSchedules: bookings.data },
        });
        dispatch({ type: 'FETCH_SUCCESS' });
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  return (
    <section className="activity-page">
      {loading && <Loading />}
      <Navbar />
      <h1>Booking History</h1>
      <div className="activity-page-header">
        {userDetails.users.userType === 'admin' && (
          <div className="booking-button-container">
            <button
              className={
                isMyBooking
                  ? 'booking-search-button booking-filter-button'
                  : 'booking-search-button booking-filter-button active-filter'
              }
              onClick={() => setMyBooking(true)}
            >
              My bookings
            </button>
            <button
              className={
                isMyBooking
                  ? 'booking-search-button booking-filter-button active-filter'
                  : 'booking-search-button booking-filter-button'
              }
              onClick={() => setMyBooking(false)}
            >
              All bookings
            </button>
          </div>
        )}
        <form className="booking-search-form" onSubmit={searchHandler}>
          <div className="input-fields">
            <label htmlFor="flightNumber"> Flight </label>
            <select
              id="flightNumber"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
            >
              <option> </option>
              {flights &&
                flights.map((flight) => (
                  <option key={flight._id} value={flight._id}>
                    {flight.name}({flight.number}) - {flight.category}
                  </option>
                ))}
            </select>
          </div>
          <div className="input-fields">
            <label htmlFor="departureDate"> Date </label>
            <input
              type="date"
              id="departureDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            />
          </div>
          <button type="submit" className="booking-search-button">
            SEARCH
          </button>
        </form>
      </div>
      <div className="activity-list-container">
        {isMyBooking
          ? searchBookings.isSearched
            ? searchBookings.searchSchedules.map((activity, index) =>
                schedules.map(
                  (schedule) =>
                    schedule._id === activity.scheduleId &&
                    activity.userId === userDetails.users._id && (
                      <ActivityCard
                        activity={activity}
                        schedule={schedule}
                        index={index}
                        type={true}
                        key={index + 1}
                      />
                    )
                )
              )
            : activities &&
              activities.map((activity, index) =>
                schedules.map(
                  (schedule) =>
                    schedule._id === activity.scheduleId && (
                      <ActivityCard
                        activity={activity}
                        schedule={schedule}
                        index={index}
                        type={true}
                        key={index + 1}
                      />
                    )
                )
              )
          : searchBookings.isSearched
          ? searchBookings.searchSchedules.map((activity, index) =>
              schedules.map(
                (schedule) =>
                  schedule._id === activity.scheduleId && (
                    <ActivityCard
                      activity={activity}
                      schedule={schedule}
                      index={index}
                      type={true}
                      key={index + 1}
                    />
                  )
              )
            )
          : allActivities &&
            allActivities.map((activity, index) =>
              schedules.map(
                (schedule) =>
                  schedule._id === activity.scheduleId && (
                    <ActivityCard
                      activity={activity}
                      schedule={schedule}
                      index={index}
                      type={false}
                      key={index + 1}
                    />
                  )
              )
            )}
      </div>
    </section>
  );
}
