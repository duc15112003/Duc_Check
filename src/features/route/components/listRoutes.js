import React, { useState } from 'react';

const ListRoutes = ({ routes, stations, handleDeleteRoute, handleUpdateRoute,openForm, setOpenForm}) => {
    const [selectedRoute, setSelectedRoute] = useState(null);

const handleRowClick = (route) => {
    console.log('Selected route:', route);
    setOpenForm(true);
    setSelectedRoute(route);
};


    const closeModal = () => {
    setSelectedRoute(null);
      setOpenForm(false)

    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setSelectedRoute(prevState => {
                let updatedWaypoints;
                if (checked) {
                    updatedWaypoints = [...prevState.waypoints, { station: { id: parseInt(value) } }];
                } else {
                    updatedWaypoints = prevState.waypoints.filter(waypoint => waypoint.station.id !== parseInt(value));
                }
                return {
                    ...prevState,
                    waypoints: updatedWaypoints
                };
            });
        } else if (name === 'fromTerminal' || name === 'toTerminal') {
            setSelectedRoute(prevState => ({
                ...prevState,
                [name]: { id: parseInt(value) }
            }));
        } else {
            setSelectedRoute(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        console.log(selectedRoute);
        const formData = {
            id: selectedRoute.id,
            nameRoute: selectedRoute.nameRoute,
            fromTerminal: {
                id: selectedRoute.fromTerminal.id
            },
            toTerminal: {
                id: selectedRoute.toTerminal.id
            },
            waypoints: selectedRoute.waypoints.map((waypoint, index) => ({
                station: { id: waypoint.station.id },
                stopOrder: index + 1 
            })),
            status: selectedRoute.status
        };
        console.log("data la " + JSON.stringify(formData));
        handleUpdateRoute(formData);
    };
    const handleDeleteRouteInTable=(id)=>{
        handleDeleteRoute(id);
    }
    return (
        <div>
            <table className="min-w-full shadow-md rounded-lg overflow-hidden border-collapse">
                <thead className="bg-sky-500">
                    <tr>
                        <th className="border text-center py-2 px-4">STT</th>
                        <th className="border text-center py-2 px-4">Tên tuyến</th>
                        <th className="border text-center py-2 px-4">Bến đi</th>
                        <th className="border text-center py-2 px-4">Bến dừng</th>
                        <th className="border text-center py-2 px-4">Bến đến</th>
                        <th className="border text-center py-2 px-4">Trạng thái</th>
                        <th className="border text-center py-2 px-4">Tùy chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map((route, index) => (
                        <tr key={route.id} className="cursor-pointer">
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>{index + 1}</td>
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>{route.nameRoute}</td>
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>{route.fromTerminal.name}</td>
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>
                                {route.waypoints.length > 0 ? route.waypoints.map(waypoint => waypoint.station.name).join(', ') : '-'}
                            </td>
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>{route.toTerminal.name}</td>
                            <td className="border px-4 py-2"  onClick={() => handleRowClick(route)}>{route.status === 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}</td>
                            <td className="border px-4 py-2 text-center"  onClick={() => handleDeleteRouteInTable(route.id)}>
                                <button className="px-2 py-1 bg-red-500 text-white rounded hover">
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {openForm && (
                <div className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
                    <form onSubmit={handleUpdate} className="p-4 bg-white border rounded w-1/2">
                        <h2 className="text-center font-bold text-2xl my-4">Chi tiết tuyến tàu</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tên tuyến:</label>
                            <input
                                required
                                name="nameRoute"
                                type="text"
                                value={selectedRoute.nameRoute}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="fromStation" className="block text-gray-700 text-sm font-bold mb-2">Bến đi:</label>
                            <select
                                name="fromTerminal"
                                required
                                value={selectedRoute.fromTerminal.id}
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
                                value={selectedRoute.toTerminal.id}
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
                            <label className="block text-red-700 text-sm font-semibold mb-2">* Các bến dừng đang được hiển thị theo thứ tự lần lượt của chiều đi từ Bạch đằng đến Linh Đông</label>
                            {stations.map((station, index) => (
                                (index !== 0 && index !== stations.length - 1) ? (
                                    <div key={station.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            name={`waypoints-${station.id}`}
                                            value={station.id.toString()}
                                            checked={selectedRoute.waypoints.some(waypoint => waypoint.station.id === station.id)}
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
                                value={selectedRoute.status}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Ngưng hoạt động</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                type="button"
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
            )}
        </div>
    );
};

export default ListRoutes;
