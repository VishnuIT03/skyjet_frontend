import React from 'react';
import '../styles/HomeScreen.css';
import Dwn from '../assets/home_background.jpg';

export default function HomeSlider() {
  return <section className='home-slider-container'>
    <div className="card">
      <div className="content">
        <h2 style={{fontSize:'30px',color:'red',textAlign:'left',paddingTop:"30px"}}>SkyJet Bookings</h2>

        <h4 style={{color:'darkslategrey',textAlign:'left',paddingLeft:'50px',paddingTop:'6px'}}>Make Your travel awesome</h4>
        <p style={{color:'darkslategrey',textAlign:'left',paddingTop:'30px'}}>We believe that the sky is not the limit, It's just the beginning of your journey.We are dedicated to offering a comprehensive range of flights, exceptional service, and unbeatable prices. If you're planning a spontaneous weekend getaway or a well-organized international adventure, SkyJetBookings is your trusted partner.</p>
        <br/><br/><br/>
        <a href="/bookings" className="btn-One">Search Flights</a>
        <a href="/activities" className="btn-One">Your Bookings</a>
      
      </div>
      <img src={Dwn} alt="Card Image" className="image" />

      
    </div>

    
    

  </section>;
}
