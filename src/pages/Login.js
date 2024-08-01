
import Login from '../features/user/Login'
import { useAuth } from '../AuthContext';
function ExternalPage(){

      const { notification } = useAuth();

    return(
        <div className=""            style={{
                 backgroundImage: `url('https://staging.saigonwaterbus.com/wp-content/uploads/2022/06/home-slide-2-2.jpg')`,
                backgroundSize: 'cover', // Đảm bảo ảnh nền phủ hết phần tử
                backgroundPosition: 'center', // Căn giữa ảnh nền
            }}>

                        {notification && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center py-2">
          {notification}
        </div>)}
                <Login />
        </div>
    )
}

export default ExternalPage