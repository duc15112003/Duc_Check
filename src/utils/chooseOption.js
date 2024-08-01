import React from 'react';

const Popup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
<h2 className="text-lg font-bold mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-yellow-500 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M6.938 4.938a9 9 0 0110.124 0 9 9 0 011.684 1.684 9 9 0 010 10.124 9 9 0 01-1.684 1.684 9 9 0 01-10.124 0 9 9 0 01-1.684-1.684 9 9 0 010-10.124 9 9 0 011.684-1.684z"
            />
          </svg>
          Xác nhận
        </h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded mr-2"
            onClick={onCancel}
          >
            Huỷ
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={onConfirm}
          >
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
