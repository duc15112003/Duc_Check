import React, { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../common/headerSlice";
import { formatDate } from '../../../utils/formatDate';
const TicketItem = ({ ticket, updateTicket, deleteTicket }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTicket, setUpdatedTicket] = useState({ ...ticket });

    const handleUpdate = () => {
        updateTicket(updatedTicket);
        setIsEditing(false);
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle({ title: "Vé" }));
    }, [dispatch]);

    return (
        <tr>
            {isEditing ? (
                <>
                    <td className="border p-2"><input type="text" className="w-full p-2 border-gray-300 rounded" value={updatedTicket.id} onChange={(e) => setUpdatedTicket({ ...updatedTicket, id: e.target.value })} disabled /></td>
                    <td className="border p-2"><input type="text" className="w-full p-2 border-gray-300 rounded" value={updatedTicket.trainId} onChange={(e) => setUpdatedTicket({ ...updatedTicket, trainId: e.target.value })} /></td>
                    <td className="border p-2"><input type="text" className="w-full p-2 border-gray-300 rounded" value={updatedTicket.status} onChange={(e) => setUpdatedTicket({ ...updatedTicket, status: e.target.value })} /></td>
                    <td className="border p-2"><input type="number" className="w-full p-2 border-gray-300 rounded" value={updatedTicket.price} onChange={(e) => setUpdatedTicket({ ...updatedTicket, price: e.target.value })} /></td>
                    <td className="border p-2"><input type="date" className="w-full p-2 border-gray-300 rounded" value={updatedTicket.dateCreated} onChange={(e) => setUpdatedTicket({ ...updatedTicket, dateCreated: e.target.value })} /></td>
                    <td className="border p-2">
                        <div className="inline-flex gap-x-2">
                            <button onClick={handleUpdate} className="px-4 py-2 bg-green-500 text-white rounded">Lưu</button>
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Hủy</button>
                        </div>
                    </td>
                </>
            ) : (
                <>
                    <td className="border p-2">{ticket.id}</td>
                    <td className="border p-2">{ticket.trainId}</td>
                        <td className="border p-2">
                        {ticket.status === 'Cancelled' ? 'Đã huỷ' :ticket.status === 'Pending' ? 'Chờ xử lý' :'Đã đặt'}
                        </td>
                    <td className="border p-2">{ticket.price}</td>
                    <td className="border p-2">{formatDate(ticket.dateCreated)}</td>
                    <td className="border p-2">
                        <div className="inline-flex gap-x-2">
                            <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-yellow-500 text-white rounded">Sửa</button>
                            <button onClick={() => deleteTicket(ticket.id)} className="px-4 py-2 bg-red-500 text-white rounded">Xóa</button>
                        </div>
                    </td>
                </>
            )}
        </tr>
    );
};

export default TicketItem;
