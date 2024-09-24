import React, { useState } from 'react';
import '../styles/HomeScreen.css';

export default function NewsLetter() {
  const [email, setEmail] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    alert(email);
  };
  return (
    <section className="flight-newsletter">
      <h3>
        <span>Planning next trip?</span>
        <br></br>Subscribe to our newsletter. Get the latest travel trends &
        deals!
      </h3>
      <form className="flight-newsletter-form" onSubmit={submitHandler}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          required
        />
        <button type="submit" className="newsletter-subscribe-button">
          SUBSCRIBE &nbsp;&nbsp;&nbsp;&nbsp;
          <i className="fa-solid fa-bell fa-shake"></i>
        </button>
      </form>
    </section>
  );
}
