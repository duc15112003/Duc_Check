import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../../common/headerSlice";
import PopupDone from '../../../utils/popup/popupDone';
import usePopup from '../../../utils/popup/usePopup';

const AddCaptainForm = ({setOpenModal,fetchCaptains}) => {
    const token = localStorage.getItem("token");
    const [ships, setShips] = useState([]);
    const dispatch = useDispatch();
    const { isOpen, message, type, showPopup, closePopup } = usePopup();


    useState(() => {
        dispatch(setPageTitle({ title: 'Thêm thuyền trưởng' }));
    }, []);
    const getShip = async () => {
        const response = await axios.get(`http://localhost:8080/api/saigonwaterbus/admin/ship`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setShips(response.data.result);
        console.log(response.data.result)
    };

    useEffect(() => {
        getShip();
    }, []);

    const [captainData, setCaptainData] = useState({
        id: '',
        firstname: '',
        lastname: '',
        phoneNumber: '',
        address: '',
        shipLicense: '',
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: null,
        deletedAt: null,
        shipId: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCaptainData({
            ...captainData,
            [name]: value
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/saigonwaterbus/admin/captain/save', captainData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.data.code !==1004) {
                console.log(response.data.code)
                showPopup('Thêm thuyền trưởng thành công', 'success');
                 setTimeout(() => {
                setOpenModal(false);
                fetchCaptains()
              }, 3000);
            } else {
                  showPopup(response.data.message, 'fail');
            }
        } catch (error) {
            showPopup('Thêm thuyền trưởng thất bại!', 'fail');}
    };


    return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
    
             <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup} />
        <form onSubmit={handleSubmit} className="add-captain-form z-50 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className='text-center font-bold text-2xl my-4'>Thêm thuyền trưởng</h2>

    <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="firstname">
                Họ
            </label>
            <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="firstname"
                type="text"
                name="firstname"
                value={captainData.firstname}
                onChange={handleChange}
                required
            />
        </div>
        <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="lastname">
                Tên
            </label>
            <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="lastname"
                type="text"
                name="lastname"
                value={captainData.lastname}
                onChange={handleChange}
                required
            />
        </div>
    </div>
    <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="phoneNumber">
                Số điện thoại
            </label>
            <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="phoneNumber"
                type="text"
                name="phoneNumber"
                value={captainData.phoneNumber}
                onChange={handleChange}
                required
            />
        </div>
        <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="address">
                Địa chỉ
            </label>
            <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="address"
                type="text"
                name="address"
                value={captainData.address}
                onChange={handleChange}
                required
            />
        </div>
    </div>
    <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="shipLicense">
                Giấy phép tàu
            </label>
            <input
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="shipLicense"
                type="text"
                name="shipLicense"
                value={captainData.shipLicense}
                onChange={handleChange}
                required
            />
        </div>
        <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="status">
                Trạng thái
            </label>
            <select
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="status"
                value={captainData.status}
                onChange={handleChange}
            >
                <option value="ACTIVE">Đang làm việc</option>
                <option value="INACTIVE">Ngưng làm việc</option>
                <option value="SUSPENDED">Tạm dừng làm việc</option>
            </select>
        </div>
    </div>
    <div className="flex flex-wrap -mx-3 mb-2">
        <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="shipId">
                Tàu
            </label>
            <select
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="shipId"
                value={captainData.shipId}
                onChange={handleChange}
                required
            >
                <option value="">Chọn tàu</option>
                {ships.map((ship) => (
                    <option key={ship.id} value={ship.id}>{ship.id}</option>
                ))}
            </select>
        </div>
    </div>
    <div className="flex items-center justify-between">
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Thêm Thuyền Trưởng
        </button>
              <button onClick={() => setOpenModal(false)} className="w-46 px-4 py-2 font-bold text-center text-white bg-gray-500 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline">
        Đóng
      </button>
    </div>
</form>
    </div>


    );
};

export default AddCaptainForm;
