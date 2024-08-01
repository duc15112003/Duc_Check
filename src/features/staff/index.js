import React, { useEffect, useState } from "react";
import axios from "axios";
import UserTable from "./components/StaffList";
import '../../app/css/indexcss.css';
import AddStaffForm from "./components/StaffForm";
import usePopup from "../../utils/popup/usePopup";
import PopupDone from "../../utils/popup/popupDone";

function Staff() {
    const token = localStorage.getItem("token");
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const { isOpen, message, type, showPopup, closePopup } = usePopup();


    const [searchStatus, setSearchStatus] = useState('');
    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
    };

    const getAdmin = async (page = 0, status = '') => {
        const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/staff1?page=${page}&size=10&status=${status}`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setEmployees(response.data.result.content);
        setTotalPages(response.data.result.totalPages);
    };

    const handleEdit = async (updatedUser) => {
        console.log(updatedUser);
        try {
            const response = await axios.post("http://localhost:8080/api/saigonwaterbus/admin/staff/save", updatedUser, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 200 && response.data.code === 200) {
                alert("Sửa thành công");

                getAdmin(page, searchStatus);  // Fetch updated list of employees

            } else {
                alert("Sửa thất bại");
            }
        } catch (error) {
            console.error('Có lỗi xảy ra khi sửa nhân viên!', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8080/api/saigonwaterbus/admin/staff/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 200 && response.data.code === 200) {
                setEmployees(employees.filter(user => user.id !== id));
                setFilteredEmployees(filteredEmployees.filter(user => user.id !== id));

                getAdmin(page, searchStatus);
                showPopup('Xoá nhân viên thành công!', 'success');
            } else {
                console.error('Failed to delete user', response.data.message);
                showPopup('Xoá nhân viên thất bại!', 'fail');

            }
        } catch (error) {
            showPopup('Xoá nhân viên thất bại!', 'fail');
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        getAdmin(newPage, searchStatus);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        filterEmployees(event.target.value, searchStatus);
    };

    const filterEmployees = (query, status) => {
        const filtered = employees.filter(employee => {
            const name = employee.firstname ? employee.firstname.toLowerCase() : '';
            const lastName = employee.lastname ? employee.lastname.toLowerCase() : '';
            const matchesStatus = status === '' || employee.status === status;

            return matchesStatus && (name.includes(query.toLowerCase()) || lastName.includes(query.toLowerCase()));
        });
        setFilteredEmployees(filtered);
    };

    useEffect(() => {
        getAdmin(page, searchStatus);
    }, [page, searchStatus]);

    useEffect(() => {

        filterEmployees(searchQuery, searchStatus);
    }, [employees, searchQuery, searchStatus]);

    return (
        <div className="my-4">
            <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />
            {openModal && <AddStaffForm setOpenModal={setOpenModal} />}

            <div className="flex items-center justify-between">
                <div className="flex items-center w-3/5 p-2">
                    <span className="text-gray-700 mr-2 w-1/5 text-center font-bold">Tìm kiếm</span>
                    <input
                        type="text"
                        placeholder="Nhập từ khoá trong họ tên nhân viên"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="px-3 py-2 text-gray-700 border border-gray-300 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                </div>

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

                        onClick={() => setOpenModal(!openModal)}>Thêm nhân viên</button>

            </div>
            <UserTable data={filteredEmployees} onDelete={handleDelete} fetAdmin={getAdmin} onEdit={handleEdit} />
            <div className="flex mt-4 justify-center">
                <div className="pagination-buttons space-x-5">
                    <button
                        onClick={() => handlePageChange(0)}
                        disabled={page === 0}
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
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
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
                        {page + 1} / {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
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
                            <path d="M9 5l7 7-7 7" />

                        </svg>
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages - 1)}
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
                            <path d="M13 7l5 5-5 5M6 7l5 5-5 5" />

                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Staff;
