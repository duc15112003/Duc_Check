import React, { useEffect, useState } from 'react';
import seatService from '../../service/seatService';
import { formatDate } from '../../utils/formatDate';
import Popup from '../../utils/chooseOption';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import axios from "axios";



const TicketManagement = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [ships, setShips] = useState([]);
  const [selectedShipId, setSelectedShipId] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchName, setSearchName] = useState("");
  const fetchShips = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/ships`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      const ships = response.data.result.content;
      setShips(ships);
    } catch (error) {
      console.error('Error fetching ships:', error);
    }
  };

  useEffect(() => {
    dispatch(setPageTitle({ title: "Ghế tàu" }));
    fetchShips();
  }, []);

  const [seats, setSeats] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Start from page 0
  const seatsPerPage = 73;
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState(null); // State to hold the selected seat for confirmation

const handleConfirm = async () => {
  if (selectedSeat) {
    try {
      selectedSeat.status = selectedSeat.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      // Lấy ngày hiện tại và chuyển về định dạng yyyy-mm-dd
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const day = String(now.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;
      
      selectedSeat.updateAt = formattedDate; // Gán ngày hiện tại vào selectedSeat

      await seatService.capNhatGhe(selectedSeat);
    } catch (error) {
      console.error('Error toggling seat status:', error);
    } finally {
      setIsPopupVisible(false);
    }
  }
  console.log('Confirmed action');
};


  const handleCancel = () => {
    setIsPopupVisible(false);
    console.log('Cancelled action');
  };

  const handlePopup = (seat) => {
    setSelectedSeat(seat); // Set the selected seat before showing the popup
    setIsPopupVisible(true);
  };

  const fetchSeats = async (page) => {
    try {
      const response = await seatService.dsGhe(page);
      setSeats(response.content);
      setTotalPages(response.totalPages);
      console.log(response.content);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  useEffect(() => {
    fetchSeats(currentPage);
  }, [currentPage]);

  useEffect(() => {
    console.log('Selected Ship ID:', selectedShipId);
  }, [selectedShipId]);

  const filteredSeats = seats.filter(seat => {
    console.log('Seat ship_id:', seat.ship_id, 'Selected Ship ID:', selectedShipId);
    const matchesKeyword = seat.seatName.toLowerCase().includes(searchName.toLowerCase());
    // const matchesShipid = seat.ship_id.toLowerCase().includes(selectedShipId.toLowerCase());
    const matchesid =selectedShipId ?  seat.ship_id === selectedShipId : true
    const matchstatus =  searchStatus ? seat.status === searchStatus : true;
    return  matchesKeyword&&matchesid&&matchstatus
  });
  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleToggleStatus = (seat) => {
    // Toggle the popup visibility and set the selected seat
    handlePopup(seat);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleShipChange = (e) => {
    console.log('Selected ship:', e.target.value);
    setSelectedShipId(e.target.value);
  };
  const handleSearchStatusChange = (e) => {
    setSearchStatus(e.target.value);
  };
  return (
      <div className="container mx-auto p-4 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center  w-3/5 p-2">
            <span className="text-gray-700 mr-2 w-1/5 text-center font-bold">Tìm kiếm</span>
            <input
                type="text"
                placeholder="Nhập tên ghế..."
                value={searchName}
                onChange={handleSearchNameChange}
            />
          </div>
          <div>
            <label htmlFor="searchStatus" className="mr-2">Chọn trạng thái:</label>
            <select
                id="searchStatus"
                className="p-2 border rounded"
                value={searchStatus}
                onChange={handleSearchStatusChange}
            >
              <option value="">Tất cả</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Không hoạt động</option>
            </select>
          </div>
          <div>
            <label htmlFor="shipSelect" className="mr-2">Chọn tàu:</label>
            <select
                id="shipSelect"
                value={selectedShipId}
                onChange={handleShipChange}
                className="p-2 border rounded"
            >
              <option value="">Chọn tàu</option>
              {ships.map(ship => (
                  <option key={ship.id} value={ship.id}>
                    {ship.id}
                  </option>
              ))}
            </select>
          </div>
        </div>
        {isPopupVisible && (
            <Popup
                message="Xác nhận thay đổi trạng thái ghế?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        )}
        <table className="w-full bg-white">
          <thead>

          <tr className="bg-sky-400 text-center">
            <th className="py-2">STT</th>
            <th className="py-2">Tàu</th>
            <th className="py-2">Trạng thái</th>
            <th className="py-2">Tên ghế</th>

            <th className="py-2">Ngày tạo</th>
            <th className="py-2">Ngày chỉnh sửa</th>
            <th className="py-2">Hành động</th>
          </tr>
          </thead>
          <tbody>
          {filteredSeats.map((seat, index) => (
              <tr key={seat.id} className='text-center'>
                <td className="py-2 px-4 border">{index + 1 + currentPage * seatsPerPage}</td>
                <td className="py-2 px-4 border">{seat.ship_id}</td>
                <td className="py-2 px-4 border">{seat.status === 'ACTIVE' ? 'Đang hoạt động' : 'Bảo trì'}</td>
                <td className="py-2 px-4 border">{seat.seatName}</td>
                <td className="py-2 px-4 border">{formatDate(seat.createAt)}</td>
                <td className="py-2 px-4 border">{seat.updateAt !== null ? formatDate(seat.updateAt) : ''}</td>
                <td className="py-2 px-4 border">
                  <label htmlFor={`toggle-${seat.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                          id={`toggle-${seat.id}`}
                          type="checkbox"
                          onClick={() => handlePopup(seat)}
                          className="sr-only"
                          checked={seat.status === 'ACTIVE'}
                          onChange={() => handleToggleStatus(seat)}
                      />
                      <div className={`w-10 h-4 rounded-full shadow-inner transition-colors ${seat.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div
                          className={`dot absolute w-6 h-6 bg-slate-200 rounded-full shadow -left-1 -top-1 transition-transform ${seat.status === 'ACTIVE' ? 'translate-x-full bg-green-500' : 'bg-red-500'}`}
                      ></div>
                    </div>
                    <div className="ml-3 font-medium">
                      {seat.status === 'ACTIVE' ? 'Bảo trì ghế' : 'Kích hoạt ghế'}
                    </div>
                  </label>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-center">
          <button
              className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0}
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                 viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
            </svg>
          </button>
          <button
              className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                 viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <span className="flex items-center px-4 py-2">
            {currentPage + 1} / {totalPages}
          </span>
          <button
              className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
          >
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                 viewBox="0 0 24 24" height="1em" width="1em">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
          <button
              className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1}
          >
            <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
            >
              <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
            </svg>
          </button>
        </div>
      </div>
  );
};

export default TicketManagement;
