import React, { useState, useEffect } from "react";
import axios from "axios";
import UserContext from "../userContext/userContext";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [profile, setProfile] = useState({});
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/jobseeker/info", {
          withCredentials: true,
        });
        setProfile(response.data.user);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Vui lòng chọn một tệp CV để tải lên.");
      return;
    }

    const formData = new FormData();
    formData.append("cvFile", selectedFile);
    formData.append("name", selectedFile.name);

    try {
      setUploadError("");
      setUploadSuccess("");
      const response = await axios.post(
        "http://localhost:8080/jobseeker/info/uploadCV",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      setUploadSuccess("Tải lên CV thành công!");
      setProfile((prevProfile) => ({
        ...prevProfile,
        CVProfile: [...(prevProfile.CVProfile || []), response.data.newCV],
      }));
    } catch (error) {
      setUploadError("Có lỗi xảy ra khi tải lên CV. Vui lòng thử lại.");
      console.error(error);
    }
  };

  // Xử lý xóa CV
  const handleDeleteCV = async (cvId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/jobseeker/info/deleteCV/${cvId}`,
        { withCredentials: true }
      );
      // Cập nhật lại profile sau khi xóa
      setProfile((prevProfile) => ({
        ...prevProfile,
        CVProfile: prevProfile.CVProfile.filter((cv) => cv.id !== cvId),
      }));
      alert("Xóa CV thành công!");
      navigate("/recruiter");
    } catch (error) {
      setUploadError("Có lỗi xảy ra khi xóa CV. Vui lòng thử lại.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col w-full items-center text-[#3C3C3C] border-[#00000000] gap-10">
      <h1 className="text-[32px] font-bold mt-8 text-center">
        Thông Tin Tài Khoản
      </h1>

      <div className="flex flex-col w-[600px] gap-4">
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Họ và tên:</label>
          <div className="p-4 border-2 rounded-md">{profile.Name || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Email:</label>
          <div className="p-4 border-2 rounded-md">{profile.email || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">CCCD:</label>
          <div className="p-4 border-2 rounded-md">{profile.CCCD || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Địa chỉ:</label>
          <div className="p-4 border-2 rounded-md">{profile.location || "Chưa cập nhật"}</div>
        </div>
        <div className="flex flex-col">
          <label className="font-semibold text-[20px]">Ngày sinh:</label>
          <div className="p-4 border-2 rounded-md">
            {profile.birthday ? new Date(profile.birthday).toLocaleDateString() : "Chưa cập nhật"}
          </div>
        </div>
      </div>

      {/* CV Profile */}
      <div className="flex flex-col w-[600px] gap-4">
        <h2 className="font-bold text-[20px]">Thông tin CV:</h2>
        {profile.CVProfile && profile.CVProfile.length > 0 ? (
          profile.CVProfile.map((cv, index) => (
            <div key={index} className="flex flex-col gap-2 border p-4 rounded-md">
              {/* Hiển thị tên CV và id */}
              <p className="font-semibold">Tên CV: {cv?.name || "Chưa có tên CV"}</p>
              <p className="font-semibold">ID: {cv?._id}</p>
              <a
                href={`data:${cv?.cvFile?.contentType};base64,${cv?.cvFile?.data}`}
                download={`${cv?.name || "CV"}.pdf`}
                className="text-blue-500 underline"
              >
                Tải xuống CV
              </a>
              <button
                onClick={() => handleDeleteCV(cv._id)}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Xóa CV
              </button>
            </div>
          ))
        ) : (
          <p>Chưa có CV nào được tải lên.</p>
        )}
      </div>

      {/* Upload CV */}
      <div className="flex flex-col w-[600px] gap-4">
        <h2 className="font-bold text-[20px]">Tải lên CV mới:</h2>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-2 border rounded-md p-2"
        />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Tải lên
        </button>
        {uploadError && <p className="text-red-500">{uploadError}</p>}
        {uploadSuccess && <p className="text-green-500">{uploadSuccess}</p>}
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="text-red-500 mt-4">
          Lỗi: {error}
        </div>
      )}
    </div>
  );
};

export default Profile;
