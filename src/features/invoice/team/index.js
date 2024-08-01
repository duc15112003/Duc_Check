import moment from "moment"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from '../../common/headerSlice'

const TopSideButtons = () => {
}
const teamMembers = [
    { name: 'Phạm Minh Đức', role: 'DEV_BE/FE', description: 'Chuyên về phát triển backend và frontend với nhiều năm kinh nghiệm.', image: 'https://scontent.fsgn2-10.fna.fbcdn.net/v/t39.30808-6/277160376_362280545819562_7549749154166364318_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeE_SoT5F3A4Ql7TyjHp--EuprvPGi3mDwamu88aLeYPBodxFZQqqnEmA1wFllJomzH6GfRa2Pj-XsAVxEeuPTct&_nc_ohc=dP5hkAXUHN0Q7kNvgEPDHE1&_nc_ht=scontent.fsgn2-10.fna&oh=00_AYC8o3luPv2uDEXU8u0mjzGn-RePDqdTlVpEnAN1yI658Q&oe=6670B903' },
    { name: 'Nguyễn Hoàng Vinh', role: 'DEV_BE/FE', description: 'Có kỹ năng vượt trội trong việc xử lý dữ liệu và xây dựng hệ thống.', image: 'https://via.placeholder.com/150' },
    { name: 'Nguyễn Thị Thu Phương', role: 'DEV_BE/FE', description: 'Chuyên gia về thiết kế và phát triển giao diện người dùng.', image: 'https://via.placeholder.com/150' },
    { name: 'Trần Thị Thúy Diễm', role: 'DEV_BE/FE', description: 'Thành thạo trong việc quản lý dự án và phát triển phần mềm.', image: 'https://via.placeholder.com/150' },
];
function Team(){
    const [selectedMember, setSelectedMember] = useState(null);
    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };
    return(
        <>
            
            <p title="Giới Thiệu" topMargin="mt-2" TopSideButtons={<TopSideButtons />}>

                <div className="container mx-auto px-4 py-6">
                    <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">Giới Thiệu Dự Án Saigon Waterbus</h2>
                    <p className="text-gray-700 mb-4">
                        Dự án Saigon Waterbus là một dự án quan trọng với mục tiêu cải thiện giao thông đường thủy tại thành phố Hồ Chí Minh.
                        Dự án này không chỉ giúp giảm thiểu tình trạng ùn tắc giao thông mà còn tạo ra một phương tiện giao thông xanh và thân thiện với môi trường.
                    </p>
                    <h3 className="text-2xl font-bold mb-2 text-blue-600">Nhóm 2</h3>
                    <p className="text-gray-700 mb-2">
                        Nhóm 2 chịu trách nhiệm phát triển và quản lý hệ thống này bao gồm các thành viên:
                    </p>
                    <div className="flex justify-between mb-4 flex-wrap">
                        {teamMembers.map((member, index) => (
                            <div
                                key={index}
                                onClick={() => handleMemberClick(member)}
                                className="cursor-pointer bg-white p-2 rounded-lg shadow-md w-full sm:w-1/2 lg:w-1/5 flex-none m-2 text-center"
                            >
                                <img src={member.image} alt={member.name} className="w-24 h-24 mx-auto rounded-full mb-2" />
                                <h4 className="text-sm font-bold">{member.name}</h4>
                                <p className="text-xs text-gray-700">{member.role}</p>
                            </div>
                        ))}
                    </div>
                    {selectedMember && (
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h4 className="text-xl font-bold mb-2">{selectedMember.name}</h4>
                            <p className="text-gray-700">{selectedMember.role}</p>
                            <p className="text-gray-700">{selectedMember.description}</p>
                            {/*<img src={selectedMember.image}/>*/}
                        </div>
                    )}
                </div>
            </p>
        </>
    )
}


export default Team