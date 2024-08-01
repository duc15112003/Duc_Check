import { useEffect} from "react"
import { useDispatch } from "react-redux"
import { setPageTitle} from "../common/headerSlice"
import ChuyenTau from "./Datve/chuyen";
const Layoutbooking = () => {
const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setPageTitle({ title : "Đặt vé"}))
      }, [])
    return (
        <div className="p-4 ">
           <ChuyenTau className=""/>
        </div>
    );
};
export default Layoutbooking