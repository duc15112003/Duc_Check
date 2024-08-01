import { Link } from "react-router-dom"

function TemplatePointers(){
    return(
      <div className=" flex items-center justify-center " > 
      <div className="max-w-2xl p-6  shadow-md rounded-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Chào mừng bạn đến với Trang quản trị website SaiGonWaterBus</h1>
        <p className="text-lg text-white mb-4">Đây là trang chào mừng cho admin khi đăng nhập vào hệ thống.</p>
        <p className="text-lg text-white mb-4">Bạn có thể bắt đầu bằng cách lựa chọn các mục bên trái màn hình.</p>
        <div className="flex justify-center">
            <Link to="/app/dashboard"><button className="btn bg-base-100 btn-outline ">Đến trang chủ</button></Link>
        </div>
      </div>
    </div>
    )
}

export default TemplatePointers