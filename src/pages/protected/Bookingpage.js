import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setPageTitle} from "../../features/common/headerSlice";
import Booking from "../../features/Booking"

function Bookingpage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Cài đặt"}))
    }, [])


    return(
        < Booking/>
    )
}

export default Bookingpage