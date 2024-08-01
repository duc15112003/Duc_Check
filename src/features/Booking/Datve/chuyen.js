import React, { useState, useMemo, useRef} from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ChiTietChuyen from "./tabthongtinchitiet";
import MultiStepForm from "./QuyTrinhDatVe/allstep";
import apiService from "./QuyTrinhDatVe/tripservice";
import DatVe from "./datve";

const selectChuyen = [];
function ChuyenTau() {

const [seatLabels,setSeatLabels]= useState([])

const timGhe = async (event, chuyenId) => {
    if (event) {
        event.preventDefault();
    }
    try {
        const responseData = await apiService.timGhe(chuyenId);
        setSeatLabels(responseData)
    } catch (error) {

        console.error('Error fetching seat labels:', error);
    } 
}

const [startDate, setStartDate] = useState(new Date());
//fetch api
const [listChuyen, setListChuyen]= useState([])
const [message1, setMessage1]= useState('')

const fromRef = useRef();
const toRef = useRef();
const year = startDate.getFullYear();
const month = String(startDate.getMonth() + 1).padStart(2, '0'); // Lưu ý rằng tháng trong JavaScript là từ 0 đến 11
const day = String(startDate.getDate()).padStart(2, '0');
const formattedDate = `${year}-${month}-${day}`;

const timChuyen = async (event) =>{
        // event.preventDefault();
 if (event) {
        event.preventDefault();
    }
const searchParams = {
    from: fromRef.current.value,
    to: toRef.current.value,
    departDate: formattedDate
};

try {
    const data= await apiService.timChuyen(searchParams);
    selectChuyen.push(data)
    setListChuyen(data);
    setMessage1('');

} catch (error) {
   setMessage1('Thông tin tìm kiếm không phù hợp vui lòng kiểm tra lại!');
    setListChuyen([]);
}    
}

const handleToggleOpenSeat = (event, chuyenId) => {
    event.preventDefault();
    setSeatLabels([]); // Đặt lại nhãn ghế khi mở form mới
    timGhe(event, chuyenId); // Xử lý logic tìm ghế (nếu có)
    setOpenTab(false); // Đóng tab nếu có
    
    // Cập nhật trạng thái mở đóng của chuyến tàu
    setOpenSeat(prevState => ({
        ...prevState,
        [chuyenId]: !prevState[chuyenId] // Đảo ngược trạng thái cũ
    }));
};


//tab chit iet chuyen
const [openTab,setOpenTab]= useState(false);
    const [selectedOption, setSelectedOption] = useState('Giờ đi sớm nhất');
    const [openSeat, setOpenSeat] = useState({});

    const options = [
        'Giờ đi sớm nhất',
        'Giờ đi muộn nhất',
        'Giá tăng dần',
        'Giá giảm dần'
    ];

const sortedChuyen = useMemo(() => {
    let sortedList = [...listChuyen];
    switch (selectedOption) {
        case 'Giờ đi sớm nhất':
            sortedList.sort((a, b) => new Date('1970/01/01 ' + a.start_time) - new Date('1970/01/01 ' + b.start_time));
            break;
        case 'Giờ đi muộn nhất':
            sortedList.sort((a, b) => new Date('1970/01/01 ' + b.start_time) - new Date('1970/01/01 ' + a.start_time));
            break;
        case 'Giá tăng dần':
            sortedList.sort((a, b) => a.price - b.price);
            break;
        case 'Giá giảm dần':
            sortedList.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }
    return sortedList;
}, [listChuyen, selectedOption]);

    return (
        <div className="mx-auto container p-4">
        <h1 className="text-center font-bold bg-sky-300 p-4 text-2xl">Trang bán vé tại quầy</h1>
        {/* form tim chuyen */}
<div className="flex justify-center content-center">
    <span className="font-bold text-3xl p-4"> {message1}</span>
        </div>
        <form
              autoComplete="off"
              className="w-full mb-4"
            onSubmit={timChuyen}
            >
              <div className="search-box-content flex w-full flex-wrap gap-4 items-end">
  <div className="flex-1 flex flex-col w-full md:w-1/3 relative">
    <label className="block text-gray-700">Nơi đi</label>
    <div className="flex items-center relative">
      <select
        className="appearance-none w-full p-2 border border-gray-300 rounded pr-10"
        id="inputFrom"
        ref={fromRef}
      >
        <option value="nơi đến" selected disabled hidden>Nhập nơi đi</option>
        <option value="1">Bạch đằng</option>
        <option value="2">Bình an</option>
        <option value="3">Thanh đa</option>
        <option value="4">Hiệp Bình Chánh</option>
        <option value="5">Linh Đông</option>
      </select>
      <img
        decoding="async"
        src="//static.vexere.com/webnx/prod/img/from-v5.svg"
        alt=""
        className="h-8 absolute right-3"
      />
    </div>
    <input id="from" name="from" type="hidden" defaultValue="" />
    <input id="nameFrom" name="nameFrom" type="hidden" />
    <input id="pickupPointDistrict" name="pickupPointDistrict" type="hidden" />
    <input id="pickupPointName" name="pickupPointName" type="hidden" />
    <input id="fromLabel" name="fromLabel" type="hidden" />
  </div>

  <button className="mx-4">
    <img className="swap-area" decoding="async" src="//static.vexere.com/webnx/prod/img/swap-v3.svg" alt="" />
  </button>

  <div className="flex-1 flex flex-col w-full md:w-1/3 relative">
    <label className="block text-gray-700">Nơi đến</label>
    <div className="relative">
      <select
        className="appearance-none w-full p-2 border border-gray-300 rounded pr-10"
        id="inputTo"
        ref={toRef}
      >
        <option value="nơi đến" selected disabled hidden>Nhập nơi đến</option>
        <option value="1" name='bạch đằng'>Bạch đằng</option>
        <option value="2" name='bình an'>Bình an</option>
        <option value="3" name='thanh đa'>Thanh đa</option>
        <option value="4" name='hệp bình chánh'>Hiệp Bình Chánh</option>
        <option value="5" name='linh đông'>Linh Đông</option>
      </select>
      <img
        decoding="async"
        src="//static.vexere.com/webnx/prod/img/to-v5.svg"
        alt=""
        className="h-8 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
      />
    </div>
    <input id="to" name="to" type="hidden" defaultValue="" />
    <input id="nameTo" name="nameTo" type="hidden" />
    <input id="dropoffPointDistrict" name="dropoffPointDistrict" type="hidden" />
    <input id="dropoffPointName" name="dropoffPointName" type="hidden" />
    <input id="toLabel" name="toLabel" type="hidden" />
  </div>

  <div className="flex-1 flex flex-col w-full md:w-1/3 relative">
    <label className="block text-gray-700">Ngày khởi hành</label>
    <div className="flex items-center w-full relative ">
      <DatePicker
        className="p-2 border border-gray-300 rounded w-96" 
        name="departDate"
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
  
      />
      <img
        decoding="async"
        src="//static.vexere.com/webnx/prod/img/date-v5.svg"
        alt=""
        className="h-8 absolute right-12"
      />
    </div>
  </div>

  <div className="flex w-full md:w-auto">
    <button
      className="bg-yellow-500 text-black py-2 px-4 rounded hover:bg-yellow-600"
      type="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6 inline-block mr-2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <span className="inline-block">Tìm vé</span>
    </button>
  </div>
</div>

            </form>
   {sortedChuyen.map(chuyen=> (
    <div className="block border  rounded-lg border-b border-gray-300 shadow-lg mb-2 p-2 pt-4">
    <div key={chuyen.id} className=" w-full   pageChuyen gap-2 flex container mx-auto   mb-4">
        <div className="w-3/12">
            <img className="w-full h-full object-cover rounded-lg max-h-44 p-1" alt="" src="https://static.vexere.com/production/images/1675673512101.jpeg" />
        </div>
        <div className="w-full">
                <div className="flex w-full justify-between">
            <div className=" px-4">
            <h1 className="text-lg font-bold mb-2">Ghế ngồi 75 chỗ</h1>
            <div className="flex items-center mb-2">
                <div className="ghe1 px-2">
                    <svg class="TicketPC__LocationRouteSVG-sc-1mxgwjh-4 dSQflF" xmlns="http://www.w3.org/2000/svg" width="14" height="74" viewBox="0 0 14 74"><path fill="none" stroke="#787878" stroke-linecap="round" stroke-width="2" stroke-dasharray="0 7" d="M7 13.5v46"></path><g fill="none" stroke="#484848" stroke-width="3"><circle cx="7" cy="7" r="7" stroke="none"></circle><circle cx="7" cy="7" r="5.5"></circle></g><path d="M7 58a5.953 5.953 0 0 0-6 5.891 5.657 5.657 0 0 0 .525 2.4 37.124 37.124 0 0 0 5.222 7.591.338.338 0 0 0 .506 0 37.142 37.142 0 0 0 5.222-7.582A5.655 5.655 0 0 0 13 63.9 5.953 5.953 0 0 0 7 58zm0 8.95a3.092 3.092 0 0 1-3.117-3.06 3.117 3.117 0 0 1 6.234 0A3.092 3.092 0 0 1 7 66.95z" fill="#787878"></path></svg>
                </div>
                <div className="chuyen">
                    <h1 className="font-medium">{chuyen.departureTime} ● {chuyen.startTerminal}</h1>
                    <span className="text-xs text-gray-500">32 phút</span>
                    <h1 className="font-medium">{chuyen.arrivalTime} ● {chuyen.endTerminal}</h1>
                </div>
            </div>
                <div className="gap-1">
                    <div className="flex items-center cursor-pointer">
                        <span className="font-medium px-2">Thông tin chi tiết</span>
<button onClick={() => {setOpenTab(prevState => ({ ...prevState, [chuyen.id]: !prevState[chuyen.id] }));setOpenSeat(false);}}> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                            </button>
                    </div>
                    <h1 className="text-sm text-gray-600">Vé chặng thuộc chuyến {chuyen.departureDate} {chuyen.fromTerminal} - {chuyen.toTerminal}</h1>
                </div>
            </div>
            <div className=" flex flex-col items-end justify-between mt-2 p-4">
                <span className="text-xl font-bold text-blue-600">15,000đ</span>
                            <span className="text-lg  mb-2">Còn {chuyen.availableSeats-2} chỗ trống</span>
                        <button 
        onClick={(event) => handleToggleOpenSeat(event, chuyen.id)}
                            className="bg-blue-500 hover:bg-blue-700 w-28 text-white font-bold py-2 px-4 rounded transition" 
                        >
                            {openSeat[chuyen.id] ? 'Đóng lại' : 'Chọn chỗ'}
                        </button>
                        </div>
            </div> 
        </div>
    </div>
{openSeat[chuyen.id] && <MultiStepForm chuyenTau={chuyen} seatLabels={seatLabels} setOpenSeat={setOpenSeat}/>}
<div className="bg-white">
{openTab[chuyen.id] && <ChiTietChuyen/>}

</div>
</div>
))}


        </div>
    );
}

export default ChuyenTau;
