import React from 'react';
import SeatingChart from '../ghetau';

const Step1 = ({ nextStep, clickedSeats, setClickedSeats, chuyenTau, seatLabels,userInfor  }) => {
  if(userInfor){
    console.log(userInfor)
  }else{
        console.log("loidata")

  }
  return (
    <div className='container mx-auto'>
      <SeatingChart seatLabels={seatLabels} clickedSeats={clickedSeats} setClickedSeats={setClickedSeats} chuyenTau={chuyenTau} />
      <div className='flex justify-end'>
        <button
          className={`bg-green-500 text-white font-bold py-2 text-sm px-4 rounded flex items-center ${clickedSeats.length === 0 || clickedSeats === null ? 'disabled bg-slate-100' : ''}`}
          onClick={clickedSeats.length === 0 || clickedSeats === null ? null : nextStep}
        >
          Tiếp tục
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 ml-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Step1;
