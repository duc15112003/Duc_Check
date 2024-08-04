import React, { useState } from 'react';
import axios from 'axios';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrencyVND } from '../../../utils/formatVnd';

const TicketList = ({ tickets, date, setDate, page, setPage, size, totalPages, fetchTickets, reset, showPopup }) => {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const handleRowClick = async (ticketId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/tickets/${ticketId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedTicket(response.data.result);
            console.log(response.data.result)
            setIsPopupOpen(true);
        } catch (error) {
            console.error('Error fetching ticket details:', error);
        }
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setSelectedTicket(null);
    };
    const getStatus =(statusform) =>{
        switch (statusform) {
            case "ACTIVE":
                return "Kích hoạt";
            case "INACTIVE":
                return "Chưa kích hoạt";
            case "DELETE":
                return "Đã xóa";
            case "BOOKED":
                return "Đã Đặt";
            default:
                return statusform;
        }
    }
    const resetDT = ()=>{
        showPopup('Làm mới thành công !', 'success');
        reset()
    }
    return (
        <div className="container mx-auto p-4">


            <div className="flex items-center my-4">
                <label className='mx-2'>Hiển thị vé theo ngày</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 px-2 py-1 mr-2"
                />
                <button onClick={fetchTickets}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">Tìm
                </button>
                <button onClick={resetDT}
                        className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">reset
                </button>
            </div>


            <table
                className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden bg-white border-collapse">
                <thead className="bg-sky-500 text-white">
                <tr>
                    <th className="border text-left py-2 px-4">STT</th>
                    <th className="border text-left py-2 px-4">Ngày Khởi Hành</th>
                    <th className="border text-left py-2 px-4">Giá vé</th>
                    <th className="border text-left py-2 px-4">Trạng thái vé</th>
                    <th className="border text-left py-2 px-4">Ngày tạo vé</th>
                </tr>
                </thead>
                <tbody>
                {tickets.map((ticket,index) => (
                    <tr key={ticket.id} onClick={() => handleRowClick(ticket.id)}
                        className="cursor-pointer hover:bg-gray-100">
                        <td className="border py-2 px-4">{index + 1}</td>
                        <td className="border py-2 px-4">{ticket.departureDate ? formatDate(ticket.departureDate) : 'Không có'}</td>
                        <td className="border py-2 px-4">{ticket.price}</td>
                        <td className="border py-2 px-4">{getStatus(ticket.status)}</td>
                        <td className="border py-2 px-4">{formatDate(ticket.createAt)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-center">
                <button
                    onClick={() => setPage(0)}
                    className={`px-4 py-2 mx-1 bg-sky-500 text-white rounded`}
                    disabled={page === 0}
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
                        <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                    </svg>
                </button>

                <button
                    onClick={() => setPage(page - 1)}
                    className={`px-4 py-2 mx-1 bg-sky-500 text-white rounded `}
                    disabled={page === 0}
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
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </button>
                <span className="px-3 py-2">
                          {page+1} / {totalPages}
                </span>
                <button
                    onClick={() => setPage(page + 1)}
                    className={`px-4 py-2 mx-1 bg-sky-500 text-white rounded `}
                    disabled={page + 1 >= totalPages}
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
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>

                <button
                    onClick={() => setPage(totalPages - 1)}
                    className={`px-4 py-2 mx-1 bg-sky-500 text-white rounded `}
                    disabled={page === totalPages - 1}
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


            {/* Popup for displaying ticket details */}
            {isPopupOpen && selectedTicket && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2 text-center">Chi Tiết Vé</h2>
        <div className="space-y-2">
            <p className="text-gray-700"><strong>Mã Vé:</strong> {selectedTicket.id}</p>
            <p className="text-gray-700"><strong>Ngày Khởi Hành:</strong> {selectedTicket.departureDate ? formatDate(selectedTicket.departureDate)  : 'không có'}</p>
            <p className="text-gray-700"><strong>Giá:</strong> {formatCurrencyVND(selectedTicket.price) }</p>
            <p className="text-gray-700"><strong>Trạng Thái:</strong> {getStatus(selectedTicket.status)}</p>
            <p className="text-gray-700"><strong>Ngày Tạo:</strong> {formatDate(selectedTicket.createAt)}</p>
            {selectedTicket.seatName && <p className="text-gray-700"><strong>Tên Ghế:</strong> {selectedTicket.seatName}</p>}
            {selectedTicket.tripid && <p className="text-gray-700"><strong>Chuyến:</strong> {selectedTicket.tripid}</p>}
            {selectedTicket.invoiceId && <p className="text-gray-700"><strong>Hóa Đơn:</strong> {selectedTicket.invoiceId}</p>}
        </div>
        <button onClick={closePopup} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none">
            Đóng
        </button>
    </div>
</div>


            )}
        </div>
    );
};

export default TicketList;
