import React, { useEffect, useState } from 'react';
import axios from "axios";
import { formatDate } from '../../../utils/formatDate';
import usePopup from '../../../utils/popup/usePopup';
import PopupDone from '../../../utils/popup/popupDone';
function ShipList() {
    const [ships, setShips] = useState([]);
    const [shipsWithSeats, setShipsWithSeats] = useState([]);
    const token = localStorage.getItem("token");
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(7);
        const { isOpen, message, type, showPopup, closePopup } = usePopup();

    const [totalPages, setTotalPages] = useState(0);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedShip, setSelectedShip] = useState(null);
    const [searchStatus, setSearchStatus] = useState("");
    const [newShip, setNewShip] = useState({
        totalSeats: 0,
        status: "ACTIVE",
        numberPlate: "", // Thêm trường biển số
        createAt: "", // Thêm trường ngày nhập
    });
    const [editShipStatus, setEditShipStatus] = useState("");
    const [deleteShipId, setDeleteShipId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        getShips();
    }, [currentPage, pageSize]);

    const getShips = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/ships?page=${currentPage}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const ships = response.data.result.content;
            setShips(ships);
            setTotalPages(response.data.result.totalPages);

            const shipsWithSeatsPromises = ships.map(async (ship) => {
                const seatCount = await getSeatByID(ship.id);
                return seatCount > 0 ? ship.id : null;
            });

            const shipsWithSeatsResults = await Promise.all(shipsWithSeatsPromises);
            setShipsWithSeats(shipsWithSeatsResults.filter(id => id !== null));
        } catch (error) {
            console.error('Error fetching ships:', error);
        }
    };

    const getSeatByID = async (shipid) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/seat/findcount/${shipid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.result.length;
        } catch (error) {
            console.error('Error fetching seats:', error);
            return 0;
        }
    };

    const getStatus = (status) => {
        return status === "ACTIVE" ? "đang hoạt động" : "không hoạt động";
    };

    const handleRowClick = (ship) => {
        setSelectedShip(ship);
        setIsViewModalOpen(true);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedShip(null);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewShip({
            totalSeats: 0,
            status: "ACTIVE",
            numberPlate: "", // Reset form values
            createAt: "", // Reset form values
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewShip({
            ...newShip,
            [name]: value.toUpperCase() // Chuyển đổi thành chữ hoa và validate theo định dạng VN-1234
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
const handleEditShip = async () => {
        let response=''
        try {
            const data ={
                id: selectedShip.id,
                totalSeats: selectedShip.totalSeats,
                status: editShipStatus,
                createAt: selectedShip.createAt,
                updateAt: new Date().toISOString().slice(0, 10),
                deleteAt: selectedShip.deleteAt,
                numberPlate: selectedShip.numberPlate
            }
             response = await axios.put(`http://localhost:8080/api/saigonwaterbus/admin/ship/update`,data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        if(response.data.code!==1004){
            showPopup("Sửa tàu thành công!", "success");
            getShips();
            closeViewModal();
            }
            else{
            showPopup(response.data.message, "fail");
            }
        } catch (error) {
            showPopup("Sửa tàu thất bại!", "fail");
        }
    };
    const handleAddShip = async () => {
        // Kiểm tra định dạng biển số VN-1234
        const licensePlatePattern = /^[A-Z]{2}-[0-9]{4}$/;
        if (!licensePlatePattern.test(newShip.numberPlate)) {
            alert('Định dạng biển số không hợp lệ. Vui lòng nhập lại theo định dạng VN-1234.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/saigonwaterbus/admin/ship/save`, {
                totalSeats: newShip.totalSeats,
                status: newShip.status,
                createAt: newShip.createAt,
                updateAt: null,
                deleteAt: null,
                numberPlate: newShip.numberPlate
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            window.alert("them thanh cong")
            getShips();
            closeAddModal();
        } catch (error) {
            console.error('Error adding ship:', error);
        }
    };

    const handleDeleteShip = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/saigonwaterbus/admin/ship/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
                    if(response.data.code!==1004){
            showPopup("Xoá tàu thành công!", "success");
            getShips();
            closeViewModal();
            }
            else{
            showPopup("Xoá tàu thất bại!", "fail");
            }
            getShips();
            closeViewModal();
        } catch (error) {
            showPopup("Xoá tàu thất bại!", "fail");
        }
    };

    const CreateSeat = async (id) => {
        try {
            const idShip = id;
            const seatCount = await getSeatByID(idShip);
            console.log(seatCount);
            if (seatCount > 0) {
                window.alert("Không thể thêm ghế vì đã có ghế");
            } else {
                const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/add-seat/${idShip}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.code === 200) {
                    window.alert("Thêm ghế cho tàu thành công");
                } else {
                    window.alert("Thêm ghế cho tàu thất bại");
                }
            }
            getShips();
        } catch (error) {
            console.error('Error adding seats:', error);
            window.alert("Lỗi khi thêm ghế");
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };
 
const filteredShips = ships.filter((ship) => {
    const numberPlate = ship.numberPlate || "";
    const matchesNumberPlate = numberPlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = searchStatus ? ship.status === searchStatus : true;
    return matchesNumberPlate && matchesStatus;
});

    return (
        <div className="container mx-auto p-4">
                    <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />

            <div className="flex justify-between">
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
                <div className="">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo biển số"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="px-4 py-2 border rounded"
                    />
                    <button onClick={openAddModal}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ">
                        Thêm tàu
                    </button>
                </div>

            </div>

            <div className="overflow-x-auto my-2">

                <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden ">
                    <thead className='bg-sky-500'>
                    <tr className="text-center">
                        <th className="border  py-2 px-4">STT</th>
                        <th className="border  py-2 px-4">Tổng ghế</th>
                        <th className="border  py-2 px-4">Trạng thái</th>
                        <th className="border  py-2 px-4">Ngày nhập</th>
                        <th className="border  py-2 px-4">Biển số</th>
                        <th className="border  py-2 px-4">Công Cụ</th>
                    </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredShips.map((ship, index) => (
                        <tr key={ship.id} className="bg-white border-b">
                            <td className="border py-2 px-4"  onClick={() => handleRowClick(ship)}>{index + 1}</td>
                            <td className="border py-2 px-4" onClick={() => handleRowClick(ship)}>{ship.totalSeats}</td>
                            <td className="border py-2 px-4" onClick={() => handleRowClick(ship)}>{getStatus(ship.status)}</td>
                            <td className="border py-2 px-4" onClick={() => handleRowClick(ship)}>{ship.numberPlate}</td>
                            <td className="border py-2 px-4" onClick={() => handleRowClick(ship)}>{formatDate(ship.createAt)}</td>
                            <td className="border py-2 px-4 text-center">
                                <button onClick={() => CreateSeat(ship.id)}
                                        className={`text-indigo-600 hover:text-indigo-900 ${shipsWithSeats.includes(ship.id) && 'text-red-600 hover:text-red-900 cursor-not-allowed'}`}>
                                    Thêm ghế
                                </button>
                                          <button onClick={() => handleDeleteShip(ship.id)}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Xóa tàu
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">

                <button
                    key="first"
                    onClick={() => handlePageChange(0)} // Assuming page index starts from 0
                    disabled={currentPage === 0} // Disable if already on the first page
                    className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
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
                    key="previous"
                    onClick={() => handlePageChange(currentPage - 1)} // Go to previous page
                    disabled={currentPage === 0} // Disable if already on the first page
                    className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
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
                    <span className="flex items-center px-4 py-2">
                    {currentPage + 1} / {totalPages}
                  </span>
                <button
                    key="next"
                    onClick={() => handlePageChange(currentPage + 1)} // Go to next page
                    disabled={currentPage === totalPages - 1} // Disable if already on the last page
                    className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
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
                    key="last"
                    onClick={() => handlePageChange(totalPages - 1)} // Go to last page
                    disabled={currentPage === totalPages - 1} // Disable if already on the last page
                    className="px-3 py-2 bg-sky-500 text-gray-700 rounded-md shadow-md hover:bg-gray-300 focus:outline-none mx-2"
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

            {isViewModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Chi tiết tàu</h3>
                                        <div className="mt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="col-span-2">
                                                    <label htmlFor="numberPlate"
                                                           className="block text-sm font-medium text-gray-700">Biển
                                                        số</label>
                                                    <input
                                                        type="text"
                                                        name="numberPlate"
                                                        id="numberPlate"
                                                        value={selectedShip?.numberPlate || ''}
                                                        onChange={(e) => setSelectedShip({
                                                            ...selectedShip,
                                                            numberPlate: e.target.value
                                                        })}
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="createAt"
                                                           className="block text-sm font-medium text-gray-700">Ngày
                                                        nhập</label>
                                                    <input
                                                        type="date"
                                                        name="createAt"
                                                        id="createAt"
                                                        value={selectedShip?.createAt || ''}
                                                        onChange={(e) => setSelectedShip({
                                                            ...selectedShip,
                                                            createAt: e.target.value
                                                        })}
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label htmlFor="totalSeats"
                                                           className="block text-sm font-medium text-gray-700">Tổng số
                                                        ghế</label>
                                                    <input
                                                        type="number"
                                                        name="totalSeats"
                                                        id="totalSeats"
                                                        value={selectedShip?.totalSeats || ''}
                                                        onChange={(e) => setSelectedShip({
                                                            ...selectedShip,
                                                            totalSeats: e.target.value
                                                        })}
                                                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="col-span-2">
                                                    <label htmlFor="status"
                                                           className="block text-sm font-medium text-gray-700">Trạng
                                                        thái</label>
                                                    <select
                                                        id="status"
                                                        name="status"
                                                        value={editShipStatus}
                                                        onChange={(e) => setEditShipStatus(e.target.value)}
                                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                    >
                                                        <option value="">Chọn tàu</option>
                                                        <option value="ACTIVE">Hoạt động</option>
                                                        <option value="INACTIVE">Không hoạt động</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button onClick={handleEditShip}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Lưu thay đổi
                                </button>
                                <button onClick={closeViewModal} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isAddModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;

                     <div className="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
    <h3 className="text-center text-gray-900 font-bold my-2 text-2xl">Thêm tàu mới</h3>
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="space-y-4">
            <div>
                <label htmlFor="numberPlate" className="block text-sm text-left font-medium text-gray-700">Biển số</label>
                <input
                    type="text"
                    name="numberPlate"
                    id="numberPlate"
                    value={newShip.numberPlate}
                    onChange={handleChange}
                    className="mt-1 block w-full  border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                    placeholder="VD: VN-1234"
                />
            </div>
            <div>
                <label htmlFor="createAt" className="block text-sm text-left font-medium text-gray-700">Ngày nhập</label>
                <input
                    type="date"
                    name="createAt"
                    id="createAt"
                    value={newShip.createAt}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm text-left font-medium text-gray-700">Trạng thái</label>
                <select
                    id="status"
                    name="status"
                    value={newShip.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                >
                    <option value="ACTIVE">Kích hoạt</option>
                    <option value="INACTIVE">Không kích hoạt</option>
                </select>
            </div>
            <div>
                <label htmlFor="totalSeats" className="block text-sm text-left font-medium text-gray-700">Tổng số ghế</label>
                <input
                    type="number"
                    name="totalSeats"
                    id="totalSeats"
                    value={newShip.totalSeats}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 sm:text-sm"
                />
            </div>
        </div>
    </div>
    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
            onClick={handleAddShip}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
            Thêm tàu
        </button>
        <button
            onClick={closeAddModal}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
            Đóng
        </button>
    </div>
</div>

                    </div>
                </div>
            )}

        </div>
    );
}

export default ShipList;
