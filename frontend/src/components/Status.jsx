import React, { useState, useEffect } from "react";
import axios from "axios";

const State = () => {
  const [appliedArticles, setAppliedArticles] = useState([]);
  const [loading, setLoading] = useState(true); 

  const statusStates = [
    { text: 'Đã xem', bgColor: 'bg-yellow-400', textColor: 'text-white' },
    { text: 'Chưa xem', bgColor: 'bg-white', textColor: 'text-black' },
    { text: 'Từ chối', bgColor: 'bg-red-500', textColor: 'text-white' },
    { text: 'Đồng ý', bgColor: 'bg-green-500', textColor: 'text-white' },
  ];

  useEffect(() => {
    const fetchAppliedArticles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/jobseeker/info/listApply', { withCredentials: true });
        if (response.data && response.data.data) {
          setAppliedArticles(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching applied articles:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchAppliedArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center dark:bg-white transition-colors duration-200 flex-col p-4 gap-[32px] border-[#00000000] border-0 bg-[rgb(255,_255,_255)]"
      data-oid="wmvt:.1"
    >
      <div
        className="w-full grid-cols-[repeat(2,_1fr)] justify-start items-center bg-[#00000000] border-[#00000000] flex pl-[100px] pr-[100px] h-[50px]"
        data-oid="q8gv0rx"
        key="olk-R5iO"
      >
        <div
          className="w-full h-full text-[#000000] text-[32px] font-bold flex items-center justify-start border-[#00000000] bg-[#00000000]"
          data-oid="xu6cr-a"
          key="olk-sg_y"
        >
          TRẠNG THÁI ỨNG TUYỂN
        </div>
      </div>

      <div
        className="px-[100px] items-center gap-[10px] grid-rows-[repeat(2,_1fr)] grid-cols-[repeat(1,_1fr)] flex flex-col justify-start w-full h-[fit-content] bg-[#FFFFFF] pt-[10px] pb-[10px] border-[#00000000] border-0 rounded-none"
        data-oid="a6hn.b3"
        key="olk-0Xvc"
      >
        <div
          className="w-full flex justify-start items-center border-[#000000] rounded-[30px] border-2 gap-[10px] bg-[rgba(0,_0,_0,_0)] h-[60px]"
          data-oid="_ghrroo"
          key="olk-qaHF"
        >
          <div
            className="w-full text-[#000000] text-[24px] font-bold text-center flex justify-center items-center h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="glal7h9"
          >
            Công viêc ứng tuyển
          </div>
          <div
            className="w-1/2 text-[#000000] text-[24px] font-bold text-center flex justify-center items-center h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="cj9xlx_"
          >
            CV đã gửi
          </div>
          <div
            className="w-[30%] text-[24px] font-bold text-center flex justify-center items-center text-[#000000] h-full rounded-none bg-[rgba(0,_0,_0,_0)]"
            data-oid="r20v9.:" 
          >
            Tình trạng
          </div>
        </div>

        {/* Lặp qua các bài viết ứng tuyển và trạng thái CV */}
        {appliedArticles.map((article, index) => (
          <div
            key={`row-${index}`}
            className="h-[100px] w-full flex justify-start items-center gap-[10px] bg-[#00000000] border-[#00000000]"
            data-oid="hox-ts9"
          >
            <button
              className="h-[100px] w-full text-[#000000] text-[24px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#474B53] border-2 bg-cover bg-center hover:opacity-90 transition-opacity duration-200 relative overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop")',
              }}
              onClick={() => console.log('Button clicked')}
              data-oid="9a1e6_l"
            >
              <span
                className="z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                data-oid="q:a61__"
              >
                {article.title}
              </span>
            </button>

            <button
              className="h-[100px] w-1/2 text-[#000000] text-[24px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#474B53] border-2 bg-cover bg-center hover:opacity-90 transition-opacity duration-200 relative overflow-hidden"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop")',
              }}
              onClick={() => console.log('CV Button clicked')}
              data-oid="cpzujuc"
            >
              <span
                className="z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                data-oid="t9ihipq"
              >
                {article.cvName}
              </span>
            </button>

            <div
              className={`h-[100px] w-[30%] text-[24px] font-bold text-center flex justify-center items-center rounded-[30px] border-[#000000] border-2 ${statusStates[index % statusStates.length].bgColor}`}
              data-oid="quv..k:"
            >
              <span
                className={statusStates[index % statusStates.length].textColor}
                data-oid="t81gbqv"
              >
                {article.cvStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default State;
