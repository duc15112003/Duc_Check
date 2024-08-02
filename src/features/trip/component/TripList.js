import React, { useEffect, useState } from "react";
import axios from "axios";

import { formatDate } from '../../../utils/formatDate';


function TripList({ trip ,fetchTrips,showPopup}) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [stations, setStations] = useState([]);
    const token = localStorage.getItem("token");
    const [ships, setShips] = useState([]);
    const [formData, setFormData] = useState({
        id: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        availableSeats: "",
        route: {
            id: "",
            nameRoute: "",
            fromTerminal: { name: "" },
            toTerminal: { name: "" }
        },
        status: "",
        ship: {
            id: "",
        }
    });

    const openDetail = (item) => {
        setSelectedItem(item);
        setFormData(item);
    };

    const closeDetail = () => {
        setSelectedItem(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRouteChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            route: {
                ...prevData.route,
                [name]: value,
            },
        }));
    };

    const handleShipChange = (e) => {
        const selectedShipId = e.target.value;
        const selectedShip = ships.find(ship => ship.id === parseInt(selectedShipId));
        setFormData((prevData) => ({
            ...prevData,
            ship: selectedShip ? { ...selectedShip } : {
                id: "",
                name: "",
                type: "",
                capacity: "",
                status: "",
                // Reset other relevant fields here
            },
        }));
    };

    const handleUpdateTrip = async () => {
        try {
            console.log("Form data being sent:", formData);
            const response = await axios.put("http://localhost:8080/api/saigonwaterbus/admin/trip/update", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showPopup('Cập nhật chuyến thành công!', 'success');
            closeDetail();
            fetchTrips();
        } catch (error) {
            if (error.response) {

                showPopup('Cập nhật chuyến thất bại!', 'success');
                ;

            } else {
                console.error("Error updating trip:", error);
            }
        }
    };

    const handleDeleteTrip = async (item) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/saigonwaterbus/admin/trip/delete/${item.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            closeDetail();

                        showPopup('Cập nhật chuyến thành công!', 'success');



        } catch (error) {

            alert("Xóa chuyến tàu thất bại");
        }
    };

    const getShips = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/saigonwaterbus/admin/ship", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setShips(response.data.result);
        } catch (error) {
            console.error("Error fetching ships:", error);
        }
    };

    const getStations = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/saigonwaterbus/admin/stations", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStations(response.data.result.content);
        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    useEffect(() => {
        getShips();
        getStations();
    }, []);

    const getStatus = (status) => {
        return status === "ACTIVE" ? "Đang hoạt động" : "Không hoạt động";
    };

    return (

        <>
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden ">
                <thead className="bg-sky-500">
                <tr className="text-center">
                    <th className="border  py-2 px-4">ID</th>
                    <th className="border  py-2 px-4">Ngày khởi hành</th>
                    <th className="border  py-2 px-4">Thời gian khởi hành</th>
                    <th className="border  py-2 px-4">Thời gian đến</th>
                    <th className="border  py-2 px-4">Số ghế trống</th>
                    <th className="border  py-2 px-4">Tuyến đường</th>
                    <th className="border  py-2 px-4">Trạng thái</th>
                    <th className="border  py-2 px-4">Hành động</th>

                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {trip.map((item, index) => (
                    <tr
                        key={item.id}
                        className="hover:bg-gray-100 cursor-pointer"
                    >
                        <td className="border py-2 px-4 " onClick={() => openDetail(item)}>{index + 1}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{formatDate(item.departureDate)}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{item.departureTime}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{item.arrivalTime}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{item.availableSeats}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{item.route.nameRoute}</td>
                        <td className="border py-2 px-4" onClick={() => openDetail(item)}>{getStatus(item.status)}</td>
                        <td className="text-center">
                            <button  onClick={() => handleDeleteTrip(item)} className=" px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none">
                                <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>



            {selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 w-auto">
                        <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
                        <form className="grid grid-cols-3 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">ID</label>
                                <input
                                    type="text"
                                    name="id"
                                    value={formData.id}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                    readOnly
                                />
                            </div>
                                                        <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Số ghế trống</label>
                                <input
                                    type="number"
                                    name="availableSeats"
                                    value={formData.availableSeats}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ngày khởi hành</label>
                                <input
                                    type="date"
                                    name="departureDate"
                                    value={formData.departureDate}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Thời gian khởi hành</label>
                                <input
                                    type="time"
                                    name="departureTime"
                                    value={formData.departureTime}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Thời gian đến</label>
                                <input
                                    type="time"
                                    name="arrivalTime"
                                    value={formData.arrivalTime}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tuyến đường</label>
                                <input
                                    type="text"
                                    name="nameRoute"
                                    value={formData.route.nameRoute}
                                    onChange={handleRouteChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ga đi</label>
                                <input
                                    type="text"
                                    name="fromTerminal"
                                    value={formData.route.fromTerminal.name}
                                    onChange={handleRouteChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Ga đến</label>
                                <input
                                    type="text"
                                    name="toTerminal"
                                    value={formData.route.toTerminal.name}
                                    onChange={handleRouteChange}
                                    className="mt-1 p-2 w-full border rounded"
                                />
                            </div>
                            <div className="mb-4 col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 p-2 w-full border rounded">
                                    <option value="ACTIVE">Đang hoạt động</option>
                                    <option value="INACTIVE">Không hoạt động</option>
                                </select>
                            </div>
                            <div className="mb-4 col-span-3">
                                <label className="block text-sm font-medium text-gray-700">Tàu</label>
                                <select
                                    name="ship"
                                    onChange={handleShipChange}
                                    value={formData.ship.id}
                                    className="mt-1 p-2 w-full border rounded"
                                >
                                    <option value="">Chọn tàu</option>
                                    {ships.map((ship) => (
                                        <option key={ship.id} value={ship.id}>{ship.id}</option>
                                    ))}
                                </select>
                            </div>
                        </form>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateTrip}>Chỉnh sửa</button>
                            <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={closeDetail}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TripList;
