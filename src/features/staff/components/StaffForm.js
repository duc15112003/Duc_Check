import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../common/headerSlice';
import usePopup from '../../../utils/popup/usePopup';
import PopupDone from '../../../utils/popup/popupDone';

// import './style.css';
const AddStaffForm = ({setOpenModal}) => {
    const dispatch = useDispatch();
    const { isOpen, message, type, showPopup, closePopup } = usePopup();

    useEffect(() => {
        dispatch(setPageTitle({ title: 'Thêm nhân viên' }));
    }, [dispatch]);

    const token = localStorage.getItem('token');

    const [captainData, setCaptainData] = useState({
        
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        username: '',
        role: '',
        status: '',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: null,
        deletedAt: null,
    });




    const handleChange = (e) => {
        const { name, value } = e.target;
        setCaptainData({
            ...captainData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("form la",captainData)
            const response = await axios.post('http://localhost:8080/api/saigonwaterbus/admin/staff/save', captainData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if(response.data.code!==1004){
            showPopup('Thêm nhân viên thành công!', 'success');
            setCaptainData({
                firstname: '',
                lastname: '',
                email: '',
                phoneNumber: '',
                username: '',
                role: '',
                status: '',
                createdAt: new Date().toISOString().split('T')[0],
                updatedAt: null,
                deletedAt: null,
            })
              setTimeout(() => {
                setOpenModal(false);
              }, 3000);
                    
            }else{
                showPopup(response.data.message, 'fail');
            }
        } catch (error) {
                showPopup("Thêm thất bại", 'fail');

        }
    };

    return (
      <div className="w-full relative">
  <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} className="z-50 bg-white" />

  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ">
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg relative">
        <h2 className="text-center font-bold text-2xl my-4">Thêm tài khoản nhân viên</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="firstname" className="block mb-2 text-sm font-bold text-gray-700">Họ:</label>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={captainData.firstname}
              onChange={handleChange}
              required
              placeholder="Nhập họ của nhân viên"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastname" className="block mb-2 text-sm font-bold text-gray-700">Tên:</label>
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={captainData.lastname}
              onChange={handleChange}
              required
              placeholder="Nhập tên của nhân viên"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-bold text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={captainData.email}
              onChange={handleChange}
              required
              placeholder="Nhập email của nhân viên"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-bold text-gray-700">Số điện thoại:</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={captainData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Nhập số điện thoại của nhân viên"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 text-sm font-bold text-gray-700">Tên đăng nhập:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={captainData.username}
              onChange={handleChange}
              required
              placeholder="Nhập tên đăng nhập của nhân viên"
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block mb-2 text-sm font-bold text-gray-700">Vai trò:</label>
            <select
              name="role"
              id="role"
              value={captainData.role}
              required
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            >
              <option value="" selected>Chọn vai trò</option>
              <option value="ADMIN">Quản Trị Viên</option>
              <option value="STAFF">Nhân Viên</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block mb-2 text-sm font-bold text-gray-700">Trạng thái:</label>
            <select
              name="status"
              id="status"
              value={captainData.status}
              required
              onChange={handleChange}
              className="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none focus:shadow-outline"
            >
              <option value="" selected>Chọn vai trò</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="INACTIVE">Ngưng hoạt động</option>
            </select>
          </div>
        </div>

        <div className="flex items-center mt-4 space-x-4">
          <button type="submit" className="px-4 w-46 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline">
            Thêm nhân viên
          </button>
          <button onClick={() => setOpenModal(false)} className="w-46 px-4 py-2 font-bold text-center text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline">
            Đóng
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

    );
};

export default AddStaffForm;
