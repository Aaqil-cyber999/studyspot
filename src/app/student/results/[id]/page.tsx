"use client";

import Link from "next/link";

const d = (name: string) => `/assets/detail/${name}`;

export default function StudySpotDetailPage() {
  return (
    <div className="min-h-screen w-[412px] mx-auto overflow-x-hidden overflow-y-auto bg-[#f8f9ff] relative">
      {/* Header Section */}
      <div className="flex flex-col gap-[8px] px-[16px] pt-[56px] pb-[10px] relative">
        <p className="font-bold leading-[29px] text-[24px] tracking-[-0.5px] text-white">
          Good morning, Mohamed
        </p>
        <p className="font-normal leading-[20px] text-[14px] text-[#d4d4d4]">
          Find your next study spot
        </p>
        <div className="flex gap-[8px] mt-[6px]">
          <div className="flex size-[40px] items-center justify-center rounded-full bg-[#fff] border border-[#e2e8f0] px-[12px] py-[10px]">
            <img alt="" className="size-[16px]" src={d("70707.svg")} />
          </div>
          <div className="flex flex-wrap gap-[8px]">
            <span className="inline-flex items-center gap-[12px] rounded-[20px] bg-[#f8f9ff] px-[12px] py-[8px] text-[12px] font-medium text-[#515f74]">
              <img alt="" className="size-[12px]" src={d("1cc50.svg")} />
              Quiet
            </span>
            <span className="inline-flex items-center gap-[12px] rounded-[20px] bg-[#f8f9ff] px-[12px] py-[8px] text-[12px] font-medium text-[#515f74]">
              <img alt="" className="size-[12px]" src={d("3d652.svg")} />
              Seats available
            </span>
            <span className="inline-flex items-center gap-[12px] rounded-[20px] bg-[#f8f9ff] px-[12px] py-[8px] text-[12px] font-medium text-[#515f74]">
              <img alt="" className="size-[12px]" src={d("1cc50.svg")} />
              Wi-Fi
            </span>
            <span className="inline-flex items-center gap-[12px] rounded-[20px] bg-[#f8f9ff] px-[12px] py-[8px] text-[12px] font-medium text-[#515f74]">
              <img alt="" className="size-[12px]" src={d("5a32e.svg")} />
              Power outlets
            </span>
          </div>
        </div>
      </div>
      {/* Visual Hero Container */}
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[12px] bg-[#eff4ff] px-[16px] py-[16px] relative">
        <div className="relative h-[224px] w-full overflow-clip rounded-[12px] bg-[#eff4ff] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover size-full"
            src="/assets/results/838a8.png"
          />
          {/* Badges on Hero - Top Left */}
          <div className="absolute left-[12px] top-[12px] w-[313px] h-[22px]">
            <div className="flex gap-[2px] items-center">
              <div className="flex size-[10.5px] items-center justify-center">
                <img
                  alt=""
                  className="size-full"
                  src={d("dba7b.svg")}
                />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[14px] text-[11px] tracking-[0.33px] text-[#9d4300] whitespace-nowrap">
                  Staff Monitored
                </p>
              </div>
            </div>
          </div>
          {/* Gallery / Floorplan Pills - Bottom Right */}
          <div className="absolute bottom-[10px] right-[9px] flex gap-[6px] items-center px-[12px] py-[4px] rounded-full bg-[rgba(11,28,48,0.75)] backdrop-blur-[6px] w-[85px]">
            <div className="relative size-[11.667px]">
              <img
                alt=""
                className="absolute block inset-0 size-full"
                src={d("2eaba.svg")}
              />
            </div>
            <div className="flex flex-col items-start">
              <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-white whitespace-nowrap">
                4 Photos
              </p>
            </div>
          </div>
        </div>
      </div>


        {/* Operating Hours & Peak Prediction */}
        <div className="bg-white drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[8px] items-start px-[14px] py-[12px] relative rounded-[12px] w-full">
          <div className="flex h-[22px] items-center justify-between overflow-clip relative w-[346px]">
            <div className="flex gap-[7px] items-center overflow-clip relative">
              <div className="relative shrink-0 size-[15px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("5c027.svg")} />
              </div>
              <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#077857] text-[13px] whitespace-nowrap">Open now</p>
              <div className="bg-[#e2e8f0] h-[13px] relative shrink-0 w-px" />
              <p className="font-normal leading-[normal] not-italic relative shrink-0 text-[#515f74] text-[13px] whitespace-nowrap">Closes at 10:00 PM</p>
            </div>
            <div className="bg-[#ffdbca] flex gap-[5px] h-[22px] items-center overflow-clip px-[9px] relative rounded-full shrink-0">
              <div className="relative shrink-0 size-[13px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("2f94f.svg")} />
              </div>
              <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-[#341100] text-[11px] whitespace-nowrap">Peak 6–8 PM</p>
            </div>
          </div>
          <div className="bg-[#f1f5f8] flex gap-[2px] h-[8px] items-center overflow-clip relative rounded-full shrink-0 w-[346px]">
            <div className="bg-[#cbd5de] h-[8px] relative rounded-[4px] shrink-0 w-[38px]" />
            <div className="bg-[#10b981] h-[8px] relative rounded-[2px] shrink-0 w-[188px]" />
            <div className="bg-[#f97316] h-[8px] relative rounded-[2px] shrink-0 w-[37px]" />
            <div className="bg-[#10b981] h-[8px] relative rounded-[2px] shrink-0 w-[38px]" />
            <div className="bg-[#cbd5de] h-[8px] relative rounded-[4px] shrink-0 w-[37px]" />
          </div>
          <div className="font-normal leading-[normal] not-italic overflow-clip relative shrink-0 text-[#64748a] text-[11px] w-[346px] whitespace-nowrap">
            <p className="absolute left-0 top-0">6 AM</p>
            <p className="absolute left-[43.67px] top-0">9 AM</p>
            <p className="absolute left-[99.33px] top-0">12 PM</p>
            <p className="absolute left-[159.5px] top-0">3 PM</p>
            <p className="absolute left-[217.17px] top-0">6 PM</p>
            <p className="absolute left-[274.83px] top-0">9 PM</p>
            <p className="absolute left-[313px] top-0">12 AM</p>
          </div>
        </div>

        {/* Current Status Header */}
        <div className="flex h-[21px] items-center justify-between relative w-[374px]">
          <p className="font-semibold leading-[24px] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">Current Status</p>
          <div className="bg-[#ddd] flex gap-[6px] items-center justify-center overflow-clip p-[5px] relative rounded-[10px] shrink-0">
            <div className="bg-[rgba(66,133,244,0.14)] overflow-clip relative rounded-[6px] shrink-0 size-[20px]">
              <div className="absolute left-[4px] size-[12px] top-[4px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("42d53.svg")} />
              </div>
            </div>
            <p className="font-medium leading-[normal] not-italic relative shrink-0 text-[#0b1c30] text-[13px] whitespace-nowrap">Updated 5 min ago</p>
          </div>
        </div>

        {/* Report Current Status Button */}
        <Link href="/student/rate" className="flex h-[48px] w-full items-center justify-center gap-[10px] overflow-clip rounded-[10px] bg-[#f97316]">
          <div className="flex gap-[10px] h-[20px] items-center justify-center overflow-clip relative w-[345px]">
            <div className="relative shrink-0 size-[18px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("2d974.svg")} />
            </div>
            <p className="font-semibold leading-[normal] not-italic relative shrink-0 text-left text-white text-[14px] whitespace-nowrap">Report Current Status</p>
          </div>
          <div className="relative shrink-0 size-[16px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("d45b6.svg")} />
          </div>
        </Link>

        {/* Amenities & Features Grid */}
        <div className="flex flex-col gap-[15px] items-start relative w-full">
          <div className="flex items-center justify-between relative w-full">
            <div className="flex flex-col items-start relative">
              <p className="font-bold leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">Amenities & Features</p>
            </div>
            <div className="flex flex-col items-start relative">
              <p className="font-semibold leading-[0] not-italic relative shrink-0 text-[#9d4300] text-[11px] tracking-[0.33px] whitespace-nowrap">6 Included</p>
            </div>
          </div>

          <div className="grid gap-x-[8px] gap-y-[8px] grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[56px_56px_56px] relative w-full">
            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 w-[27.88px] h-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("e70fe.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Study Carrels</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">Individual quiet desks</p>
              </div>
            </div>
            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("1f4f4.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Open Study Tables</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">350 total seats</p>
              </div>
            </div>
            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 w-[30.83px] h-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("165b6.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Campus Wi-Fi</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">CITes network access</p>
              </div>
            </div>

            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("c6e1e.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Power Outlets</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">At every study desk</p>
              </div>
            </div>
            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 w-[28.13px] h-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("4dc4b.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Bag Counter</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">At the main entrance</p>
              </div>
            </div>
            <div className="bg-[#ddd] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] flex gap-[10px] h-[56px] items-center p-[12px] relative rounded-[12px]">
              <div className="bg-[#e5eeff] flex items-center justify-center relative rounded-[8px] shrink-0 size-[32px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("f5477.svg")} />
              </div>
              <div className="flex flex-col items-start">
                <p className="font-semibold leading-[16px] text-[12px] tracking-[0.3px] text-[#0b1c30] overflow-hidden whitespace-nowrap">Silent Policy</p>
                <p className="font-medium leading-[14px] text-[11px] tracking-[0.33px] text-[#515f74] overflow-hidden whitespace-nowrap">Monitored at all times</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student Ratings & Reviews Section */}
        <div className="flex flex-col gap-[16px] items-start relative w-full">
          <div className="flex items-center justify-between relative w-full">
            <div className="flex flex-col items-start relative w-full">
              <p className="font-bold leading-[0] not-italic relative shrink-0 text-[#0b1c30] text-[18px] whitespace-nowrap">Student Reviews</p>
              <p className="font-medium leading-[0] not-italic relative shrink-0 text-[#515f74] text-[11px] tracking-[0.33px] whitespace-nowrap">Verified campus peer feedback</p>
            </div>
            <button className="bg-[#ffdbca] cursor-pointer flex gap-[4px] items-center px-[12px] py-[6px] relative rounded-full shrink-0">
              <div className="relative shrink-0 size-[14px]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("4d7f0.svg")} />
              </div>
              <p className="font-bold leading-[14px] text-[11px] tracking-[0.33px] text-[#341100] whitespace-nowrap">Add Review</p>
            </button>
          </div>

          {/* Student Rating Card */}
          <div className="bg-white border border-[#e2e8f0] border-solid drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] w-full">
            <div className="flex gap-[12px] h-[44px] items-center relative w-[342px]">
              <div className="bg-[rgba(245,158,11,0.14)] relative rounded-[13px] shrink-0 size-[44px]">
                <div className="absolute left-[11px] size-[22px] top-[11px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("c8f66.svg")} />
                </div>
              </div>
              <div className="content-stretch flex flex-col gap-[3px] h-[44px] items-start not-italic relative w-[286px] whitespace-nowrap">
                <p className="font-semibold leading-[24px] relative shrink-0 text-[#0b1c30] text-[18px]">Highly rated</p>
                <p className="font-normal leading-[16px] relative shrink-0 text-[#64748b] text-[12px]">Based on verified campus check-ins</p>
              </div>
            </div>
            <div className="bg-[#e2e8f0] h-px relative shrink-0 w-[342px]" />
            <div className="flex flex-col gap-[6px] h-[50px] items-start relative w-[342px]">
              <p className="font-medium leading-[14px] not-italic relative shrink-0 text-[#64748b] text-[11px] whitespace-nowrap">Most mentioned</p>
              <div className="flex gap-[8px] h-[30px] items-center relative w-[342px]">
                <div className="bg-[#f0f0f0] flex h-[30px] items-center justify-center px-[12px] relative rounded-full shrink-0">
                  <p className="font-medium leading-[18px] not-italic relative shrink-0 text-[#333] text-[13px] whitespace-nowrap">Quiet</p>
                </div>
                <div className="bg-[#f0f0f0] flex h-[30px] items-center justify-center px-[12px] relative rounded-full shrink-0">
                  <p className="font-medium leading-[18px] not-italic relative shrink-0 text-[#333] text-[13px] whitespace-nowrap">Plenty of outlets</p>
                </div>
              </div>
            </div>

            {/* Review Card */}
            <div className="bg-white border border-[#e2e8f0] border-solid drop-shadow-[0px_2px_3px_rgba(0,0,0,0.06)] flex flex-col gap-[12px] items-start p-[16px] relative rounded-[12px] w-full">
              <div className="flex gap-[6px] items-start relative w-[196px]">
                <div className="relative shrink-0 size-[32px] overflow-clip rounded-full bg-[#ddd]">
                  <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src="/assets/results/bd7bd.svg" />
                </div>
                <div className="flex flex-col gap-[3px] h-[38px] items-start relative w-[196px]">
                  <div className="flex gap-[6px] h-[20px] items-start relative w-[196px]">
                    <p className="font-bold leading-[20px] not-italic relative shrink-0 text-[#0b1c30] text-[14px] whitespace-nowrap">Elena Rostova</p>
                    <div className="bg-[#e5eeff] flex h-[15px] items-start px-[6px] relative rounded-[4px] shrink-0">
                      <p className="font-semibold leading-[15px] not-italic relative shrink-0 text-[#515f74] text-[10px] whitespace-nowrap">Architecture &apos;27</p>
                    </div>
                  </div>
                  <p className="font-medium leading-[14px] not-italic relative shrink-0 text-[#515f74] text-[11px] whitespace-nowrap">Yesterday • Table 5</p>
                </div>
              </div>
              <p className="font-normal leading-[22px] not-italic relative shrink-0 text-[#0b1c30] text-[14px] w-[342px]">Grabbed a shared table with friends last night. Carrels fill up by mid-morning, so come early if you want one — outlets are everywhere and it stays whisper quiet until closing at 10.</p>
              <div className="flex gap-[8px] h-[32px] items-center relative w-[342px]">
                <div className="bg-white border border-[#e2e8f0] border-solid flex gap-[6px] h-[32px] items-center justify-center px-[12px] relative rounded-[10px] shrink-0">
                  <div className="relative shrink-0 size-[14px]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("1a706.svg")} />
                  </div>
                  <p className="font-medium leading-[16px] not-italic relative shrink-0 text-[#515f74] text-[12px] whitespace-nowrap">Helpful</p>
                </div>
                <div className="flex-1 h-px min-w-px relative" />
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>
  );
}
