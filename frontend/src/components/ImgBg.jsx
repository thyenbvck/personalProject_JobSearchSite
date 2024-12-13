import React from 'react';
import { useLocation } from 'react-router-dom'; // Để lấy thông tin vị trí trang hiện tại

const ImgHome = () => {
  const location = useLocation(); // Lấy vị trí trang hiện tại
  const isHomePage = location.pathname === '/'; // Kiểm tra xem đây có phải là trang chủ hay không

  return (
    <div className={`img-container w-[90%] m-auto ${isHomePage ? 'home' : 'other'}`}>
      {/* Kiểm tra nếu là trang chủ thì hình ảnh sẽ khác, và vị trí cũng sẽ khác */}
      <img
        src={isHomePage ? './public/image-home.png' : './public/image-other.png'}
        alt="Background"
        className={`img-home ${isHomePage ? 'home-img' : 'other-img'}`}
      />
    </div>
  );
}

export default ImgHome;
