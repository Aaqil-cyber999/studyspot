content = open('C:/Users/dev.srh/Desktop/studyspot/src/app/university-admin/locations/preview/page.tsx').read()

old = """          ) : null}
        </div>

        {/* Spacer for fixed button */}
        <div aria-hidden className="h-[100px]" />

        {/* Fixed bottom button */}
        <div className="fixed bottom-0 left-1/2 z-30 -translate-x-1/2 border-t border-[#e2e8f0] bg-white/95 px-[24px] py-[12px] backdrop-blur w-full max-w-[412px]">
          <Button
            type="button"
            onClick={handleCreateLocation}
            variant="default"
            className="w-full px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
          >
            <MapPinned className="size-[18px] text-white" />
            <span>Create location</span>
          </Button>
        </div>
      </div>
    </div>
  );
}"""

new = """          ) : null}
        </div>

      </div>

      {/* Spacer for fixed button */}
      <div aria-hidden className="h-[100px]" />

      {/* Fixed bottom button */}
      <div className="fixed bottom-0 left-1/2 z-30 -translate-x-1/2 border-t border-[#e2e8f0] bg-white/95 px-[24px] py-[12px] backdrop-blur w-full max-w-[412px]">
        <Button
          type="button"
          onClick={handleCreateLocation}
          variant="default"
          className="w-full px-[16px] py-[20px] text-[14px] font-medium shadow-[0px_6px_16px_rgba(249,115,22,0.25)] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
        >
          <MapPinned className="size-[18px] text-white" />
          <span>Create location</span>
        </Button>
      </div>
    </div>
  );
}"""

if old in content:
    content = content.replace(old, new)
    open('C:/Users/dev.srh/Desktop/studyspot/src/app/university-admin/locations/preview/page.tsx', 'w').write(content)
    print('done')
else:
    print('not found')
"