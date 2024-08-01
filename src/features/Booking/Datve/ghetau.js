import {axios} from 'axios';
import React, { useState,useEffect } from 'react';
import apiService from '../Datve/QuyTrinhDatVe/tripservice';
import { formatCurrencyVND } from '../../../utils/formatVnd';

const SeatingChart = ({ chuyenTau, clickedSeats, setClickedSeats, seatLabels }) => {
  const [listSeatBooked, setListSeatBooked] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await apiService.timGheBooked(chuyenTau.id, chuyenTau.departureDate);
        setListSeatBooked(response);
      } catch (error) {
        console.error("Error fetching booked seats", error);
      }
    };

    fetchBookedSeats();
  }, [chuyenTau.id, chuyenTau.departureDate]);

  const handleSeatClick = (seat) => {
    setClickedSeats((prevClickedSeats) => {
      if (prevClickedSeats.length >= 6 && !prevClickedSeats.includes(seat)) {
        return prevClickedSeats;
      } else {
        if (prevClickedSeats.includes(seat)) {
          return prevClickedSeats.filter((clickedSeat) => clickedSeat !== seat);
        } else {
          return [...prevClickedSeats, seat];
        }
      }
    });
  };

  useEffect(() => {
    localStorage.setItem('seatData', JSON.stringify(clickedSeats));
    if (clickedSeats.length >= 6) {
      setNotification('Bạn chỉ có thể chọn tối đa 6 ghế.');
    } else {
      setNotification('');
    }
  }, [clickedSeats, setNotification]);

  const renderSeat = (seat) => {
    const isSelected = clickedSeats.includes(seat);
    const isBooked = listSeatBooked.some(bookedSeat => bookedSeat.seatName === seat.seatName);

    return (
      <div className=''>
        <div
          className={`seat-item available z-max ${isSelected ? 'selected-seat' : ''} ${seat.status === 'ACTIVE' && !isBooked ? '' : 'seat-type-info disabled unavailable'}`}
          key={seat.seatName}
          style={{ fontSize: '10px' }}
        >
          <div className={`relative`}>
            <div
              className="flex items-center justify-center h-12 w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => seat.status === 'ACTIVE' && !isBooked && handleSeatClick(seat)}
            >
              <span
                className={`relative cursor-pointer text-gray-500 font-semibold ${seat.status !== 'ACTIVE' || isBooked ? 'text-transparent' : ''} ${isSelected ? 'text-transparent' : ''}`}
                style={{ fontSize: '10px', lineHeight: '32px', letterSpacing: '0.3px' }}
              >
                {seat.seatName}
              </span>
            </div>
            <div className={`${isSelected ? 'seat-type-info selected' : ''}`} color="#B8B8B8">
              <svg
                width={40}
                height={32}
                viewBox="0 0 40 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="8.75"
                  y="2.75"
                  width="22.5"
                  height="26.5"
                  rx="2.25"
                  fill="#FFFFFF"
                  stroke="#B8B8B8"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <rect
                  x="10.25"
                  y="11.75"
                  width="14.5"
                  height="5.5"
                  rx="2.25"
                  transform="rotate(90 10.25 11.75)"
                  fill="#FFFFFF"
                  stroke="#B8B8B8"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <rect
                  x="35.25"
                  y="11.75"
                  width="14.5"
                  height="5.5"
                  rx="2.25"
                  transform="rotate(90 35.25 11.75)"
                  fill="#FFFFFF"
                  stroke="#B8B8B8"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <rect
                  x="8.75"
                  y="22.75"
                  width="22.5"
                  height="6.5"
                  rx="2.25"
                  fill="#FFFFFF"
                  stroke="#B8B8B8"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  className="icon-selected"
                  d="M20.0002 6.33337C16.3202 6.33337 13.3335 9.32004 13.3335 13C13.3335 16.68 16.3202 19.6667 20.0002 19.6667C23.6802 19.6667 26.6668 16.68 26.6668 13C26.6668 9.32004 23.6802 6.33337 20.0002 6.33337ZM18.6668 16.3334L15.3335 13L16.2735 12.06L18.6668 14.4467L23.7268 9.38671L24.6668 10.3334L18.6668 16.3334Z"
                  fill="transparent"
                />
                <path
                  className="icon-disabled"
                  d="M24.96 9.45992L23.54 8.03992L20 11.5899L16.46 8.03992L15.04 9.45992L18.59 12.9999L15.04 16.5399L16.46 17.9599L20 14.4099L23.54 17.9599L24.96 16.5399L21.41 12.9999L24.96 9.45992Z"
                  fill="transparent"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

const chunkSize = 6;
const seatChunks = [];
for (let i = 0; i < seatLabels.length; i += chunkSize) {
  seatChunks.push(seatLabels.slice(i, i + chunkSize));
}


// render seet
  return (
<div className="container max-w-xl mx-auto border-t border-solid border-gray-300">
  <div className="flex flex-col items-center">
      <div className='flex gap-20 py-2'>
        <div className="seat-type-info available content-center justify-center">
      <div className='flex content-center justify-center'>
                  <svg
            width={40}
            height={32}
            viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="8.75"
              y="2.75"
              width="22.5"
              height="26.5"
              rx="2.25"
              fill="#FFFFFF"
              stroke="#B8B8B8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect
              x="10.25"
              y="11.75"
              width="14.5"
              height="5.5"
              rx="2.25"
              transform="rotate(90 10.25 11.75)"
              fill="#FFFFFF"
              stroke="#B8B8B8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect
              x="35.25"
              y="11.75"
              width="14.5"
              height="5.5"
              rx="2.25"
              transform="rotate(90 35.25 11.75)"
              fill="#FFFFFF"
              stroke="#B8B8B8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect
              x="8.75"
              y="22.75"
              width="22.5"
              height="6.5"
              rx="2.25"
              fill="#FFFFFF"
              stroke="#B8B8B8"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              className="icon-selected"
              d="M20.0002 6.33337C16.3202 6.33337 13.3335 9.32004 13.3335 13C13.3335 16.68 16.3202 19.6667 20.0002 19.6667C23.6802 19.6667 26.6668 16.68 26.6668 13C26.6668 9.32004 23.6802 6.33337 20.0002 6.33337ZM18.6668 16.3334L15.3335 13L16.2735 12.06L18.6668 14.4467L23.7268 9.38671L24.6668 10.3334L18.6668 16.3334Z"
              fill="transparent"
            />
            <path
              className="icon-disabled"
              d="M24.96 9.45992L23.54 8.03992L20 11.5899L16.46 8.03992L15.04 9.45992L18.59 12.9999L15.04 16.5399L16.46 17.9599L20 14.4099L23.54 17.9599L24.96 16.5399L21.41 12.9999L24.96 9.45992Z"
              fill="transparent"
            />
          </svg>
      </div>
          <div className="seat-type-info-value">Còn trống</div>
        </div>
  <div className="seat-type-info unavailable">
      <div className='flex content-center justify-center'>
        <svg
    width={40}
    height={32}
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="8.75"
      y="2.75"
      width="22.5"
      height="26.5"
      rx="2.25"
      fill="#FFFFFF"
      stroke="#B8B8B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect
      x="10.25"
      y="11.75"
      width="14.5"
      height="5.5"
      rx="2.25"
      transform="rotate(90 10.25 11.75)"
      fill="#FFFFFF"
      stroke="#B8B8B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect
      x="35.25"
      y="11.75"
      width="14.5"
      height="5.5"
      rx="2.25"
      transform="rotate(90 35.25 11.75)"
      fill="#FFFFFF"
      stroke="#B8B8B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <rect
      x="8.75"
      y="22.75"
      width="22.5"
      height="6.5"
      rx="2.25"
      fill="#FFFFFF"
      stroke="#B8B8B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      className="icon-selected"
      d="M20.0002 6.33337C16.3202 6.33337 13.3335 9.32004 13.3335 13C13.3335 16.68 16.3202 19.6667 20.0002 19.6667C23.6802 19.6667 26.6668 16.68 26.6668 13C26.6668 9.32004 23.6802 6.33337 20.0002 6.33337ZM18.6668 16.3334L15.3335 13L16.2735 12.06L18.6668 14.4467L23.7268 9.38671L24.6668 10.3334L18.6668 16.3334Z"
      fill="transparent"
    />
    <path
      className="icon-disabled"
      d="M24.96 9.45992L23.54 8.03992L20 11.5899L16.46 8.03992L15.04 9.45992L18.59 12.9999L15.04 16.5399L16.46 17.9599L20 14.4099L23.54 17.9599L24.96 16.5399L21.41 12.9999L24.96 9.45992Z"
      fill="transparent"
    />
  </svg>
      </div>

  <div className="seat-type-info-value">Ghế không bán</div>
</div>
<div class="seat-type-info selected">
    <div className='flex content-center justify-center'>
        <svg width="40" height="32" viewBox="0 0 40 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8.75" y="2.75" width="22.5" height="26.5" rx="2.25" fill="#FFFFFF" stroke="#B8B8B8" stroke-width="1.5" stroke-linejoin="round"></rect><rect x="10.25" y="11.75" width="14.5" height="5.5" rx="2.25" transform="rotate(90 10.25 11.75)" fill="#FFFFFF" stroke="#B8B8B8" stroke-width="1.5" stroke-linejoin="round"></rect><rect x="35.25" y="11.75" width="14.5" height="5.5" rx="2.25" transform="rotate(90 35.25 11.75)" fill="#FFFFFF" stroke="#B8B8B8" stroke-width="1.5" stroke-linejoin="round"></rect><rect x="8.75" y="22.75" width="22.5" height="6.5" rx="2.25" fill="#FFFFFF" stroke="#B8B8B8" stroke-width="1.5" stroke-linejoin="round"></rect><path class="icon-selected" d="M20.0002 6.33337C16.3202 6.33337 13.3335 9.32004 13.3335 13C13.3335 16.68 16.3202 19.6667 20.0002 19.6667C23.6802 19.6667 26.6668 16.68 26.6668 13C26.6668 9.32004 23.6802 6.33337 20.0002 6.33337ZM18.6668 16.3334L15.3335 13L16.2735 12.06L18.6668 14.4467L23.7268 9.38671L24.6668 10.3334L18.6668 16.3334Z" fill="transparent"></path><path class="icon-disabled" d="M24.96 9.45992L23.54 8.03992L20 11.5899L16.46 8.03992L15.04 9.45992L18.59 12.9999L15.04 16.5399L16.46 17.9599L20 14.4099L23.54 17.9599L24.96 16.5399L21.41 12.9999L24.96 9.45992Z" fill="transparent"></path></svg>
    </div>
    
<div class="seat-type-info-value">Đang chọn</div></div>

  

</div>
                    <div className=''>
                              <p className='text-center stroke font-bold'>Mũi tàu</p>

          <img src='/captain.png' className='w-16' alt=''/>
        </div>
              <div className="flex-wrap justify-center  bg-gray-200 " style={{
                background: "#f2f2f2",
                borderTopLeftRadius: "50% 15px",
                borderTopRightRadius: "50% 15px",
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px"
              }}>
<hr/>

  <div className="grid grid-cols-7 gap-3 justify-center py-6 bg-gray-200  px-4 rounded-md shadow-md">

        {seatLabels.map((seat, index) => (
          <React.Fragment key={seat.id}>
            {renderSeat(seat)}
            {/* Add space after every 3 seats, except for positions divisible by 3 or 6 and the last row */}
            {(index < seatLabels.length - 9 || index >= seatLabels.length - 3) && (index + 1) % 3 === 0 && (index + 1) % 6 !== 0 && (
        <>
              <div className="col-span-1">
              </div>
        </>
            )}
          </React.Fragment>
        ))}
</div>
</div>
<div>
</div>

   <div className='text-red-500 font-bold'>
    {notification}
   </div>

    </div>
<div className='container mx-auto flex mt-4'>
  <div className="flex-grow">
    <span className='font-bold'>
      {clickedSeats.length === 0 ? 'Vui lòng chọn ít nhất 1 chỗ ngồi' : `Số ghế: `}
    </span>
        {clickedSeats.map((seat, index) => (
          <span key={seat.id}>{seat.seatName}{index !== clickedSeats.length - 1 && ', '}</span>
        ))}
      </div>
      <div>
        Tổng tiền: {formatCurrencyVND(clickedSeats.length * 15000)}
      </div>
</div>

</div>
  );
};

export default SeatingChart;
