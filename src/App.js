import { Route, Routes } from 'react-router-dom';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SigninScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import BookingScreen from './screens/BookingScreen';
import TicketBookingScreen from './screens/TicketBookingScreen';
import ActivityScreen from './screens/ActivityScreen';
import { useContext } from 'react';
import { Store } from './Store';
// import RazorpayPayment from './components/payment';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userDetails } = state;
  return (
    <div className="App">
      <ToastContainer position="top-right" limit={1} />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        {!userDetails && <Route path="/signin" element={<SigninScreen />} />}
        {!userDetails && <Route path="/signup" element={<SignupScreen />} />}
        {userDetails && userDetails.users.userType === 'admin' && (
          <Route path="/dashboard" element={<DashboardScreen />} />
        )}
        {userDetails && userDetails.users.userType === 'admin' && (
          <Route path="/dashboard/:airline" element={<DashboardScreen />} />
        )}
        <Route path="/bookings" element={<BookingScreen />} />
        <Route path="/bookings/:schedule" element={<TicketBookingScreen />} />
        {userDetails && (
          <Route path="/activities" element={<ActivityScreen />} />
        )}
        

{/* <Route path="/razorpay/:classType/:fare" component={RazorpayPayment} /> */}
     
      </Routes>
    </div>
  );
}

export default App;
