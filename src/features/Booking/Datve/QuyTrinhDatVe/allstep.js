import React, { useMemo, useState } from 'react';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';

const MultiStepForm = ({chuyenTau,dateTrip,seatLabels,setOpenSeat}) => {
  localStorage.setItem('chuyenData', JSON.stringify(chuyenTau));
  const [step, setStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [clickedSeats, setClickedSeats] = useState([]);
  const [userInfor, setUserInfor] = useState({});

  const nextStep = () => {
    setStep(prevStep => prevStep + 1);
    setCompletedSteps([...completedSteps, step]);
  };

  const prevStep = () => {
    setStep(prevStep => prevStep - 1);
    setCompletedSteps(completedSteps.filter(item => item !== step - 1));
  };

  const StepComponent = useMemo(() => {
    switch (step) {
      case 1:
        return <Step1 nextStep={nextStep} chuyenTau={chuyenTau} seatLabels={seatLabels} setClickedSeats={setClickedSeats} clickedSeats={clickedSeats} />;
      case 2:
        return <Step2 nextStep={nextStep} prevStep={prevStep} clickedSeats={clickedSeats}  chuyenTau={chuyenTau}/>;
      case 3:
        return <Step3 prevStep={prevStep} chuyenTau={chuyenTau} clickedSeats={clickedSeats} userInfor={userInfor} setOpenSeat={setOpenSeat} setUserInfor={setUserInfor}/>;
      default:
        return null;
    }
  }, [step, clickedSeats,userInfor,seatLabels]);

  const stepTitles = ['Chọn Chỗ', 'Điểm đón, trả', 'Nhập thông tin khách hàng,kiểm tra vé'];
  return (
    <div className="container mx-auto p-4 h-full">
      <div className="flex justify-center mb-4">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`mx-2 px-4 py-2 ${step === index + 1 ? 'font-bold text-blue-500 border-b-2 border-blue-500' : ''}`}
          >
            {completedSteps.includes(index + 1) ? <span className="mr-1">&#10004;</span> : <span className="mr-1">{index + 1}.</span>}
            {title}
          </div>
        ))}
      </div>
      {StepComponent}
    </div>
  );
};

export default MultiStepForm;
