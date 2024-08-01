
const routes = [

  {
    path: '/admin/trang-chu',
    icon: <img src='/icon/home-button.png' alt=''/>,
    name: 'Trang Chủ',
  },
  {
    path: '', 
    icon: <img src='/icon/staff_1.png' alt=''/>,
    name: 'Nhân Viên', 
    submenu : [
      {
        path: '/admin/nhan-vien',
    icon: <img src='/icon/staff.png' alt=''/>,
        name: 'Nhân Viên', 
      },
      {
        path: '/admin/thuyen-truong',
    icon: <img src='/icon/captain.png' alt=''/>,
        name: 'Thuyền trưởng',
      }
    ]
  },
  {
    path: '/admin/chuyen-tau', // url
    icon: <img src='/icon/boat.png' alt=''/>,
    name: 'Chuyến tàu', 

  },
  {
    path: '/admin/tuyen-tau', 
    icon: <img src='/icon/route.png' alt=''/>,
    name: 'Tuyến tàu', 

  },
    {
    path: '/admin/ben-tau',
    icon: <img src='/icon/train-station.png' alt=''/>,
    name: 'Bến tàu',
  },

  {
    path: '/admin/tau', // url
    icon: <img src='/icon/ship.png' alt=''/>,
    name: 'Tàu',

  },
  {
    path: '/admin/ghe-tau', // url
    icon: <img src='/icon/seats.png' alt=''/>,
    name: 'Ghế tàu', 
  },
  {
    path: '/admin/ve-tau', // url
    icon: <img src='/icon/ticket.png' alt=''/>,
    name: 'Vé tàu', 
  },

  {
    path: '', //no url needed as this has submenu
    icon: <img src='/icon/invoice.png' alt=''/>,
    name: 'Hoá đơn', // name that appear in Sidebar
    submenu : [
      {
        path: '/admin/dat-ve', //url
        icon: <img src='/icon/booking.png' alt=''/>,
        name: 'Đặt Vé', // name that appear in Sidebar
      },
      {
        path: '/admin/hoa-don',
    icon: <img src='/icon/bill.png' alt=''/>,
        name: 'Hóa Đơn',
      },
    ]
  },

  {
    path: '', //no url needed as this has submenu
    icon: <img src='/icon/bar-chart.png' alt=''/>,
    name: 'Thống Kê', // name that appear in Sidebar
    submenu : [
      {
        path: '/admin/dat-ve', //url
        icon: <img src='/icon/business-planning.png' alt=''/>,
        name: 'Thống Kê Doanh Số Theo Ngày', // name that appear in Sidebar
      },
      {
        path: '/admin/hoa-don',
        icon: <img src='/icon/pie-chart.png' alt=''/>,
        name: 'Thống Kê Báo Cáo',
      },
    ]
  },
]

export default routes


