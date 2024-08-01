import { useEffect} from "react";

import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import ShipList from "./components/ShipList";

function ShipManagerment() {
        const dispatch = useDispatch()

        useEffect(() => {
        dispatch(setPageTitle({ title : "Tàu"}))
      }, [])

    return (
        <>
            <ShipList/>
        </>
    );
}

export default ShipManagerment;

