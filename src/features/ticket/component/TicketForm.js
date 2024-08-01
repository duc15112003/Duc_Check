import React, { useState } from 'react';

const TicketForm = ({ addTicket }) => {
    const [id, setId] = useState('');
    const [trainId, setTrainId] = useState('');
    const [status, setStatus] = useState('');
    const [price, setPrice] = useState('');
    const [dateCreated, setDateCreated] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addTicket({ id, trainId, status, price, dateCreated });
        setId('');
        setTrainId('');
        setStatus('');
        setPrice('');
        setDateCreated('');
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-2">
                <label className="block text-sm font-medium">ID hóa đơn</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">ID tàu</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={trainId}
                    onChange={(e) => setTrainId(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Trạng thái của vé</label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Giá thành vé</label>
                <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Ngày tạo</label>
                <input
                    type="date"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={dateCreated}
                    onChange={(e) => setDateCreated(e.target.value)}
                />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Thêm vé</button>
        </form>
    );
};

export default TicketForm;
