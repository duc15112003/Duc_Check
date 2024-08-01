import React, { useState, useEffect } from 'react';
import axios from 'axios';
import usePopup from "../../utils/popup/usePopup";
import PopupDone from "../../utils/popup/popupDone";
import RouteForm from './components/routeForm';
import ListRoutes from './components/listRoutes';

const RouteManagement = () => {
    const [originalRoutes, setOriginalRoutes] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [stations, setStations] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const pageSize = 10;

    const token = localStorage.getItem("token");
    const { isOpen, message, type, showPopup, closePopup } = usePopup();
    const [openAddForm, setOpenAddForm] = useState(false);
    const [openUpdateForm, setOpenUpdateForm] = useState(false);

    const fetchRoutes = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/routes?page=${page - 1}&size=${pageSize}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setRoutes(response.data.result.content);
            setOriginalRoutes(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
        } catch (error) {
            console.error('Error fetching routes:', error);
        }
    };

    const fetchStations = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/stations', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStations(response.data.result.content);
        } catch (error) {
            console.error('Error fetching stations:', error);
        }
    };

    useEffect(() => {
        fetchRoutes(currentPage);
        fetchStations();
    }, [currentPage]);

    const handleDeleteRoute = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/saigonwaterbus/admin/route/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            showPopup("Xoá tuyến tàu thành công!", "success");
            fetchRoutes(currentPage);
        } catch (error) {
            showPopup("Xoá tuyến tàu thất bại!", "fail");
        }
    };

    const handleSearchNameChange = (e) => {
        const searchText = e.target.value.toLowerCase();
        setSearchName(searchText);

        const filteredRoutes = originalRoutes.filter(route =>
            route.nameRoute.toLowerCase().includes(searchText)
        );

        setRoutes(filteredRoutes);
        setTotalPages(Math.ceil(filteredRoutes.length / pageSize));
        setCurrentPage(1);
    };

    const handleSearchStatusChange = (e) => {
        const status = e.target.value;
        setSearchStatus(status);

        const filteredRoutes = originalRoutes.filter(route =>
            status === '' || route.status === status
        );

        setRoutes(filteredRoutes);
        setTotalPages(Math.ceil(filteredRoutes.length / pageSize));
        setCurrentPage(1); 
    };

    const handleSaveRoute = async (formDataAdd) => {
        try {
            await axios.post(`http://localhost:8080/api/saigonwaterbus/admin/route/save`, formDataAdd, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOpenAddForm(false);
            fetchRoutes(currentPage);
            showPopup("Thêm tuyến tàu thành công!", "success");
        } catch (error) {
            showPopup("Thêm tuyến tàu thất bại!", "fail");
        }
    };

    const handleUpdateRoute = async (formData) => {
        try {
            await axios.put(`http://localhost:8080/api/saigonwaterbus/admin/route/update`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchRoutes(currentPage);
            showPopup("Cập nhật tuyến tàu thành công!", "success");
            setOpenUpdateForm(false);
        } catch (error) {
            console.error('Error saving route:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="my-4">
            <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />
            <div className="flex items-center justify-between">
                <div className="flex items-center w-3/5 p-2">
                    <span className="text-gray-700 mr-2 w-1/5 text-center font-bold">Tìm kiếm</span>
                    <input
                        type="text"
                        placeholder="Nhập từ khoá trong tên bến tàu..."
                        value={searchName}
                        onChange={handleSearchNameChange}
                        className="px-3 py-2 text-gray-700 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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
                <button                     onClick={() => setOpenAddForm(true)}

                    className="px-4 py-2 w-2/12 font-bold bg-blue-500 text-center text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                    Thêm tuyến tàu
                </button>
            </div>

{openAddForm && <RouteForm stations={stations} setOpenAddForm={setOpenAddForm} openAddForm={openAddForm} handleSaveRoute={handleSaveRoute} />}
<ListRoutes
    routes={routes}
    stations={stations}
    handleUpdateRoute={handleUpdateRoute}
    handleDeleteRoute={handleDeleteRoute}
    openForm={openUpdateForm}
    setOpenForm={setOpenUpdateForm}
/>

            <div className="flex mt-4 justify-center space-x-5">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
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
                            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>
                        </svg>
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                            <path d="M15 19l-7-7 7-7"/>
                        </svg>
                </button>
                <span className="px-4 py-2 mx-1">
                    {currentPage} / {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
                            <path d="M9 5l7 7-7 7"/>
                        </svg>
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
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
                            <path d="M13 7l5 5-5 5M6 7l5 5-5 5"/>
                        </svg>
           
                </button>
            </div>
        </div>
    );
};

export default RouteManagement;
