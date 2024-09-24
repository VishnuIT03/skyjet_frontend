import React, { useContext, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../Utils';
import Axios from 'axios';
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

export default function Airport() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, airports } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const [isUpdate, setUpdate] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [airportId, setAirportId] = useState('');
  const [airportCode, setAirportCode] = useState('');
  const [airportName, setAirportName] = useState('');
  const [airportLocation, setAirportLoctaion] = useState('');
  const [airportLocationCode, setAirportLoctaionCode] = useState('');

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

  useEffect(() => {
    fetchAirports();
  }, []);

  const addAirportHandler = async (e) => {
    e.preventDefault();
    setFormOpen(false);
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        'https://airlines-be.onrender.com/api/airport/add',
        {
          airportCode,
          airportName,
          airportLocation,
          airportLocationCode,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('airports', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRPORT', payload: data });
      toast.success(airportName + ' added successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const updateAirportHandler = async (e) => {
    e.preventDefault();
    setFormOpen(false);
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/airport/update/${airportId}`,
        {
          airportCode,
          airportName,
          airportLocation,
          airportLocationCode,
        },
        {
          headers: { authorization: `Bearer ${userDetails.token}` },
        }
      );
      localStorage.setItem('airports', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRPORT', payload: data });
      toast.success(airportName + ' updated successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
      setAirportCode('');
      setAirportName('');
      setAirportLoctaion('');
      setUpdate(false);
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  const updateAirport = (
    airport,
    airportCode,
    airportName,
    airportLocation,
    airportLocationCode
  ) => {
    setUpdate(true);
    setFormOpen(true);
    setAirportId(airport);
    setAirportCode(airportCode);
    setAirportName(airportName);
    setAirportLoctaion(airportLocation);
    setAirportLoctaionCode(airportLocationCode);
  };

  const deleteAirport = async (airport, airportName) => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.get(`https://airlines-be.onrender.com/api/airport/delete/${airport}`, {
        headers: { authorization: `Bearer ${userDetails.token}` },
      });
      localStorage.setItem('airports', JSON.stringify(data));
      ctxDispatch({ type: 'ADD_AIRPORT', payload: data });
      toast.success(airportName + ' removed successfully!');
      dispatch({ type: 'FETCH_SUCCESS' });
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
  };

  return (
    <section className="airport-container">
      {loading && <Loading />}
      <div className="airport-container-header">
        <h3>AIRPORTS</h3>
        <button onClick={() => setFormOpen(true)} className="admin-add-button">
          ADD AIRPORT
        </button>
      </div>
      <div className="airport-list-container">
        {airports &&
          airports.map((airport) => (
            <div className="airport-card" key={airport._id}>
              <div className="airport-card-image">
                <img
                  src="https://www.shutterstock.com/image-photo/airport-many-airplanes-beautiful-sunset-260nw-324754607.jpg"
                  alt="image"
                />
              </div>
              <div className="airport-card-detail">
                <h2>{airport.name}</h2>
                <h3>{airport.code}</h3>
                <h4>
                  {airport.location}({airport.locationCode})
                </h4>
              </div>
              <div className="airport-card-button-container">
                <button
                  onClick={() =>
                    updateAirport(
                      airport._id,
                      airport.code,
                      airport.name,
                      airport.location,
                      airport.locationCode
                    )
                  }
                  className="airport-card-edit-button"
                >
                  EDIT
                </button>
              </div>
            </div>
          ))}
      </div>
      <form
        className={
          isFormOpen
            ? 'add-airport-form active-add-airport-form'
            : 'add-airport-form'
        }
        onSubmit={isUpdate ? updateAirportHandler : addAirportHandler}
      >
        <div className="add-airport-form-header">
          <h3>ADD AIRPORT</h3>
          <i
            onClick={() => {
              setFormOpen(false);
              setAirportCode('');
              setAirportName('');
              setAirportLoctaion('');
              setAirportLoctaionCode('');
            }}
            className="fa-solid fa-xmark"
          ></i>
        </div>
        <div className="input-fields">
          <label htmlFor="airportCode">
            Airport Code<span>*</span>
          </label>
          <input
            type="text"
            id="airportCode"
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value)}
            required
          />
        </div>
        <div className="input-fields">
          <label htmlFor="airportName">
            Airport name<span>*</span>
          </label>
          <input
            type="text"
            id="airportName"
            value={airportName}
            onChange={(e) => setAirportName(e.target.value)}
            required
          />
        </div>
        <div className="input-fields">
          <label htmlFor="airportLocation">
            Airport Location<span>*</span>
          </label>
          <input
            type="text"
            id="airportLocation"
            value={airportLocation}
            onChange={(e) => setAirportLoctaion(e.target.value)}
            required
          />
        </div>
        <div className="input-fields">
          <label htmlFor="airportLocationCode">
            Airport Location Code<span>*</span>
          </label>
          <input
            type="text"
            id="airportLocationCode"
            value={airportLocationCode}
            onChange={(e) => setAirportLoctaionCode(e.target.value)}
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
