import React, { useEffect, useState } from "react";
import axios from "axios";
import TripList from "./component/TripList";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import '../../app/css/indexcss.css';
import AddTripForm from "./component/TripForm";
import usePopup from "../../utils/popup/usePopup";
import PopupDone from "../../utils/popup/popupDone";
function Trip() {
   const [trips, setTrips] = useState([]);
   const [searchDate, setSearchDate] = useState("");

   const [error, setError] = useState("");

   const token = localStorage.getItem("token");
   const dispatch = useDispatch();
   const [openModal, setOpenModal] = useState(false);
   const { isOpen, message, type, showPopup, closePopup } = usePopup();

   useEffect(() => {
      dispatch(setPageTitle({ title: "Danh sách chuyến tàu" }));

      fetchTrips();

   }, []);

   const fetchTrips = async () => {
      try {
         const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/trips`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (response.data.result.content.length === 0) {
            setTrips([]);
         } else {
            setTrips(response.data.result.content);
         }
      } catch (error) {

      }
   };

   const SearchTrip = async (date) => {
      try {
         const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/trips/${date}`, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         if (response.data.result.content.length === 0) {
            setTrips([]);
         } else {
            setTrips(response.data.result.content);
         }
      } catch (error) {
      }
   };

   const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      let month = today.getMonth() + 1;
      let day = today.getDate();

      if (month < 10) {
         month = `0${month}`;
      }
      if (day < 10) {
         day = `0${day}`;
      }

      return `${year}-${month}-${day}`;
   };

   const handleSearch = (e) => {
      e.preventDefault();
      const currentDate = new Date(getCurrentDate());
      const selectedDate = new Date(searchDate);

      if (selectedDate < currentDate) {
         setError("Ngày tìm kiếm không được nhỏ hơn ngày hiện tại.");
      } else {
         setError("");
         SearchTrip(searchDate);
      }
   };
   const [searchStatus, setSearchStatus] = useState('');
   const handleSearchStatusChange = (e) => {
      setSearchStatus(e.target.value);
   };
   const filteredTrip = trips.filter(trip => {
      const matchesStatus = searchStatus ? trip.status === searchStatus : true;
      return matchesStatus;
   });

   return (
       <div className="my-4">
          <div className="flex items-center justify-between p-2">
             <form onSubmit={handleSearch} className="flex items-center ">
                <label htmlFor="searchDate" className="text-gray-700 mr-2  text-center font-bold">Tìm chuyến theo ngày:</label>
                <input
                    type="date"
                    id="searchDate"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    min={getCurrentDate()}
                    className="px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />

                <button type="submit" className="ml-2  px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                   Tìm kiếm
                </button>
                <button
                    className="px-4 py-2 mx-2 w-auto  bg-blue-500  text-center text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    onClick={() => fetchTrips}>Làm mới
                </button>
             </form>
             <div className="">
                <label htmlFor="searchStatus" className="mr-2">Chọn trạng thái:</label>
                <select
                    id="searchStatus"
                    value={searchStatus}
                    onChange={handleSearchStatusChange}
                    className="p-2 border rounded"
                >
                   <option value="">Tất cả</option>
                   <option value="ACTIVE">Hoạt động</option>
                   <option value="INACTIVE">Không hoạt động</option>
                </select>
             </div>
             <button className="px-4 py-2 w-2/12 font-bold bg-blue-500  text-center text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                     onClick={()=>setOpenModal(!openModal)}>Thêm chuyến</button>
          </div>



          {openModal &&<AddTripForm setOpenModal={setOpenModal} fetchTrips={fetchTrips} showPopup={showPopup} />}
          <TripList trip={filteredTrip} fetchTrips={fetchTrips} showPopup={showPopup}/>

          <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />

<div className="flex mt-4 justify-center">
                <div className="pagination-buttons space-x-5">
                    <button
                        // onClick={() => handlePageChange(0)}
                        // disabled={page === 0}
                        className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none"
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
                            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
                        </svg>
                    </button>
                    <button
                        // onClick={() => handlePageChange(page - 1)}
                        // disabled={page === 0}
                        className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none"
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

                            <path d="M15 19l-7-7 7-7" />

                        </svg>
                    </button>
                    <span className="px-3 py-2">
                        {/* {page + 1} / {totalPages} */}
                    </span>
                    <button
                        // onClick={() => handlePageChange(page + 1)}
                        // disabled={page === totalPages - 1}
                        className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none"
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
                            <path d="M9 5l7 7-7 7" />

                        </svg>
                    </button>
                    <button
                        // onClick={() => handlePageChange(totalPages - 1)}
                        // disabled={page === totalPages - 1}
                        className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none"
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
                            <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />

                        </svg>
                    </button>
                </div>
            </div>
       </div>
   );
}

export default Trip;
