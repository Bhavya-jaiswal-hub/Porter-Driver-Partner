import React from 'react';

const RideRequestCard = ({ rideRequest, onAccept, onReject }) => {
  if (!rideRequest) return <p>No new ride requests yet 🚦</p>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
      <h3>🚗 New Ride Request</h3>
      <p><strong>Pickup:</strong> {rideRequest.pickupLocation?.address || '—'}</p>
      <p><strong>Drop:</strong> {rideRequest.dropLocation?.address || '—'}</p>
      <p><strong>Fare:</strong> ₹{rideRequest.fareEstimate || '—'}</p>
      <p><strong>Customer:</strong> {rideRequest.customerName || '—'} ({rideRequest.customerPhone || '—'})</p>
      <button onClick={onAccept} style={{ marginRight: '10px', background: 'green', color: 'white', padding: '10px' }}>
        ✅ Accept
      </button>
      <button onClick={onReject} style={{ background: 'red', color: 'white', padding: '10px' }}>
        ❌ Reject
      </button>
    </div>
  );
};

export default RideRequestCard;
