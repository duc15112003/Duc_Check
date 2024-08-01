import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../features/common/headerSlice'
import TemplatePointers from '../../features/user/components/TemplatePointers'

function InternalPage(){

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setPageTitle({ title : "Chào mừng!"}))
      }, [])

    return(
      <div className="hero h-full" style={{
  backgroundImage: `url('https://staging.saigonwaterbus.com/wp-content/uploads/2022/06/home-slide-4.jpg')`,
  backgroundSize: 'cover',  // Chỉnh kích thước ảnh nền để phù hợp với kích thước của phần tử
  backgroundPosition: 'center',  // Căn giữa ảnh nền
  backgroundRepeat: 'no-repeat',  // Không lặp lại ảnh nền
}}>
      <div className="hero-content">
        <div className="max-w-md" >
            <TemplatePointers />
        </div>
      </div>
    </div>
    )
}

export default InternalPage