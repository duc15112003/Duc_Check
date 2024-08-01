import { themeChange } from 'theme-change';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import { useAuth } from '../AuthContext';
import Weather from '../service/weather';
function Header() {
  const { isLoggedIn, logout } = useAuth();
  const dispatch = useDispatch();
  const { pageTitle } = useSelector(state => state.header);
  const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('theme'));
  const username = localStorage.getItem('us');

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setCurrentTheme('dark');
      } else {
        setCurrentTheme('light');
      }
    }
  }, [currentTheme]);

  function logoutUser() {
    localStorage.clear();
    window.location.href = '/';
  }

  return (
    <div className="navbar sticky top-0 bg-teal-50 z-10  ">
      <div className=" mx-auto flex justify-between items-center relative">
    
        <span className="text-xl font-semibold text-gray-800">{pageTitle}</span>
      </div>
      <div className="flex-1">
        <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
          <Bars3Icon className="h-5 inline-block w-5" />
        </label>
      </div>

      <div className="flex-none">
              <div className='px-4'> <Weather/></div>
        <label className="swap">
          <SunIcon data-set-theme="light" data-act-class="ACTIVECLASS" className={'fill-current w-6 h-6 ' + (currentTheme === 'dark' ? 'swap-on' : 'swap-off')} />
          <MoonIcon data-set-theme="dark" data-act-class="ACTIVECLASS" className={'fill-current w-6 h-6 ' + (currentTheme === 'light' ? 'swap-on' : 'swap-off')} />
        </label>
                 {isLoggedIn ? (
        <div className="flex items-center px-4">
          <a className="flex items-center hover:text-gray-200" href="/admin/thong-tin-ca-nhan">
          <img alt='' src='/icon/profile.png'/>
           {username}
          </a>
          <button
            className="flex items-center hover:text-gray-200 ml-4"
            onClick={logout}
          >
            Đăng xuất
                                     <img alt='' src='/icon/logout.png' className='w-6 h-5 pl-1 ' />
  
          </button>
        </div>
      ) : (
        <a className="flex items-center hover:text-gray-200" href="/login">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Đăng nhập
        </a>
      )}
      </div>
    </div>
  );
}

export default Header;
