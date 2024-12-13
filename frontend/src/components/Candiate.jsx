import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Candidate = () => {
  const { id } = useParams(); // Lấy id từ params
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCV, setSelectedCV] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/recruiter/${id}/listCV`,
        { withCredentials: true }
      );
        const cvList = response.data.cvList; // Nếu không có cvList, trả về mảng rỗng
      setItems(cvList); // Set items bằng cvList
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };  
  const handleViewCV = async (index, cvId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/recruiter/${id}/listCV/${cvId}`,
        { withCredentials: true ,responseType: 'arraybuffer'}
      );
      const pdfBuffer = response.data;
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
        setSelectedCV(url); // Lưu URL blob vào state
        setSelectedIndex(index);
        setIsModalOpen(true);
  
        // Cập nhật trạng thái "Đã xem"
        const updatedItems = [...items];
        updatedItems[index].status = "Đã xem";
        setItems(updatedItems);
        await axios.put(
            `http://localhost:8080/recruiter/${id}/listCV/${cvId}/reply`,
            { newStatus: "Đã xem" },
            { withCredentials: true }
          );
    } catch (err) {
      setError(err.message);
    }
  };
  

  const handleStatusChange = async (cvId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8080/recruiter/${id}/listCV/${cvId}/reply`,
        { newStatus: newStatus },
        { withCredentials: true }
      );
      const updatedItems = items.map((item, index) =>
        index === selectedIndex ? { ...item, status: newStatus } : item
      );
      setItems(updatedItems);
      alert("Phản hồi CV thành công");
    } catch (err) {
      setError(err.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCV(null);
    setSelectedIndex(null);
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Danh Sách</h1>
        <table className="table-auto w-full text-left border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-8 py-4">Tên</th>
              <th className="border border-gray-300 px-8 py-4">Giới tính</th>
              <th className="border border-gray-300 px-8 py-4">CV</th>
              <th className="border border-gray-300 px-8 py-4">Trạng thái</th>
              <th className="border border-gray-300 px-8 py-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
          {items.map((item, index) => (
  <tr key={item.id} className="odd:bg-gray-100 even:bg-white">
    <td className="border border-gray-300 px-8 py-4">{item.name}</td>
    <td className="border border-gray-300 px-8 py-4">{item.gender}</td>
    <td className="border border-gray-300 px-8 py-4">
      <button
        onClick={() => handleViewCV(index,item.id)}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Xem CV
      </button>
    </td>
    <td className="border border-gray-300 px-8 py-4">{item.status}</td>
    <td className="border border-gray-300 px-8 py-4">
      <button
        onClick={() => handleStatusChange(item.id, "Đồng ý")}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 ml-4"
      >
        Đồng ý
      </button>
      <button
        onClick={() => handleStatusChange(item.id, "Từ chối")}
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 ml-4"
      >
        Từ chối
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
<div className="bg-white p-8 rounded-lg w-full max-h-full overflow-auto">
          <button
        onClick={closeModal}
        className="text-red-600 font-bold text-xl mb-6 inline-block"
      >
        Đóng
      </button>
      <div>
        {/* Hiển thị tệp PDF bằng embed */}
        <iframe 
          src={selectedCV} 
          type="application/pdf" 
          width="100%" 
          height="600px" 
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Candidate;
