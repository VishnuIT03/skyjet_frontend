import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { toast } from 'react-toastify';

export default function Navbar() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, search } = state;

  const signoutHandler = () => {
    navigate('/');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('activities');
    userDetails.users.userType === 'admin' &&
      localStorage.removeItem('allActivities');
    ctxDispatch({ type: 'SIGN_OUT' });

    toast.success(userDetails.users.firstname + ' signed out successfully!');
  };

  return (
    <nav className="fixed-navbar">
      <div className="navbar-brand">
        <h1> SkyJet Bookings</h1>{' '}
      </div>
      <div className="navbar-items">
        <Link to="/"> Home </Link>{' '}
        {userDetails && userDetails.users.userType !== 'customer' && (
          <Link to="/dashboard"> Dashboard </Link>
        )}{' '}
        <Link
          to="/bookings"
          onClick={() => {
            ctxDispatch({
              type: 'SEARCH',
              payload: { isSearch: false, serchSchedule: [] },
            });
          }}
        >
          Flights{' '}
        </Link>{' '}
        <Link to={userDetails ? '/activities' : '/signin'}> Activities </Link>{' '}
       <a href="/bookings"> <i className="fa-solid fa-magnifying-glass"> </i>{' '}</a>
      </div>
      {userDetails ? (
        <div className="user-profile-container">
          <Link to="/user/profile">
            {' '}
            {userDetails.users.firstname} <i className="fa-solid fa-user"> </i>{' '}
          </Link>{' '}
          <Link to="/" onClick={signoutHandler}>
            Log out{' '}
          </Link>{' '}
        </div>
      ) : (
        <div className="user-profile-container">
          <Link to="/signin"> Log in </Link> <Link to="/signup"> Sign up </Link>{' '}
        </div>
      )}{' '}
    </nav>
  );
}
