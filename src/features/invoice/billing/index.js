import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../common/headerSlice';
import { formatDate } from '../../../utils/formatDate';
import { formatCurrencyVND } from '../../../utils/formatVnd';

const InvoiceTable = () => {
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [searchDate, setSearchDate] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Hóa đơn' }));
        fetchInvoices(new Date().toISOString().split('T')[0]);
    }, [dispatch]);

    const token = localStorage.getItem('token');

    const fetchInvoices = async (date, page) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/invoices/${date}?page=${page}&size=10`, {
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
            const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/invoices/${searchDate}`, {
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
                            <div className="flex justify-end mt-4">
                                {totalPages > 1 && (
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button
                                            onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Previous</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M9.707 4.293a1 1 0 0 1 1.414 1.414L7.414 10l3.707 3.293a1 1 0 1 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {[...Array(totalPages).keys()].map((pageNumber) => (
                                            <button
                                                key={pageNumber + 1}
                                                onClick={() => handlePageChange(pageNumber + 1)}
                                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === pageNumber + 1 ? 'z-10 bg-blue-500 text-white border-blue-500' : ''}`}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Next</span>
                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 0 1-1.414-1.414L12.586 10 8.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </nav>
                                )}
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
                        <p><strong>Ngày Cập Nhật:</strong> {selectedInvoice.updateAt ? formatDate(selectedInvoice.updateAt) : 'Không có dữ liệu'}</p>
                        <p><strong>Ngày Xóa:</strong> {selectedInvoice.deleteAt ? formatDate(selectedInvoice.deleteAt) : 'Không có dữ liệu'}</p>
                        <p><strong>Tổng tiền:</strong> {selectedInvoice.totalAmount ? formatCurrencyVND(selectedInvoice.totalAmount) : 'Không có dữ liệu'}</p>
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
