import React, { useState, useEffect,useContext } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { SingleJob } from "./JobHome";
import logo1 from "/company/vnglogo.png";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocateOutline, IoLocationOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { PiListMagnifyingGlassLight } from "react-icons/pi";
import { GrLocationPin, GrStatusGood } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiGridAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import axios from "axios";
import UserContext from '../userContext/userContext';
const CompDetail = () => {
  const [isReportOpen, setIsReportOpen] = useState(false); // Trạng thái mở/đóng modal báo cáo
  const [selectedReason, setSelectedReason] = useState(""); // Lý do báo cáo
  const [otherReason, setOtherReason] = useState(""); // Ghi chú cho lý do "Khác"
  const [evidence, setEvidence] = useState(null); // File minh chứng
  const { id } = useParams(); // Lấy id từ URL
  const [jobDetail, setJobDetail] = useState(null);
  const [jobRandom, setJobRamdom] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false); // Trạng thái mở/đóng modal chọn CV
  const [cvList, setCVList] = useState([]); // Danh sách CV của người dùng
  const [selectedCVId, setSelectedCVId] = useState(null); // ID của CV được chọn
  const { userInfo, isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const handleReportClick = () => {
    setIsReportOpen(true); // Mở modal báo cáo
  };

  const handleCloseModal = () => {
    setIsReportOpen(false); // Đóng modal báo cáo
    setSelectedReason("");
    setEvidence("");
  };

  const handleSubmitReport = () => {
    alert(`Đã báo cáo thành công!`);
    setIsReportOpen(false);
  };
  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response1 = await axios.get(
          `http://localhost:8080/jobseeker/${id}`,
        );
        setJobDetail(response1.data);
        const response2 = await axios.get(userInfo?.role === 'Jobseeker' ? "http://localhost:8080/jobseeker": "http://localhost:8080/recruiter",{
          withCredentials: true,
        });
        const allJobs = response2.data;
        const randomJobs = allJobs.sort(() => Math.random() - 0.5).slice(0, 7);

        setJobRamdom(randomJobs);
        const cvResponse = await axios.get(`http://localhost:8080/jobseeker/info/CV`, {
          withCredentials: true,
        });
        setCVList(cvResponse.data.CVProfile.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id]);
  const handleApplyClick = () => {
    setIsCVModalOpen(true);
  };

  const handleSubmitCV = async () => {
    if (!selectedCVId) {
      alert("Vui lòng chọn một CV để nộp.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/jobseeker/${id}/submitCV`,
        {
          CVID: selectedCVId,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        alert("Nộp CV thành công!");
        setIsCVModalOpen(false);
      } else {
        alert(`Lỗi: ${response.data.message}`);
      }
    } catch (err) {
      alert(`Lỗi khi nộp CV: ${err.message}`);
    }
  };

  const handleCloseCVModal = () => {
    setIsCVModalOpen(false);
    setSelectedCVId(null);
  };
  const handleEditClick = () => {
    console.log("Sửa clicked");
    alert("Chức năng sửa sẽ được triển khai!");
  };
  
  const handleDeleteClick = async (jobId) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa mục này?");
    
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:8080/recruiter/${jobId}/delete`, {
          withCredentials: true,
        });
        
        alert("Mục đã được xóa thành công!");
        navigate("/recruiter");
      } catch (error) {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };
  
  const handleViewCandidatesClick = () => {
      if (id) {
        navigate(`/recruiter/jobDetail/${id}/listJobseeker`);
      } else {
        alert("ID của bài viết không tồn tại!");
      }
    };
  
  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;
  const description = jobDetail?.data.detail.description || "";
  const request = jobDetail?.data.detail.request || "";
  const benefit = jobDetail?.data.detail.benefit || "";

  const splitTextToSentences = (text) => {
    return text
      .split(".")
      .map((sentence, index) => sentence.trim())
      .filter((sentence) => sentence !== "");
  };

  const descriptionSentences = splitTextToSentences(description);
  const requestSentences = splitTextToSentences(request);
  const benefitSentences = splitTextToSentences(benefit);

  return (
    <div className="w-[90%] m-auto">
      <div className="TitleJobsection text-[30px] flex mt-5 justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Chi tiết công việc</h1>
      </div>
      <div className="flex gap-[1.5rem] justify-between m-auto">
        <div className="jobContainer flex flex-col gap-[20px] items-center">
          {jobRandom.map((job) => (
            <SingleJob
              key={job._id}
              id={job._id}
              image={logo1}
              title={job.title}
              company={job.nameCompany}
              salary={job.salary}
              location={job.address}
            />
          ))}
        </div>

        <div className="infoDetail flex-column gap-10 justify-center flex-wrap items-center py-5 border-2 border-black p-4 rounded-[20px]">
          <div className="JobTitleBox text-[30px] flex justify-between items-center ml-4 font-bold">
            {jobDetail.data.title}
          </div>

          <div className="ChecklistBox mt-4">
            <div className="flex gap-20 items-center justify-center p-4">
              {/* Mức lương */}
              <div className="flex items-center gap-4">
                <RiMoneyDollarCircleLine className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Mức lương:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.data.salary}
                  </span>
                </div>
              </div>

              {/* Địa điểm */}
              <div className="flex items-center gap-4">
                <IoLocationOutline className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Địa điểm:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.data.address}
                  </span>
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div className="flex items-center gap-4">
                <GiSandsOfTime className="text-3xl flex-shrink-0" />{" "}
                {/* Icon lớn */}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">Kinh nghiệm:</span>
                  <span className="text-md text-gray-500">
                    {jobDetail.data.experience}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="ButtonDiv flex gap-5 m-4">
  {userInfo?.role === 'Jobseeker' ? (
    <>
      {/* Nút Ứng tuyển ngay */}
      <button
        className="bg-blue-500 text-white py-2 px-6 rounded-[20px] hover:bg-blue-700 w-2/3"
        onClick={handleApplyClick}
      >
        <span className="block transition-transform duration-150 hover:scale-110">
          Ứng tuyển ngay
        </span>
      </button>

      {/* Modal chọn CV */}
      {isCVModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] md:w-[500px] p-6 rounded-[20px] shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Chọn CV để ứng tuyển</h2>

            <div className="mb-4">
              {cvList.length > 0 ? (
                <ul className="space-y-2">
                  {cvList.map((cv, index) => (
                    <li key={cv._id} className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="cv"
                        value={cv._id}
                        onChange={() => setSelectedCVId(cv._id)}
                      />
                      <span>{cv.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Bạn chưa có CV nào.</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                onClick={handleCloseCVModal}
              >
                Hủy
              </button>
              <button
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleSubmitCV}
              >
                Nộp CV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nút "Yêu thích" */}
      <button className="border-2 border-black py-2 px-4 rounded-[20px] hover:text-white hover:bg-black w-1/3">
        <span className="block transition-transform duration-150 hover:scale-110">
          Yêu thích
        </span>
      </button>
    </>
  ) : userInfo?.role === 'Recruiter' ? (
    <>
      {/* Nút sửa */}
      <button
        className="bg-yellow-500 text-white py-2 px-10 rounded-[20px] hover:bg-yellow-600"
        onClick={handleEditClick}
      >
        Sửa
      </button>

      {/* Nút xóa */}
      <button onClick={() => handleDeleteClick(id)} className="bg-red-500 text-white py-2 px-10 rounded-[20px] hover:bg-red-600">
  Xóa
</button>

      {/* Nút danh sách ứng viên */}
      <button
        className="bg-green-500 text-white py-2 px-10 rounded-[20px] hover:bg-green-600"
        onClick={handleViewCandidatesClick}
      >
        Danh sách ứng viên
      </button>
    </>
  ) : null}
</div>

          <div className="Chitiettuyendung text-xl font-bold flex justify-between items-center ml-4 mt-5">
          Chi tiết tuyển dụng
        </div>

        <div className="DescDiv flex flex-col gap-4 p-4">
          {/* Tiêu đề "Mô tả công việc" */}
          <div className="flex items-center text-xl ml-4 font-bold">
            <SlNote className="ml-2 text-gray-500 text-lg mr-2" />
            <span>Mô tả công việc</span>
          </div>

          {/* Nội dung bullet list */}
          <div className="flex-col gap-1 ml-10">
            {descriptionSentences.map((sentence, index) => (
              <div key={index} className="flex items-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{sentence}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="RequireDiv flex flex-col gap-4 p-4">
          {/* Tiêu đề*/}
          <div className="flex items-center text-xl ml-4 font-bold">
            <PiListMagnifyingGlassLight className="ml-2 text-gray-800 text-xl mr-2" />
            <span>Yêu cầu ứng viên</span>
          </div>

          {/* Nội dung bullet list */}
          <div className="flex-col gap-1 ml-10">
            {requestSentences.map((sentence, index) => (
              <div key={index} className="flex items-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{sentence}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="InterestDiv flex flex-col gap-4 p-4">
          {/* Tiêu đề */}
          <div className="flex items-center text-xl ml-4 font-bold">
            <GrStatusGood className="ml-2 text-gray-500 text-l mr-2" />
            <span>Quyền lợi</span>
          </div>

          {/* Nội dung bullet list */}
          <div className="flex-col gap-1 ml-10">
            {benefitSentences.map((sentence, index) => (
              <div key={index} className="flex items-start">
                <span className="text-xl font-bold text-black mr-2">•</span>
                <span>{sentence}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="LocationDiv flex flex-col gap-4 p-4">
          {/* Tiêu đề */}
          <div className="flex items-center text-xl ml-4 font-bold">
            <IoHomeOutline className="ml-2 text-gray-500 text-xl mr-2" />
            <span>Địa điểm làm việc</span>
          </div>

          {/* Nội dung bullet list */}
          <div className="flex-col gap-1 ml-10">
            <div className="flex items-start">
              <span className="text-xl font-bold text-black mr-2">•</span>
              {jobDetail.data.detail.detailAddress}
            </div>
          </div>
        </div>

        <div className="LocationDiv flex flex-col gap-4 p-4">
          {/* Tiêu đề */}
          <div className="flex items-center text-xl ml-4 font-bold">
            <IoMdTime className="ml-2 text-gray-500 text-lg mr-2" />
            <span>Thời gian làm việc</span>
          </div>

          {/* Nội dung bullet list */}
          <div className="flex-col gap-1 ml-10">
            <div className="flex items-start">
              <span className="text-xl font-bold text-black mr-2">•</span>
              <span>Bất cứ khi nào em muốn</span>
            </div>
          </div>
        </div>
        </div>
        {(userInfo?.role === 'Jobseeker'||'Recruiter') ? (
      <div className="relative p-6 bg-white border border-black rounded-[20px] shadow-md text-center h-fit w-[400px]">
        {/* Nút báo cáo */}
        <button
          onClick={handleReportClick}
          className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
        >
          <FaFlag className="text-2xl" />
        </button>

        {/* Nội dung chính */}
        <div className="nameDiv">
          <div className="w-[100px] h-[100px] mx-auto rounded-full border border-black flex items-center justify-center">
            <img
              src="/vng.logo.png"
              alt="Company Logo"
              className="w-[80%] h-[80%] object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold mt-4">
            Công ty TNHH Một Mình Anh
          </h2>
          <div className="text-left mt-6">
            <div className="flex items-center gap-2 mb-3">
              <BiGridAlt className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Lĩnh vực:{" "}
                <span className="font-medium">Công nghệ thông tin</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <FaUsers className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Quy mô: <span className="font-medium">1000 nhân viên</span>
              </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <IoLocationOutline className="text-gray-500 text-lg" />
              <span className="text-lg font-bold">
                Địa điểm:{" "}
                <span className="font-medium">268 Lý Thường Kiệt Quận 10</span>
              </span>
            </div>
          </div>
          <button className="mt-6 py-2 px-6 border-2 border-black rounded-[20px] hover:bg-black hover:text-white transition duration-200">
            Xem trang công ty
          </button>
        </div>

        {/* Modal báo cáo */}
        {isReportOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-[90%] md:w-[500px] p-6 rounded-[20px] shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Báo cáo công ty</h2>

              {/* Lý do báo cáo */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Lý do báo cáo:
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded"
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                >
                  <option value="">-- Chọn lý do --</option>
                  <option value="Lừa đảo">Lừa đảo</option>
                  <option value="Thông tin không đúng sự thật">
                    Thông tin không đúng sự thật
                  </option>
                  <option value="Khác">Khác (vui lòng ghi rõ)</option>
                </select>
              </div>

              {/* Ghi chú lý do khác */}
              {selectedReason === "Khác" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Vui lòng ghi rõ:
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded"
                    rows="2"
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Nhập lý do khác..."
                  ></textarea>
                </div>
              )}

              {/* Minh chứng */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Minh chứng:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                  onChange={handleFileUpload}
                />
                {evidence && (
                  <p className="mt-2 text-sm text-gray-600">
                    File: {evidence.name}
                  </p>
                )}
              </div>

              {/* Nút hành động */}
              <div className="flex justify-end gap-3">
                <button
                  className="py-2 px-4 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleCloseModal}
                >
                  Hủy
                </button>
                <button
                  className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleSubmitReport}
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      ): null }
      </div>

    </div>
  );
};

export default CompDetail;
