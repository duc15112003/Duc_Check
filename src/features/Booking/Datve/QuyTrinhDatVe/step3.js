import React, { useState, useEffect } from 'react';
import axios from "axios";
import { formatDate } from '../../../../utils/formatDate';
import { formatCurrencyVND } from '../../../../utils/formatVnd';
import usePopup from '../../../../utils/popup/usePopup';
import PopupDone from '../../../../utils/popup/popupDone';
const Step3 = ({ prevStep, clickedSeats, chuyenTau, setUserInfor, userInfor,setOpenSeat}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    payment: '',
    trip:{
      id:''
    },
    seat:{},
  });

  useEffect(() => {
    // Initialize userDetails only once when the component mounts
    setUserDetails(userInfor);
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value
    }));
  };

  useEffect(() => {
    // Only update userInfor if there are actual changes
    if (JSON.stringify(userInfor) !== JSON.stringify(userDetails)) {
      setUserInfor(userDetails);
    }
  }, [userDetails, setUserInfor]);

    const handlePrint = () => {
        const printContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print</title>
            <style>
              @media print {
                body, html {
                  margin: 0;
                  padding: 0;
                  width: 80mm;
                  height: auto;
                  font-family: Arial, sans-serif;
                  background-color: #fff;
                }
                .container {
                  width: 100%;
                  padding: 10px;
                  box-sizing: border-box;
                }
                h1 {
                  font-size: 24px;
                  color: #4CAF50;
                  text-align: center;
                  border-bottom: 2px solid #4CAF50;
                  padding-bottom: 10px;
                  margin: 0;
                }
                .ticket-info {
                  padding: 10px;
                }
                .ticket-info label {
                  font-weight: bold;
                  display: block;
                  margin: 5px 0;
                  font-size: 14px;
                }
                .ticket-info span {
                  margin-left: 10px;
                  font-weight: normal;
                  color: #555;
                  font-size: 14px;
                }
                .total {
                  font-size: 16px;
                  color: #e74c3c;
                  font-weight: bold;
                  text-align: right;
                  margin-top: 10px;
                }
              }
               body, html {
                  margin: 0;
                  padding: 0;
                  width: 80mm;
                  height: auto;
                  font-family: Arial, sans-serif;
                  background-color: #fff;
                }
                .container {
                  width: 100%;
                  padding: 10px;
                  box-sizing: border-box;
                }
                h1 {
                  font-size: 24px;
                  color: #4CAF50;
                  text-align: center;
                  border-bottom: 2px solid #4CAF50;
                  padding-bottom: 10px;
                  margin: 0;
                }
                .ticket-info {
                  padding: 10px;
                }
                .ticket-info label {
                  font-weight: bold;
                  display: block;
                  margin: 5px 0;
                  font-size: 14px;
                }
                .ticket-info span {
                  margin-left: 10px;
                  font-weight: normal;
                  color: #555;
                  font-size: 14px;
                }
                .total {
                  font-size: 16px;
                  color: #e74c3c;
                  font-weight: bold;
                  text-align: right;
                  margin-top: 10px;
                }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Thông tin vé</h1>
              <div class="ticket-info">
                <label>Họ tên: <span>${userDetails.name}</span></label>
                <label>Email: <span>${userDetails.email}</span></label>
                <label>Số điện thoại: <span>${userDetails.phone}</span></label>
                <label>Phương thức thanh toán: <span>${userDetails.payment}</span></label>
                <label>Chuyến tàu: <span>${chuyenTau.fromTerminal} - ${chuyenTau.toTerminal}</span></label>
                <label>Thời gian khởi hành: <span>${chuyenTau.departureTime} ${formatDate(chuyenTau.departureDate)}</span></label>
                <label>Số ghế: <span>${seatNamesString}</span></label>
                <div class="total">Tổng tiền: <span>${formatCurrencyVND(clickedSeats.length * 15000)}</span></div>
              </div>
            </div>
          </body>
        </html>
    `;

        const printWindow = window.open('', '', 'height=400,width=800');
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
    };


    const seatNamesString = clickedSeats.map(seat => seat.seatName).join(', ');
  const { isOpen, message, type, showPopup, closePopup } = usePopup();
  const handleBookingTicket =async (e) => {
    e.preventDefault()
    setIsLoading(true)
    userDetails.trip=chuyenTau.id;
    userDetails.seat=clickedSeats;
    console.log(userDetails);
    let response='';
        try {
          response=  await axios.post(`http://localhost:8080/api/saigonwaterbus/admin/sell-ticket`, userDetails, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
          if(response.data.code===200){
            setIsLoading(false);
            showPopup("Đã in vé!", "success");
            setOpenSeat(false)
          }else{
                  setIsLoading(false);
                  showPopup(response.data.message, "fail");
            }
        } catch (error) {
            setIsLoading(false);
            showPopup(response.data.message, "fail");
        }

  };

  return (
    <div className="container mx-auto max-w-md mt-10">
            <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />

      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex items-center space-x-2 text-white text-lg">
            <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V2.5"></path>
            </svg>
            <span className='text-base'>Đang tiến hành ghi nhận thông tin đặt vé.Nhân viên lòng đợi trong ít phút trước khi chuyển trang!</span>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-center">Thông tin người đặt</h2>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-semibold">Họ tên *</label>
        <input
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2"
          required
        />
      </div>

<form onSubmit={handleBookingTicket}>
        <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-semibold">Số điện thoại</label>
        <input
          type="tel"
          name="phone"
          value={userDetails.phone}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-semibold">Email *</label>
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2 font-semibold">Phương thức thanh toán</label>
        <select
          name="payment"
          value={userDetails.payment}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:ring-2"
          required
        >
          <option value="BANK_TRANSFER">Chuyển khoản</option>
          <option value="CASH">Tiền mặt </option>
        </select>
      </div>

      <h2 className="text-2xl font-bold text-center mb-2">Thông tin chi tiết vé</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2 font-semibold" value={userDetails.trip}>Chuyến tàu: <span className='text-red-500'>{chuyenTau.fromTerminal} - {chuyenTau.toTerminal}</span></label>
          <label className="block text-gray-700 mb-2 font-semibold">Thời gian khởi hành: {chuyenTau.departureTime} {formatDate(chuyenTau.departureDate)}</label>
          <label className="block text-gray-700 mb-2 font-semibold" value={userDetails.seat}>Số ghế: {seatNamesString}</label>
          <label className="block text-gray-700 mb-2 font-semibold">Tổng tiền: {formatCurrencyVND(clickedSeats.length * 15000)}</label>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-between items-center space-x-4">
        <button
          className="text-sm bg-green-500 hover:bg-green-700 text-white flex-grow font-bold py-2 rounded flex items-center justify-center"
          onClick={prevStep}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 mr-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Quay lại
        </button>
        
        <button
          className="text-sm bg-blue-400 hover:bg-blue-600 text-white flex-grow font-bold py-2 rounded flex items-center justify-center focus:outline-none focus:ring-blue-500 focus:ring-2"
          onClick={handlePrint}
        >
          <img src='/icon/print.png' alt='' className="w-6 h-6 mr-2" />
          In vé
        </button>
      </div>
      </form>
    </div>
  );
};

export default Step3;
