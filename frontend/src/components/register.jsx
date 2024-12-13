import React, { useState,useContext  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../userContext/userContext";
const Register = () => {
    const { login } = useContext(UserContext); // Import hàm login từ context
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
    birthday: "",
    cccd: "",
    gender: "",
    address: "",
    location: "",
    workingMethods: [],
    fields: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const provinces = [
    "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Kạn", "Bắc Giang",
    "Bắc Ninh", "Bến Tre", "Bình Dương", "Bình Định", "Bình Phước",
    "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ", "Đà Nẵng",
    "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp",
    "Gia Lai", "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh",
    "Hải Dương", "Hải Phòng", "Hậu Giang", "Hòa Bình", "Hưng Yên",
    "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lâm Đồng",
    "Lạng Sơn", "Lào Cai", "Long An", "Nam Định", "Nghệ An",
    "Ninh Bình", "Ninh Thuận", "Phú Thọ", "Phú Yên", "Quảng Bình",
    "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị", "Sóc Trăng",
    "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa",
    "Thừa Thiên Huế", "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang",
    "Vĩnh Long", "Vĩnh Phúc", "Yên Bái",
  ];

  const fields = [
    "Phát triển Phần mềm", "Quản trị Hệ thống và Mạng", "Kiểm thử Phần mềm",
    "Thiết kế Trải nghiệm và Giao diện", "Khoa học Dữ liệu và AI", "Phát triển Web",
    "Phân tích và Tư vấn Kinh doanh", "Thực tế ảo và Tăng cường", "An ninh mạng",
    "DevOps và Quản lý Hạ tầng", "Quản lý Dự án", "IoT và Kỹ thuật Điều khiển",
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, [type]: [...formData[type], value] });
    } else {
      setFormData({
        ...formData,
        [type]: formData[type].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:8080/jobseeker/register",
        formData,{
            withCredentials: true,
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        login(response.data.user);
        setTimeout(() => navigate("/jobseeker"), 1000); // Chuyển trang sau 1 giây
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đăng ký thất bại. Vui lòng thử lại!");
    }
  };
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chưa có tài khoản vui lòng đăng kí</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">Đăng ký thành công! Đang chuyển hướng...</p>}
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Họ và Tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block font-semibold mb-1">Ngày Sinh:</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* CCCD */}
        <div>
          <label className="block font-semibold mb-1">CCCD:</label>
          <input
            type="text"
            name="cccd"
            value={formData.cccd}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block font-semibold mb-1">Giới Tính:</label>
          <div className="space-x-4">
            <label>
              <input
                type="radio"
                name="gender"
                value="Nam"
                onChange={handleChange}
                required
              />{" "}
              Nam
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Nữ"
                onChange={handleChange}
              />{" "}
              Nữ
            </label>
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold mb-1">Địa Chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">Địa Điểm Làm Việc:</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn Tỉnh/Thành</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Fields */}
        <div>
          <label className="block font-semibold mb-1">Lĩnh Vực Công Việc:</label>
          <div className="grid grid-cols-2 gap-2">
            {fields.map((field) => (
              <label key={field}>
                <input
                  type="checkbox"
                  value={field}
                  onChange={(e) => handleCheckboxChange(e, "fields")}
                />{" "}
                {field}
              </label>
            ))}
          </div>
        </div>

        {/* Working Methods */}
        <div>
          <label className="block font-semibold mb-1">Phương Thức Làm Việc:</label>
          <div className="space-x-4">
            <label>
              <input
                type="checkbox"
                value="Full Time"
                onChange={(e) => handleCheckboxChange(e, "workingMethods")}
              />{" "}
              Full Time
            </label>
            <label>
              <input
                type="checkbox"
                value="Part Time"
                onChange={(e) => handleCheckboxChange(e, "workingMethods")}
              />{" "}
              Part Time
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Đăng Ký
        </button>
      </form>
    </div>
  );
};

export default Register;
