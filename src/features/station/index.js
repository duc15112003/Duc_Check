import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import axios from "axios";
import StationList from './components/StationList';
import usePopup from "../../utils/popup/usePopup";
import PopupDone from "../../utils/popup/popupDone";

function StationManager() {
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [stations, setStations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Thêm trạng thái modal
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const { isOpen, message, type, showPopup, closePopup } = usePopup();

    useEffect(() => {
        dispatch(setPageTitle({ title: " Bến tàu " }));
        getStations();
    }, [page, size]);

    const getStations = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/stations?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStations(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
            console.log(response.data.result.content);
        } catch (error) {
            console.error("Error fetching stations:", error);
        }
    };

    const handleCreate = async (newStation) => {
        try {
            const response = await axios.post(`http://localhost:8080/api/saigonwaterbus/admin/station/save`, newStation, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getStations();
                        setIsModalOpen(false)

            showPopup("Tạo bến tàu mới thành công!", "success");
        } catch (error) {
            showPopup("Tạo bến tàu mới thất bại!", "fail");
        }
    };

    const handleUpdate = async (station) => {
        try {
            const response = await axios.put(`http://localhost:8080/api/saigonwaterbus/admin/station/update`, station, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            showPopup("Cập nhật bến tàu thành công!", "success");
            setIsModalOpen(false)
            getStations();
        } catch (error) {
            showPopup("Cập nhật bến tàu thất bại!", "fail");
        }
    };

    const handleDelete = async (idStation) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/saigonwaterbus/admin/station/delete/${idStation}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            getStations();
            showPopup("Xoá bến tàu thành công!", "success");
        } catch (error) {
            showPopup("Xóa bến tàu thất bại!", "fail");
        }
    };

    const handleNextPage = () => {
        if (page < totalPages - 1) {
            setPage(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 0) {
            setPage(page - 1);
        }
    };

    return (
        <div>
            <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />
            <StationList
                stations={stations}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
            <div>
                <div className="flex items-center justify-center space-x-5">
                    <button
                        onClick={handlePrevPage}
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
                        onClick={handlePrevPage}
                        disabled={page === page - 1}
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
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                    <span className="text-lg">{page + 1} / {totalPages}</span>

                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
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
                        onClick={handleNextPage}
                        disabled={page === totalPages - 1}
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
        </div>
    );
}

export default StationManager;
