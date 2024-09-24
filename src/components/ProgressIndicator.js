import React from 'react';

export default function ProgressIndicator({ progress }) {
  return (
    <section className="progress-indicator-container">
      <div
        className={
          progress >= 0 ? 'bar-container active-bar-container' : 'bar-container'
        }
      >
        <h3>Sign-in</h3>
        <div className="progress-line-container">
          <div
            className={
              progress >= 0
                ? 'progress-outer-circle active-progress-outer-circle'
                : 'progress-outer-circle'
            }
          >
            <div
              className={
                progress >= 0
                  ? 'progress-inner-circle active-progress-inner-circle'
                  : 'progress-inner-circle'
              }
            ></div>
          </div>
          <div
            className={
              progress >= 0
                ? 'progress-line active-progress-line'
                : 'progress-line'
            }
          ></div>
        </div>
      </div>
      <div
        className={
          progress >= 1 ? 'bar-container active-bar-container' : 'bar-container'
        }
      >
        <h3>Travel Details</h3>
        <div className="progress-line-container">
          <div
            className={
              progress >= 1
                ? 'progress-outer-circle active-progress-outer-circle'
                : 'progress-outer-circle'
            }
          >
            <div
              className={
                progress >= 1
                  ? 'progress-inner-circle active-progress-inner-circle'
                  : 'progress-inner-circle'
              }
            ></div>
          </div>
          <div
            className={
              progress >= 2
                ? 'progress-line active-progress-line'
                : 'progress-line'
            }
          ></div>
        </div>
      </div>

      <div
        className={
          progress >= 2 ? 'bar-container active-bar-container' : 'bar-container'
        }
      >
        <h3>Ticket Booked</h3>
        <div className="progress-line-container">
          <div
            className={
              progress >= 2
                ? 'progress-outer-circle active-progress-outer-circle'
                : 'progress-outer-circle'
            }
          >
            <div
              className={
                progress >= 2
                  ? 'progress-inner-circle active-progress-inner-circle'
                  : 'progress-inner-circle'
              }
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
