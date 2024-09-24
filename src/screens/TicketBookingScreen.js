import React, { useContext, useReducer, useState} from 'react';
import '../styles/TicketBookingScreen.css';
import Navbar from '../components/Navbar';
import ProgressIndicator from '../components/ProgressIndicator';
import { Store } from '../Store';
import { getDate, getError } from '../Utils';
import { useParams ,useNavigate } from 'react-router-dom';
import Axios from 'axios';
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

export default function TicketBookingScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails, flights, airports, schedules } = state;

  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const params = useParams();
  const { schedule: scheduleId } = params;

  const [progress, setProgress] = useState(1);

  const [classType, setClassType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [nationality, setNationality] = useState('');
  const [price,setPrice]=useState('');

  var schedule;
  const findSchedule = () => {
    schedules.map((sch) => {
      if (sch._id === scheduleId) {
        schedule = sch;
      }
    });
  };

  findSchedule();

  var flight;
  const findFlight = () => {
    flights.map((flt) => {
      if (flt._id === schedule.flightId) {
        flight = flt;
      }
    });
  };

  findFlight();

  function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}
  async function checkoutHandler(e) {
    e.preventDefault();
    const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }
    const classno = classType === 'Economy' ? 0 : 1;
    const newValue = schedule.seats[classno].fare;
    
    setPrice(newValue);
    // creating a new order
    const result = await Axios.post('https://airlines-be.onrender.com/custom_pay',{
      amount: newValue
    });

    if (!result) {
        alert("Server error. Are you online?");
        return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
        key: "rzp_test_zpcvSUNJXUqrLv", // Enter the Key ID generated from the Dashboard
        currency: currency,
        name: "SkyJet Bookings",
        description: "Pay ",
        order_id: order_id,
        handler: async function (response) {
            const data = {
                orderCreationId: order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
            };
            bookTicketHandler();
        },
        theme: {
            color: "red",
        },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
}

  const bookTicketHandler = async () => {

    const flightId = flight._id;
    const classno = classType === 'Economy' ? 0 : 1;
    const newValue = schedule.seats[classno].countSeats - 1;
    const seatno = (classno === 0 ? 40 : 20) - newValue;
    
    if (newValue < 0) {
      toast.error(classType + ' no seats available!');
    }
    const seats = [
      {
        class: 'Economy',
        countSeats: Number(schedule.seats[0].countSeats),
        fare: Number(schedule.seats[0].fare),
      },
      {
        class: 'Business',
        countSeats: Number(schedule.seats[1].countSeats),
        fare: Number(schedule.seats[1].fare),
      },
    ];

   
    seats[classno].countSeats = newValue;
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      const { data } = await Axios.put(
        `https://airlines-be.onrender.com/api/schedules/seat/${scheduleId}`,
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
          `https://airlines-be.onrender.com/api/booking/add/${userDetails.users._id}`,
          {
            lastName,
            firstName,
            phone,
            age,
            gender,
            nationality,
            classType,
            seatno,
            flightId,
            scheduleId,
            price:schedule.seats[classno].fare,
          },
          {
            headers: { authorization: `Bearer ${userDetails.token}` },
          }
        );  
        toast.success(
          'You have successfully booked the ' + classType + ' ticket!'
        );
        window.scrollTo(0, 0);
        setProgress(2);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({ type: 'FETCH_FAILED' });
        toast.error(getError(err));
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAILED' });
      toast.error(getError(err));
    }
    navigate('/activities');
  };

  return (
    <section className="ticket-booking-page">
      {loading && <Loading />}
      <Navbar />
      <h1>Ticket Booking</h1>
      <ProgressIndicator progress={progress} />
      <div className="ticket-booking-container">
        <div className="ticket-booking-container-header">
          <div className="ticket-booking-flight-image">
            <img
              src="https://images.ixigo.com/img/common-resources/airline-new/SG.png"
              alt="image"
            />
          </div>
          <h1>{flight.name}</h1>
          <h2>{flight.number}</h2>
          <h3>{flight.category} Flight</h3>
        </div>
        <div className="flight-booking-route-details">
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
                  {seat.class} -{' '}
                  <i className="fa-solid fa-indian-rupee-sign"></i> {seat.fare}
                </h2>
                <p>Available {seat.countSeats} seats</p>
              </div>
            ))}
          </div>
        </div>
        <form className="travel-details-form" onSubmit={checkoutHandler}>
          <div className="travel-details-form-header">
            Fill the passenger's informations correctly!
          </div>
          <div className="input-fields">
            <label htmlFor="classType">
              Class Type<span>*</span>
            </label>
            <select
              id="classType"
              value={classType}
              onChange={(e) => setClassType(e.target.value)}
              required
            >
              <option></option>
              <option value="Economy">Economy</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div className="input-fields">
            <label htmlFor="firstName">
              First Name<span>*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="input-fields">
            <label htmlFor="lastName">
              Last Name<span>*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="input-fields">
            <label htmlFor="phone">
              Phone <span>*</span>
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="input-fields">
            <label htmlFor="age">
              Passenger Age<span>*</span>
            </label>
            <input
              type="text"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          <div className="input-fields">
            <label htmlFor="gender">
              Passenger Gender<span>*</span>
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option></option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="input-fields">
            <label htmlFor="nationality">
              Nationality<span>*</span>
            </label>
            <input
              type="text"
              id="nationality"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              required
            />
          </div>

          <div className="airport-form-button-container">
            <button type="reset" className="airport-cancel-button">
              CANCEL
            </button>
            <button type="submit" className="airport-add-button">
              CONTINUE
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
