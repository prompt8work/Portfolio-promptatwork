// Loading state for PromptAtWork TV (TV-VideoStates board, "Loading"):
// skeleton cards in the grid's shape while the video list is fetched.
export default function Loading() {
  return (
    <div className="paw-page min-h-screen" aria-busy="true" aria-label="Loading videos">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-[124px] pb-20">
        <div className="mx-auto h-11 max-w-[640px] rounded-full bg-surface-container-highest" />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10" aria-hidden="true">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex flex-col gap-3 animate-pulse motion-reduce:animate-none">
              <div className="aspect-video rounded-2xl bg-surface-container-highest" />
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-3.5 rounded bg-surface-container-highest" />
                  <div className="h-3.5 w-[70%] rounded bg-surface-container-highest" />
                  <div className="h-3 w-[45%] rounded bg-surface-container-high" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
