import socket from '../../socket/socket';

export const acceptRide = (driverId, bookingId, setRespondedBookingIds, clearRide) => {
  socket.emit('acceptRide', { driverId, bookingId });
  setRespondedBookingIds((prev) => [...prev, bookingId]);
  clearRide();
};

export const rejectRide = (bookingId, setRespondedBookingIds, clearRide) => {
  setRespondedBookingIds((prev) => [...prev, bookingId]);
  clearRide();
};
