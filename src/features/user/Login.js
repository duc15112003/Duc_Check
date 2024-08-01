import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import LoginService from '../../service/login';

function Login() {
  const { isLoggedIn, login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        window.location.href = '/app/welcome';
      }, 2000); // Chờ 2 giây trước khi chuyển hướng
    }
  }, [isLoggedIn]);

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      username: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setCredentials(prevState => ({
      ...prevState,
      password: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của sự kiện
    try {
      // Gọi hàm login với đối tượng chứa thông tin đăng nhập
      await LoginService.LoginProcess(credentials.username, credentials.password);
      login();
    } catch (error) {
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000); // Chờ 2 giây trước khi ẩn thông báo
      setErrorLogin('Tài khoản hoặc mật khẩu sai');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="LoginPage">
      {showSuccessMessage && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center  bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
            <div className="flex items-center mb-4">
              <svg className="animate-spin h-5 w-5 mr-3 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0c4.418 0 8 3.582 8 8s-3.582 8-8 8v-4H4zm2 5v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H7a1 1 0 00-1 1zm2-9a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1V8z"></path>
              </svg>
              <span className="text-lg font-semibold text-purple-700">Đang đăng nhập...</span>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap min-h-screen w-full content-center justify-center py-10">
        <div className="flex shadow-md">
          <div className="flex flex-wrap content-center justify-center rounded-l-md bg-white" style={{ width: '24rem', height: '32rem' }}>
            <div className="w-80 ">
              <h1 className="text-xl text-center font-semibold mb-4">
                Chào mừng đến với trang quản trị <p className='font-bold text-blue-600'>Saigon Waterbus</p>
              </h1>
              <small className="text-gray-400 block mb-4">Đăng nhập để quản lý</small>
              <div className="text-center mt-2">
                {errorLogin && <span className="font-bold text-xl text-red-500">{errorLogin}</span>}
              </div>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="username" className="block text-sm font-semibold  text-black mb-2">Tài khoản</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Nhập tên tài khoản"
                    className="block w-full rounded-md border   py-1 px-2 " style={{ backgroundColor:"white"}}
                    value={credentials.username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="text-black block text-sm font-semibold mb-2">Mật khẩu</label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    className="block w-full rounded-md border text-black py-1 px-2" style={{ backgroundColor:"white"}}
                    value={credentials.password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="mb-3 flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="mr-2 checked:bg-purple-700"
                  />
                  <label htmlFor="remember" className="text-xs font-semibold text-white">Nhớ mật khẩu</label>
                  <a href="#" className="text-xs font-semibold text-purple-700 ml-auto">Quên mật khẩu?</a>
                </div>
                <div className="mb-3">
                  <button
                    type="submit"
                    className="block w-full text-white bg-blue-600 hover:bg-blue-800 px-4 py-2 rounded-md"
                  >
                    Đăng nhập trang quản trị
                  </button>
                </div>
              </form>

            </div>
          </div>
          <div className="flex flex-wrap content-center justify-center rounded-r-md bg-slate-50" style={{ width: '24rem', height: '32rem' }}>
            <img
              className=" bg-center bg-no-repeat bg-cover rounded-r-md"
              src="/logo.png"
              alt="Background"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
