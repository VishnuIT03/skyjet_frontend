import React from 'react';
import { Link } from 'react-router-dom';

export default function FlightUpdates() {
  return (
    <section className="best-flight-offer-container best-route-container">
      <h1>Flight Updates and News</h1>

      <div className="best-flight-offer-card-container">
        <div className="best-flight-offer-card best-route-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3QZG_ji_DnObJiNB1X91L2JBr5qs6ilcVeA&usqp=CAU"
              alt="image"
            />
            <p>Can We Carry Food in Domestic Flights in India?</p>
            <div className="best-route-detail-container">
              <div className="best-route-detail">
                <h4>05 Aug 2023</h4>
              </div>
              <div className="best-route-detail">
                <Link to="/">READ MORE</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="best-flight-offer-card best-route-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3QZG_ji_DnObJiNB1X91L2JBr5qs6ilcVeA&usqp=CAU"
              alt="image"
            />
            <p>Can We Carry Food in Domestic Flights in India?</p>
            <div className="best-route-detail-container">
              <div className="best-route-detail">
                <h4>05 Aug 2023</h4>
              </div>
              <div className="best-route-detail">
                <Link to="/">READ MORE</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="best-flight-offer-card best-route-card">
          <div className="best-flight-offer-card-image">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3QZG_ji_DnObJiNB1X91L2JBr5qs6ilcVeA&usqp=CAU"
              alt="image"
            />
            <p>Can We Carry Food in Domestic Flights in India?</p>
            <div className="best-route-detail-container">
              <div className="best-route-detail">
                <h4>05 Aug 2023</h4>
              </div>
              <div className="best-route-detail">
                <Link to="/">READ MORE</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
