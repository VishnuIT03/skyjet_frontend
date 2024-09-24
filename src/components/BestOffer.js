import React from 'react';
import '../styles/HomeScreen.css';

export default function BestOffer() {
  return (
    <section className="best-flight-offer-container">
      <h1 style={{color:'red',fontSize:'40px',fontWeight:'bolder'}}>Best Tourist Spots</h1>
      <div className="best-flight-offer-card-container">
        <div className="best-flight-offer-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://www.touropia.com/gfx/d/tourist-attractions-in-singapore/marina_bay_sands.jpg"
              alt="image"
            />
            <h3>Singapore</h3><br/>
            <h5>Places to Visit:Bird Paradise,
Orchard Road,
Singapore Flyer</h5><br/><br/>
            <a href="/bookings" className="btn-One">Book Now</a>
          </div>
          
        </div>
        <div className="best-flight-offer-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://assets.traveltriangle.com/blog/wp-content/uploads/2017/02/Malaysia.jpg"
              alt="image"
            />
            <h3>Malaysia</h3><br/>
            <h5>Places to Visit:Kuala Lumpur,Petronas Twin Towers,Batu Caves</h5><br/><br/>
            <a href="/bookings" className="btn-One">Book Now</a>
          </div>
        </div>
        <div className="best-flight-offer-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://assets.traveltriangle.com/blog/wp-content/uploads/2017/02/thailand.jpg"
              alt="image"
            />
            <h3>Thailand</h3><br/>
            <h5>Places to Visit:Temple of the Emerald Buddha,Jim Thompson House,Siam Paragon </h5><br/><br/>
            <a href="/bookings" className="btn-One">Book Now</a>
          </div>
        </div>
      </div>
    </section>
  );
}
