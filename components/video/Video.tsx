import { useInView } from "../../hooks/useInView";
import { VideoType } from "../../types";
import cx from "clsx";
import React, { ComponentType, lazy, useRef } from "react";

const MuxPlayer = lazy<ComponentType<VideoType>>(
  () => import(/* webpackChunkName: "MuxPlayer" */ "./MuxPlayer"),
);

const YoutubePlayer = lazy<ComponentType<VideoType>>(
  () => import(/* webpackChunkName: "YoutubePlayer" */ "./YoutubePlayer"),
);

const VimeoPlayer = lazy<ComponentType<VideoType>>(
  () => import(/* webpackChunkName: "VimeoPlayer" */ "./VimeoPlayer"),
);

const VideoPlayer = lazy<ComponentType<VideoType>>(
  () => import(/* webpackChunkName: "VideoPlayer" */ "./VideoPlayer"),
);

export type VideoProps = {
  className?: string;
  cover?: boolean;
} & VideoType;

export const Video = (props: VideoProps) => {
  let { provider, className, cover } = props;
  if (!className) className = "aspect-video relative";

  const wrapperRef = useRef<HTMLDivElement>(null);

  const lazyLoaded = useInView({
    elementRef: wrapperRef,
    threshold: 0.01,
    once: true,
  });

  const coverClassName = cover
    ? cx(
        `[&_div]:!h-full [&_div]:!static [&_div]:!p-0`,
        `[&_iframe]:!absolute [&_iframe]:!top-1/2 [&_iframe]:!left-1/2`,
        `[&_iframe]:!-translate-x-1/2 [&_iframe]:!-translate-y-1/2 [&_iframe]:!h-full [&_iframe]:!w-[1000vw]`,
        `[&_video]:object-cover [&_video]:!h-full [&_video]:!w-full`,
        `[&_.yt-lite]:h-full`,
      )
    : null;

  if (!lazyLoaded)
    return (
      <div
        ref={wrapperRef}
        className={cx("bg-black bg-opacity-5", className)}
      />
    );

  return (
    <div ref={wrapperRef} className={cx(coverClassName, className)}>
      {provider === "youtube" && <YoutubePlayer {...props} />}
      {provider === "vimeo" && <VimeoPlayer {...props} />}
      {provider === "mux" && <MuxPlayer {...props} />}
      {provider === "url" && <VideoPlayer {...props} />}
      {provider === "sanity" && <VideoPlayer {...props} />}
    </div>
  );
};

export default React.memo(Video);
