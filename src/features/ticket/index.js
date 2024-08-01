// TicketListContainer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketList from './component/TicketList';
import {useDispatch} from "react-redux";
import {setPageTitle} from "../common/headerSlice";

const TicketListContainer = () => {
    const [tickets, setTickets] = useState([]);
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [totalPages, setTotalPages] = useState(0);
    const dispatch = useDispatch()

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
            setTickets(response.data.result.content);
            setTotalPages(response.data.result.totalPages);
            console.log(response.data.result.content);
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
    },[])
    return (
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
        />
    );
};

export default TicketListContainer;
