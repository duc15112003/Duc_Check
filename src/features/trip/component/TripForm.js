import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../common/headerSlice';
import PopupDone from '../../../utils/popup/popupDone';
import usePopup from '../../../utils/popup/usePopup';

const AddTripForm = ({ setOpenModal, fetchTrips,showPopup }) => {

    const [routes, setRoutes] = useState([]);
    const [stations, setStations] = useState([]);
    const [ships, setShips] = useState([]);
    const token = localStorage.getItem('token');
    const [formData, setFormData] = useState({
        id: "",
        departureDate: "",
        departureTime: "",
        arrivalTime: "",
        availableSeats: "",
        route: {
            id: ""
        },
        fixed: "",
        fromTerminal: "",
        toTerminal: "",
        status: "",
        ship: {
            id: ""
        }
    });

    const fetchRoutes = async () => {
        const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/routes', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setRoutes(response.data.result.content);
    };

    const fetchStations = async () => {
        const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/stations', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setStations(response.data.result.content);
    };

    const fetchShips = async () => {
        const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/ship', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setShips(response.data.result);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle({ title: 'Chuyến tàu: Thêm Chuyến Tàu' }));
        fetchRoutes();
        fetchStations();
        fetchShips();
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "status") {
            setFormData({
                ...formData,
                status: value,
            });
        } else if (name === "fixed") {
            setFormData({
                ...formData,
                fixed: value,
            });
        } else if (name === "routeId") {
            setFormData({
                ...formData,
                route: { id: value },
            });
        } else if (name === "shipId") {
            setFormData({
                ...formData,
                ship: { id: value },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const create = async (e) => {
        e.preventDefault();
        const response = await axios.post("http://localhost:8080/api/saigonwaterbus/admin/trip/save", formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.data.code === 200) {
            // setOpenModal(false);
            showPopup('Tạo chuyến thành công !', 'success');
            fetchTrips();

            setOpenModal(false);

        } else {
            showPopup(response.data.message, 'fail');
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <form onSubmit={create} className="grid grid-cols-2 gap-6 max-w-3xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="col-span-2">
                    <h2 className="text-center font-bold text-2xl my-4">Thêm chuyến tàu</h2>
                </div>
                <div className="col-span-1">
                                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số ghế trống:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="number"
                            required
                            name="availableSeats"
                            value={formData.availableSeats}
                            onChange={handleChange}
                            placeholder="Số ghế trống"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Thời gian khởi hành:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="time"
                            name="departureTime"
                            required
                            value={formData.departureTime}
                            onChange={handleChange}
                            placeholder="Chọn thời gian khởi hành"
                        />
                    </div>
                </div>

                <div className="col-span-1">
                                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ngày khởi hành:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="date"
                            name="departureDate"
                            required
                            value={formData.departureDate}
                            onChange={handleChange}
                            placeholder="Chọn ngày khởi hành"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Thời gian đến:</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="time"
                            name="arrivalTime"
                            required
                            value={formData.arrivalTime}
                            onChange={handleChange}
                            placeholder="Chọn thời gian đến"
                        />
                    </div>

                </div>

                <div className="col-span-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tuyến:</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="routeId"
                        required
                        value={formData.route.id}
                        onChange={handleChange}
                    >
                        <option value="">Chọn tuyến</option>
                        {routes.map((route) => (
                            <option key={route.id} value={route.id}>
                                {route.nameRoute}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tàu:</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="shipId"
                        value={formData.ship.id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Chọn tàu</option>
                        {ships.map((ship) => (
                            <option key={ship.id} value={ship.id}>
                                {ship.id}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="status"
                        required
                        value={formData.status}
                        onChange={handleChange}
                    >
                        <option value="">Trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Tạm dừng</option>
                    </select>
                </div>

                <div className="col-span-2 mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Chuyến Cố định:</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        name="fixed"
                        required
                        value={formData.fixed}
                        onChange={handleChange}
                    >
                        <option value="">Loại chuyến</option>
                        <option value="FIXED">Cố định</option>
                        <option value="UNSTABLE">Không cố định</option>
                    </select>
                </div>

                <div className="col-span-2 flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Thêm chuyến
                    </button>

                    <button className="bg-gray-300 mx-2 text-black px-4 py-2 rounded" onClick={()=>setOpenModal(false)}>Đóng</button>


                </div>
            </form>
        </div>
    );
};

export default AddTripForm;
