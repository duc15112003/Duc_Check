import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../common/headerSlice';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrencyVND } from '../../../utils/formatVnd';
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/20/solid';
const InvoiceTable = () => {
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchDate, setSearchDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [size, setsize] = useState(10);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Hóa đơn' }));
        console.log(new Date().toISOString().split('T')[0]);
        const date = new Date().toISOString().split('T')[0];
        fetchInvoices(date, 0);
    }, [dispatch]);

    const token = localStorage.getItem('token');

    const fetchInvoices = async (date, page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/invoices/${date}?page=${page}&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSearchResults(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setLoading(false);
        }
    };

    const handleRowClick = (invoice) => {
        setSelectedInvoice(invoice);
    };

    const handleCloseModal = () => {
        setSelectedInvoice(null);
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/invoices/${searchDate}?page=0&size=${size}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSearchResults(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
        } catch (error) {
            console.error('Error searching invoices:', error);
            setSearchResults([]);
            setTotalPages(1);
        }
        setSearchDate('');
    };

    const handleChangeDate = (event) => {
        console.log(event.target.value)
        setSearchDate(event.target.value);
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        fetchInvoices(searchDate, page - 1); // page - 1 because backend uses zero-based indexing
    };

    return (
        <div className="my-4">
            <div className="flex items-center mb-4">
                <input
                    type="date"
                    className="form-input rounded-l-lg py-2 px-4 w-full md:w-72 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    value={searchDate}
                    onChange={handleChangeDate}
                />
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-lg ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </button>
            </div>
            {loading ? (
                <p className="text-center my-8">Đang tải...</p>
            ) : (
                <div className="overflow-x-auto">
                    {searchResults.length === 0 ? (
                        <p className="p-4 text-center">Không có hóa đơn nào được tìm thấy cho ngày này.</p>
                    ) : (
                        <>
                            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden">
                                <thead className="">
                                <tr className='bg-sky-500 text-center'>
                                    <th className="border  py-2 px-4">STT</th>
                                    <th className="border  py-2 px-4">Mã Thanh Toán</th>
                                    <th className="border  py-2 px-4">Ngày Tạo</th>
                                    <th className="border  py-2 px-4">Người đặt</th>
                                    <th className="border  py-2 px-4">Phương thức thanh toán</th>
                                    <th className="border  py-2 px-4">Tổng tiền</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {searchResults.map((invoice, index) => (
                                    <tr
                                        key={invoice.id}
                                        onClick={() => handleRowClick(invoice)}
                                        className="border  py-2 px-4 cursor-pointer"
                                    >
                                        <td className="border  py-2 px-4">{index + 1}</td>
                                        <td className="border  py-2 px-4">{invoice.id}</td>
                                        <td className="border  py-2 px-4">{formatDate(invoice.createAt)}</td>
                                        <td className="border  py-2 px-4">{invoice.email ? invoice.email : 'Tài khoản khách'}</td>
                                        <td className="border  py-2 px-4">{invoice.payMethod === 'BANK_TRANSFER' ? 'Chuyển khoản' : 'Tiền mặt'}</td>
                                        <td className="border  py-2 px-4">{formatCurrencyVND(invoice.totalAmount)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
                                    {currentPage} / {totalPages}
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
                        </>
                    )}
                </div>
            )}
            {selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
                    <div className="bg-white rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4 text-center">Chi Tiết Hóa Đơn</h2>
                        <p><strong>ID:</strong> {selectedInvoice.id}</p>
                        <p><strong>Ngày Tạo:</strong> {formatDate(selectedInvoice.createAt)}</p>
                        <p><strong>Ngày Cập
                            Nhật:</strong> {selectedInvoice.updateAt ? formatDate(selectedInvoice.updateAt) : 'Không có dữ liệu'}
                        </p>
                        <p><strong>Ngày
                            Xóa:</strong> {selectedInvoice.deleteAt ? formatDate(selectedInvoice.deleteAt) : 'Không có dữ liệu'}
                        </p>
                        <p><strong>Tổng
                            tiền:</strong> {selectedInvoice.totalAmount ? formatCurrencyVND(selectedInvoice.totalAmount) : 'Không có dữ liệu'}
                        </p>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvoiceTable;
