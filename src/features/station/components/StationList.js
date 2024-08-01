import React, { useState, useEffect } from 'react';

function StationList({ stations, onCreate, onUpdate, onDelete, isModalOpen, setIsModalOpen }) {
    const [isEditing, setIsEditing] = useState(false);
    const [stationData, setStationData] = useState({
        id: null,
        address: null,
        name: '',
        status: '',
        create_at: new Date().toISOString().slice(0, 10),
        update_at: null,
        delete_at: null
    });
    const [searchKeyword, setSearchKeyword] = useState('');

    // const [filteredStations, setFilteredStations] = useState([]);
    const [searchStatus, setSearchStatus] = useState('');

    // useEffect(() => {
    //     setFilteredStations(filterStations());
    // }, [stations, searchKeyword]);


    const getStatus = (status) => {
        switch (status) {
            case "ACTIVE":
                return "Đang hoạt động";
            case "INACTIVE":
                return "Tạm ngưng";
            default:
                return "Không xác định";
        }
    };

    const handleCreateClick = () => {
        setIsEditing(false);
        setStationData({
            id: null,
            address: null,
            name: '',
            status: '',
            create_at: new Date().toISOString().slice(0, 10),
            update_at: null,
            delete_at: null
        });
        setIsModalOpen(true);
    };

    const handleEditClick = (station) => {
        setIsEditing(true);
        setStationData(station);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setStationData({
            id: null,
            address: null,
            name: '',
            status: '',
            create_at: null,
            update_at: null,
            delete_at: null
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (isEditing) {
            onUpdate(stationData);
        } else {
            onCreate(stationData);
        }
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };

    const filteredStations = stations.filter(station => {
        const matchesKeyword = station.name.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesStatus = searchStatus ? station.status === searchStatus : true;
        return matchesKeyword && matchesStatus;
    });
return (
    <div className="container mx-auto my-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center w-3/5 p-2">
                <input
                    type="text"
                    value={searchKeyword}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm bến tàu..."
                    className="border px-4 py-2 w-full"
                />
            </div>
            <div>
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

            <button
                onClick={handleCreateClick}
                className="ml-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            >
                Thêm bến tàu
            </button>
        </div>
        <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
            <thead>
                <tr className='bg-sky-500'>
                    <th className="border  py-2 px-4">ID</th>
                    <th className="border  py-2 px-4">Tên</th>
                    <th className="border  py-2 px-4">Địa chỉ</th>
                    <th className="border  py-2 px-4">Trạng thái</th>
                    <th className="border  py-2 px-4">Hành động</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station) => (
                    <tr key={station.id} className="bg-white border-b">
                        <td className="border py-2 px-4" onClick={() => handleEditClick(station)}>{station.id}</td>
                        <td className="border py-2 px-4" onClick={() => handleEditClick(station)}>{station.name}</td>
                        <td className="border py-2 px-4" onClick={() => handleEditClick(station)}>{station.address}</td>
                        <td className="border px-4 py-2" onClick={() => handleEditClick(station)}>{getStatus(station.status)}</td>
                        <td className="border px-4 py-2 flex justify-center space-x-2">
                            <button
                                onClick={() => onDelete(station.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                            >
                                <span role="img" aria-label="Delete">🗑️</span>
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50" style={{ 'ReactModal__Overlay ReactModal__Overlay--after-open': 'z-100' }}>
                <div className="bg-white p-6 rounded shadow-lg">
                    <h2 className="text-xl font-bold mb-4">
                        {isEditing ? 'Chỉnh sửa bến tàu' : 'Tạo bến tàu mới'}
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label className="block mb-2">Tên</label>
                            <input
                                type="text"
                                value={stationData.name}
                                onChange={(e) => setStationData({ ...stationData, name: e.target.value })}
                                className="border px-4 py-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Địa chỉ</label>
                            <input
                                type="text"
                                value={stationData.address || ''}
                                onChange={(e) => setStationData({ ...stationData, address: e.target.value || null })}
                                className="border px-4 py-2 w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Trạng thái</label>
                            <select
                                value={stationData.status}
                                onChange={(e) => setStationData({ ...stationData, status: e.target.value })}
                                className="border px-4 py-2 w-full"
                            >
                                <option value="ACTIVE">Đang hoạt động</option>
                                <option value="INACTIVE">Không hoạt động</option>
                            </select>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleCloseModal}
                                className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-blue-500 text-white py-2 px-4 rounded"
                            >
                                Cập nhật
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
);

}

export default StationList;
