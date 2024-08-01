import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CaptainList from './components/CaptainList';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../common/headerSlice";
import '../../app/css/indexcss.css';
import AddCaptainForm from './components/CaptainForm';
const CaptainIndex = () => {

    const [captains, setCaptains] = useState([]);
    const [filteredCaptains, setFilteredCaptains] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');
    const token = localStorage.getItem("token");
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);


    useEffect(() => {
        dispatch(setPageTitle({ title: "Thuyền trưởng" }));
        fetchCaptains(currentPage);
    }, [dispatch, currentPage]);

    useEffect(() => {
        filterCaptains(searchKeyword);
    }, [searchKeyword, captains]);

    const [searchStatus, setSearchStatus] = useState('');
    const handleSearchStatusChange = (e) => {
        setSearchStatus(e.target.value);
        filterCaptains(searchKeyword, e.target.value); // Gọi hàm lọc khi trạng thái thay đổi
    };
    const fetchCaptains = async (page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/captains`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: page,
                    size: 10,
                }
            });
            if (response.status === 200) {
                setCaptains(response.data.result.content);
                setTotalPages(response.data.result.totalPages);
            } else {
                alert('Không thể lấy danh sách thuyền trưởng');
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách thuyền trưởng!', error);
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSearchChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const filterCaptains = (query, status) => {
        const filtered = captains.filter(captain => {
            const fieldsToSearch = [
                captain.firstname || '',
                captain.lastname || '',
                captain.phoneNumber || '',
                captain.address || '',
                captain.shipLicense || ''
            ];
            const matchesQuery = fieldsToSearch.some(field => field.toLowerCase().includes(query.toLowerCase()));
            const matchesStatus = status ? captain.status === status : true;
            return matchesQuery && matchesStatus;
        });
        console.log("Filtered Captains: ", filtered); // Debugging statement
        setFilteredCaptains(filtered);
    };


    return (
        <div className="my-4">
        {openModal &&<AddCaptainForm setOpenModal={setOpenModal} fetchCaptains={fetchCaptains} />}
            <div className="flex items-center justify-between ">
                <div className="flex items-center  w-3/5 p-2">
                    <span className="text-gray-700 mr-2 w-1/5 text-center font-bold">Tìm kiếm</span>
                    <input
                        type="text"
                        placeholder="Nhập từ khoá trong họ tên nhân viên"
                        value={searchKeyword}
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
                        <option value="ACTIVE">Đang làm việc</option>
                        <option value="INACTIVE">Ngưng làm việc</option>
                    </select>
                </div>
                <button className="px-4 py-2 w-2/12 font-bold bg-blue-500  text-center text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                         onClick={()=>setOpenModal(!openModal)}>Thêm thuyền trưởng</button>
         

            </div>
            <CaptainList captains={filteredCaptains} fetchCaptains={fetchCaptains}/>
            <div className="flex   mt-4 justify-center">
                <div className="pagination-buttons space-x-5">
                    <button
                        onClick={() => handlePageChange(0)}
                        disabled={currentPage === 0}
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
                        disabled={currentPage === 0}
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
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                    </button>
                                        <span>{currentPage+1}/{totalPages}</span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage + 1 === totalPages}
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
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages - 1)}
                            disabled={currentPage + 1 === totalPages}
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
                            <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
                        </svg>
                    </button>
                </div>
                {/* <div className="pagination-info">
                    <span>Trang {currentPage + 1} của {totalPages}</span>
                </div> */}
            </div>
        </div>
    );
};

export default CaptainIndex;