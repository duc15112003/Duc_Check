import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import Staff from '../../features/staff/index'

function InternalPage(){
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Nhân viên"}))
      }, [])

    return(
        <Staff />
    )
}

export default InternalPage