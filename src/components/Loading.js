import React from 'react';
import ReactLoading from 'react-loading';

export default function Loading() {
  return (
    <section className="loading-container">
      <ReactLoading type="cubes" color="#6f6f6f" height={100} width={100} />
    </section>
  );
}
