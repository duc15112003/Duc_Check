import React, { useState } from 'react';

const RouteForm = ({ stations, handleSaveRoute, setOpenAddForm }) => {
    const [formDataAddRoute, setFormDataAddRoute] = useState({
        nameRoute: '',
        fromTerminal: {
            id: ''
        },
        toTerminal: {
            id: ''
        },
        waypoints: [],
        status: '',
        createAt: '',
        updateAt: '',
        deleteAt: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormDataAddRoute((prevState) => {
                let updatedWaypoints;
                if (checked) {
                    updatedWaypoints = [...prevState.waypoints, { station: { id: parseInt(value) }, stopOrder: prevState.waypoints.length + 1 }];
                } else {
                    updatedWaypoints = prevState.waypoints
                        .filter(waypoint => waypoint.station.id !== parseInt(value))
                        .map((waypoint, index) => ({
                            station: waypoint.station,
                            stopOrder: index + 1
                        }));
                }
                return {
                    ...prevState,
                    waypoints: updatedWaypoints
                };
            });
        } else {
            setFormDataAddRoute((prevState) => ({
                ...prevState,
                [name]: name.includes('Terminal') ? { id: parseInt(value) } : value
            }));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const formData = {
            ...formDataAddRoute,
            waypoints: formDataAddRoute.waypoints.map((waypoint, index) => ({
                station: { id: waypoint.station.id },
                stopOrder: index + 1
            }))
        };
        handleSaveRoute(formData);
        console.log("data la " + JSON.stringify(formData));
    };

    return (
        <div className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
            <form onSubmit={handleSave} className="p-4 bg-white border rounded w-1/2">
                <h2 className="text-center font-bold text-2xl my-4">Thêm tuyến tàu</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Tên tuyến:</label>
                    <input
                        required
                        name="nameRoute"
                        type="text"
                        value={formDataAddRoute.nameRoute}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="fromStation" className="block text-gray-700 text-sm font-bold mb-2">Bến đi:</label>
                    <select
                        name="fromTerminal"
                        required
                        value={formDataAddRoute.fromTerminal.id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Chọn bến đi</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bến đến:</label>
                    <select
                        name="toTerminal"
                        value={formDataAddRoute.toTerminal.id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Chọn bến đến</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bến dừng:</label>
                    <label className="block text-gray-700 text-sm font-bold mb-2">* Các bến dừng đang được hiển thị theo chiều đi từ Bạch Đằng đến Linh Đông</label>
                    {stations.map((station, index) => (
                        (index !== 0 && index !== stations.length - 1) ? (
                            <div key={station.id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name={`waypoints-${station.id}`}
                                    value={station.id}
                                    checked={formDataAddRoute.waypoints.some(waypoint => waypoint.station.id === station.id)}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                <label className="mr-2 text-gray-700">{station.name}</label>
                            </div>
                        ) : null
                    ))}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái:</label>
                    <select
                        id="status"
                        name="status"
                        required
                        value={formDataAddRoute.status}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="INACTIVE">Không hoạt động</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => { setOpenAddForm(false) }}
                        className="px-4 py-2 mr-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RouteForm;
