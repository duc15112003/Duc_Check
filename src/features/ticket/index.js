// TicketListContainer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketList from './component/TicketList';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../common/headerSlice";
import usePopup from "../../utils/popup/usePopup";
import PopupDone from "../../utils/popup/popupDone";
const TicketListContainer = () => {
    const [tickets, setTickets] = useState([]);
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const dispatch = useDispatch()
    const { isOpen, message, type, showPopup, closePopup } = usePopup();
    useEffect(() => {
        dispatch(setPageTitle({ title : "Vé Tàu"}))
    }, [])
    const fetchTickets = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/tickets', {
                params: { date, page, size },
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.data.result.content.length === 0){
                console.log(response.data)
                showPopup('Không tìm thấy vé !', 'error');
                setTickets([]);
                setTotalPages(0);
                setDate("")
                console.log(response.data.result.content);
            }else{
                setDate("")
                setTickets(response.data.result.content);
                setTotalPages(response.data.result.totalPages);
                console.log(response.data.result.content);
            }

        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };
    const getData = async () => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.get('http://localhost:8080/api/saigonwaterbus/admin/ticketAlls', {
                params: { page, size },
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
            console.log(response.data.result.content);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(()=>{
        getData()
    },[page, size])
    return (
       <div>
           <TicketList
               tickets={tickets}
               date={date}
               setDate={setDate}
               page={page}
               setPage={setPage}
               size={size}
               setSize={setSize}
               totalPages={totalPages}
               fetchTickets={fetchTickets}
               reset={getData}
               showPopup={showPopup}
           />
           <PopupDone isOpen={isOpen} message={message} type={type} onClose={closePopup}/>
       </div>
    );
};

export default TicketListContainer;
