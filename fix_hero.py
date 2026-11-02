import os

path = 'C:/Users/dev.srh/Desktop/studyspot/src/app/student/results/[id]/page.tsx'

with open(path, 'r') as f:
    content = f.read()

# Create the hero section HTML
hero_section = """      {/* Visual Hero Container */}
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

"""

# Find the old header section and replace it with header + hero
old_header = """      <div className="flex flex-col gap-[8px] px-[16px] pt-[56px] pb-[10px] relative">
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
"""

new_header_with_hero = old_header + hero_section

if old_header in content:
    content = content.replace(old_header, new_header_with_hero)
    with open(path, 'w') as f:
        f.write(content)
    print('Done! Hero section added.')
else:
    print('Old header not found')
