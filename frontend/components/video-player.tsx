import React from "react";

// This imports the functional component from the previous sample.
import VideoJS from "./videoJs";

export const VideoPlayer = ({ url, onLoad, isGrid }: any) => {
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    // responsive: true,
    sources: [
      {
        src: url,
        type: "video/mp4",
      },
    ],
  };

  return <VideoJS options={videoJsOptions} onLoad={onLoad} isGrid={isGrid} />;
};
