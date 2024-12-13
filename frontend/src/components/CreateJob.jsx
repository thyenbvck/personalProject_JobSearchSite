import React, { useState, useEffect, } from "react";
import logo1 from "/company/vnglogo.png";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocateOutline, IoLocationOutline } from "react-icons/io5";
import { GiSandsOfTime } from "react-icons/gi";
import { SlNote } from "react-icons/sl";
import { PiListMagnifyingGlassLight } from "react-icons/pi";
import { GrLocationPin, GrStatusGood } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { BiGridAlt } from "react-icons/bi"; // Icon lĩnh vực
import { FaUsers } from "react-icons/fa"; // Icon quy mô
import { FaFlag } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    salary: "",
    address: "",
    experience:"",
    detail: {
      description: "",
      benefit: "",
      require: "",
    },
  });
  const navigate = useNavigate();
  const handleInputChange = (fieldName, index, event) => {
    const tasks = formData.detail[fieldName]
      ? formData.detail[fieldName].split("\n")
      : [];
    tasks[index] = event.target.value;
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [fieldName]: tasks.join("\n"),
      },
    }));
  };

  const handleAddInput = (fieldName) => {
    const tasks = formData.detail[fieldName]
      ? [...formData.detail[fieldName].split("\n"), ""]
      : [""];
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [fieldName]: tasks.join("\n"),
      },
    }));
  };

  const handleRemoveInput = (fieldName, index) => {
    const tasks = formData.detail[fieldName]
      ? formData.detail[fieldName].split("\n")
      : [];
    tasks.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [fieldName]: tasks.join("\n"),
      },
    }));
  };
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleDetailChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      detail: {
        ...prev.detail,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:8080/recruiter/create', formData, {
        withCredentials: true,
      });
      // Show success alert
      alert("Đăng công việc thành công!");
      navigate("/recruiter");
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error alert
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  return (
    <div className="w-[90%] m-auto">
      <div className="TitleJobsection text-[30px] flex mt-5 justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Chi tiết công việc</h1>
      </div>
      <div className="flex gap-[1.5rem] justify-between m-auto">
        <div className="jobContainer flex flex-col gap-[20px] items-center">
          {/* {jobs.map((job) => (
      <SingleJob
        key={job._id}
        id={job._id}
        image={logo1}
        title={job.title}
        company={job.nameCompany}
        salary={job.salary}
        location={job.address}
      />
    ))} */}
        </div>

        <div className="infoDetail flex-column gap-10 justify-center flex-wrap items-center py-5 border-2 border-black p-4 rounded-[20px] w-full">
          <form
            onSubmit={handleSubmit}
            className="infoDetail flex flex-col gap-10 p-5 border-2 border-black rounded-[20px] w-full"
          >
            <div className="JobTitleBox text-[30px] flex justify-between items-center ml-4 font-bold">
              <input
                type="text"
                placeholder="Nhập tiêu đề công việc"
                value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-[10px] focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="ChecklistBox mt-4">
  <div className="flex gap-20 items-center justify-center p-4">
    {/* Mức lương */}
    <div className="flex items-center gap-6">
      <RiMoneyDollarCircleLine className="text-5xl flex-shrink-0" />
      <div className="flex flex-col">
        <label className="font-bold text-xl">Mức lương:</label>
        <input
          type="text"
          value={formData.salary}
          onChange={(e) => handleChange("salary", e.target.value)}
          placeholder="Nhập..."
          className="text-lg text-gray-700 border rounded-md p-3 focus:outline-none focus:border-blue-500 w-[200px]"
        />
      </div>
    </div>

    {/* Địa chỉ */}
    <div className="flex items-center gap-6">
      <IoLocationOutline className="text-5xl flex-shrink-0" />
      <div className="flex flex-col">
        <label className="font-bold text-xl">Địa chỉ:</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="Nhập..."
          className="text-lg text-gray-700 border rounded-md p-3 focus:outline-none focus:border-blue-500 w-[200px]"
        />
      </div>
    </div>

    {/* Kinh nghiệm */}
    <div className="flex items-center gap-6">
      <GiSandsOfTime className="text-5xl flex-shrink-0" />
      <div className="flex flex-col">
        <label className="font-bold text-xl">Kinh nghiệm:</label>
        <input
          type="text"
          value={formData.experience}
          onChange={(e) => handleChange("experience", e.target.value)}
          placeholder="Nhập..."
          className="text-lg text-gray-700 border rounded-md p-3 focus:outline-none focus:border-blue-500 w-[200px]"
        />
      </div>
    </div>
  </div>
</div>

            <div className="Chitiettuyendung text-xl font-bold flex justify-between items-center ml-4 mt-5">
              Chi tiết tuyển dụng
            </div>
            {["description", "benefit", "require"].map((fieldName) => (
  <div key={fieldName} className="DescDiv flex flex-col gap-4 p-4">
    {/* Tiêu đề */}
    <div className="flex items-center text-xl ml-4 font-bold">
      <SlNote className="ml-2 text-gray-500 text-lg mr-2" />
      <span>
        {fieldName === "description"
          ? "Mô tả công việc"
          : fieldName === "benefit"
          ? "Lợi ích"
          : "Yêu cầu"}
      </span>
    </div>

    {/* Nội dung bullet list */}
    <div className="flex-col gap-2 ml-10">
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => handleAddInput(fieldName)}
          className="text-blue-500 hover:text-blue-700 transition flex items-center gap-2"
        >
          <span className="text-xl font-bold">+</span> Thêm mục
        </button>
      </div>

      {/* Render danh sách các trường nhập liệu */}
      {(formData.detail[fieldName]?.split("\n") || []).map((task, index) => (
        <div key={index} className="flex items-center gap-4 mt-4">
          <input
            type="text"
            name={fieldName}
            value={task}
            onChange={(e) => handleInputChange(fieldName, index, e)}
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
            placeholder={`Nhập ${
              fieldName === "description"
                ? "mô tả công việc"
                : fieldName === "benefit"
                ? "lợi ích"
                : "yêu cầu"
            }`}
          />
          <button
            type="button"
            onClick={() => handleRemoveInput(fieldName, index)}
            className="text-red-500 hover:text-red-700"
          >
            Xóa
          </button>
        </div>
      ))}
    </div>
  </div>
))}
            <div className="LocationDiv flex flex-col gap-4 p-4">
              {/* Title: Địa chỉ */}
              <div className="flex items-center text-xl ml-4 font-bold">
                <IoHomeOutline className="ml-2 text-gray-500 text-xl mr-2" />
                <span>Địa chỉ</span>
              </div>

              {/* Input for address */}
              <div className="flex-col gap-1 ml-10 mt-2">
                <div className="flex items-start gap-2">
                  <span className="text-xl font-bold text-black mr-2">•</span>
                  {/* Input field for the address */}
                  {/* <input
                    type="text"
                    value={address}
                    onChange={handleAddressChange}
                    className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring focus:ring-blue-200"
                    placeholder="Nhập địa chỉ"
                  /> */}
                </div>
              </div>
            </div>
            <button
  type="submit"
  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-xl w-full hover:bg-blue-700 transition"
>
  Đăng công việc
</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
