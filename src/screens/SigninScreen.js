import React, { useContext, useReducer, useState } from 'react';
import '../styles/SigninScreen.css';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import Axios from 'axios';
import { getError } from '../Utils';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';

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

export default function SigninScreen() {
  const navigate = useNavigate();

  const { state, dispatch: ctxDispatch } = useContext(Store);

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [isPasswordShow, setPasswordShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.post('https://airlines-be.onrender.com/api/users/sign-in', {
        email,
        password,
      });
      localStorage.setItem('userDetails', JSON.stringify(data));
      ctxDispatch({ type: 'SIGN_IN', payload: data });
      toast.success(data.users.firstname + ' signed in successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
      navigate('/');
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  return (
    <section className="signin-page">
      {loading && <Loading />}
      <div className="signin-container">
        <div className="signin-container-header">Login</div>
        <form className="signin-form" onSubmit={loginHandler}>
          <div className="input-fields">
            <label htmlFor="email">
              Email<span>*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-fields">
            <label htmlFor="password">
              Password<span>*</span>
            </label>
            <input
              type={isPasswordShow ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-fields">
            <input
              type="checkbox"
              id="showPassword"
              onChange={() => setPasswordShow(!isPasswordShow)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          <Link to="/forgot-password">Forgot Password?</Link>
          <button type="submit" className="signin-button">
            LOGIN
          </button>
          <h3>
            Not a member
            <Link to="/signup">Create an account</Link>
          </h3>
        </form>
      </div>
    </section>
  );
}
