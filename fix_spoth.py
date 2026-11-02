import os

path = 'C:/Users/dev.srh/Desktop/studyspot/src/app/student/results/[id]/page.tsx'

with open(path, 'r') as f:
    content = f.read()

# Find and replace the spot header section
old_spot_header = """      {/* Spot Header & Location Metadata */}
      <div className="flex flex-col items-start gap-[4px]">
        <h1 className="font-medium text-[22px] leading-[35px] tracking-[-0.7px] text-[#0b1c30] whitespace-nowrap">UoM Library — Basement Study Hall</h1>
        <div className="flex gap-[8px] items-center">
          <div className="flex items-center">
            <div className="relative shrink-0 w-[15px] h-[14.25px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("b39e0.svg")} />
            </div>
            <div className="flex flex-col items-start pl-[4px]">
              <p className="font-bold leading-[24px] text-[#0b1c30] whitespace-nowrap">4.9</p>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-normal leading-[20px] text-[#515f74] text-[14px] whitespace-nowrap">(128 student reviews)</p>
          </div>
          <div className="bg-[#e0c0b1] rounded-full size-[4px]" />
          <div className="flex gap-[2px] items-center">
            <div className="relative shrink-0 size-[10.5px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={d("dba7b.svg")} />
            </div>
            <p className="font-semibold leading-[14px] text-[11px] tracking-[0.33px] text-[#9d4300] whitespace-nowrap">Staff Monitored</p>
          </div>
        </div>
      </div>
"""

new_spot_header = """      {/* Spot Header & Location Metadata */}
      <div className="flex flex-col items-start gap-[4px]">
        <h1 className="font-medium leading-[35px] tracking-[-0.7px] text-[22px] text-[#0b1c30]">UoM Library — Basement Study Hall</h1>
        <div className="flex gap-[8px] items-center">
          <div className="flex items-center">
            <div className="flex size-[13px] items-center justify-center">
              <img alt="" className="size-full" src={d("b39e0.svg")} />
            </div>
            <div className="flex flex-col items-start pl-[6px]">
              <p className="font-bold leading-[24px] text-[14px] text-[#0b1c30]">4.9</p>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-medium leading-[20px] text-[12px] text-[#515f74]">University Library · Basement floor</p>
          </div>
          <div className="bg-[#e0c0b1] size-[4px] shrink-0 rounded-full" />
          <div className="flex size-[16px] items-center justify-center">
            <img alt="" className="size-full" src={d("dba7b.svg")} />
          </div>
          <p className="font-semibold leading-[14px] text-[11px] tracking-[0.33px] text-[#9d4300] whitespace-nowrap">Staff Monitored</p>
        </div>
      </div>
"""

if old_spot_header in content:
    content = content.replace(old_spot_header, new_spot_header)
    with open(path, 'w') as f:
        f.write(content)
    print('Done! Spot header updated.')
else:
    print('Old spot header not found')
