import React from 'react'
import { FaLinkedin, FaFacebook, FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='footer mt-[3rem] p-[3rem] mb-3 bg-gray-800 rounded-[10px]'>
      <div className='flex flex-center gap-8 items-center justify-center w-[90%] m-auto'>
          <div className='w-[13em]' >
              <div className="logoDiv">
                    <h1 className="logo text-[25px] text-white pb-[1.5rem]">
                      <span className="job-text">ITJOB</span><span className="search-text">Search</span>
                    </h1>
              </div>
              <p className='text-white pb-[15px] opacity-70 leading-7'>
              Chúng tôi kết nối các doanh nghiệp với những tài năng IT, giúp tạo ra cơ hội nghề nghiệp bền vững và giảm thiểu tỷ lệ thất nghiệp trong cộng đồng công nghệ.
              </p>
          </div>
          
          <div className='grid grid-cols-4 m-auto gap-10'>
          <div className='grid'>
            <span className='divTitle text-[18px] font-semibold pb-[1.5rem] text-white'>
                Company
            </span>
            <div className='grid gap-3'>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>About us</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Features</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>News</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>FAQ</li>
            </div>
          </div>

          <div className='grid'>
            <span className='divTitle text-[18px] font-semibold pb-[1.5rem] text-white'>
                Resources
            </span>
            <div className='grid gap-3'>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Account</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Support Center</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Feedback</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Headquarters</li>
            </div>
          </div>

          <div className='grid'>
            <span className='divTitle text-[18px] font-semibold pb-[1.5rem] text-white'>
                Support
            </span>
            <div className='grid gap-3'>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Events</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Promo</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Req demo</li>
                <li className='text-white opacity-[.7] hover:opacity-[1]'>Careers</li>
            </div>
          </div>

          <div className='grid'>
            <span className='divTitle text-[18px] font-semibold pb-[1.5rem] text-white'>
                Contact info
            </span>
            <div>
              <small className='text-[14px] text-white'>
                khang.vohuu@hcmut.edu.vn
              </small>
                  <div className='icons flex gap-4 py-[1rem]'>
                      <FaLinkedin className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blackColor' />
                      <FaFacebook className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blackColor' />
                      <FaTiktok className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blackColor' />
                  </div>
                
            </div>
          </div>
          </div>
      </div>
      
      

    </div>
  )
}

export default Footer
