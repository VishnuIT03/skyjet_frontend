import React from 'react';
import '../styles/HomeScreen.css';
import Navbar from '../components/Navbar';
import HomeSlider from '../components/HomeSlider';
import HomeSearch from '../components/HomeSearch';
import BestOffer from '../components/BestOffer';
import BestRoute from '../components/BestRoute';
import PopularRoutes from '../components/PopularRoutes';
import FlightUpdates from '../components/FlightUpdates';
import NewsLetter from '../components/NewsLetter';
import PopAirline from '../components/popaln';

export default function HomeScreen() {
  return (
    <section className="home-page">
      <Navbar />
      <HomeSlider /><br></br><br></br><br></br><br></br>
      <div className="home-search">
        <h1 style={{color:'red',fontSize:'40px',fontWeight:'bolder'}}>Search Flights</h1>
        <HomeSearch />
      </div>
      <BestOffer /><br/><br/>
      {/* <BestRoute />  */}
       {/* <PopularRoutes /> */}
<PopAirline/>
      {/* <FlightUpdates /> */}
      <NewsLetter />
      
    </section>
  );
}
