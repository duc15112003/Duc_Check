import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../features/common/headerSlice';
import axios from 'axios';

function Profile() {
  const [userDetail, setUserDetail] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          "http://localhost:8080/api/saigonwaterbus/profile",
          { headers }
        );
        setUserDetail(response.data.result);
      } catch (error) {
        console.error("Error fetching user detail:", error);
      }
    };

    fetchUserDetail();

  }, []); // Gọi fetchUserDetail một lần khi component mount

  useEffect(() => {
    dispatch(setPageTitle({ title: "Thông tin cá nhân" }));
  }, [dispatch]); // Đặt dispatch là dependency để tránh warning của ESLint

  return (
    <div className="bg-white md:mx-auto rounded shadow-xl w-full overflow-hidden">
                <div className="h-40 md:h-72 relative" style={{
                backgroundImage: `url('https://staging.saigonwaterbus.com/wp-content/uploads/2022/06/home-slide-4.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                }}>
                <img
                    src="/profilevinh.jpg"
                    alt="Admin Avatar"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white"
                />
                </div>

      <div className="px-5 py-4 flex flex-col gap-4">
        <div className="text-center">
          <h3 className="text-2xl text-gray-800 font-bold">Nguyễn Hoàng Vinh</h3>
          <p className="text-sm text-gray-600">Username</p>
        </div>
        <div className="flex justify-center gap-2 flex-wrap">
          <span className="rounded-sm bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">Quản trị viên</span>
          <span className="rounded-sm bg-green-100 px-3 py-1 text-xs font-medium text-green-800">Dev</span>
          <span className="rounded-sm bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">Nhân viên quầy vé</span>
          <span className="rounded-sm bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">Nhân viên sale</span>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-200 rounded-md transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Quản trị {userDetail?.firstname}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-blue-700 rounded-md transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Nhân viên
          </button>
        </div>
        {userDetail && (
          <div className="mt-6">
            <h4 className="text-lg font-medium leading-6 text-gray-800">Thông tin cá nhân</h4>
            <div className="mt-4 bg-white rounded-lg shadow-md">
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <div className="flex items-center mb-3">
                      <p className="w-20 text-sm font-bold text-gray-800">Họ:</p>
                      <input type="text" className="flex-1 border rounded-md px-2 py-1" value={userDetail.firstname} placeholder="Họ của bạn" />
                    </div>
                    <div className="flex items-center mb-3">
                      <p className="w-20 text-sm font-bold text-gray-800">Ngày tạo:</p>
                      <input type="text" className="flex-1 border rounded-md px-2 py-1" value={userDetail.createAt} placeholder="Ngày tạo tài khoản" disabled />
                    </div>
                    <div className="flex items-center mb-3">
                      <p className="w-20 text-sm font-bold text-gray-800">Email:</p>
                      <input type="email" className="flex-1 border rounded-md px-2 py-1" value={userDetail.email} placeholder="Email của bạn" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center mb-3">
                      <p className="w-20 text-sm font-bold text-gray-800">Tên:</p>
                      <input type="text" className="flex-1 border rounded-md px-2 py-1" value={userDetail.lastname} placeholder="Tên của bạn" />
                    </div>
                    <div className="flex items-center mb-3">
                      <p className="w-20 text-sm font-bold text-gray-800">Quyền:</p>
                      <input type="text" className="flex-1 border rounded-md px-2 py-1" value={userDetail.role} placeholder="Quyền của bạn" />
                    </div>
                    <div className="flex items-center">
                      <p className="w-20 text-sm font-bold text-gray-800">SĐT:</p>
                      <input type="tel" className="flex-1 border rounded-md px-2 py-1" value={userDetail.phoneNumber} placeholder="Số điện thoại của bạn" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
