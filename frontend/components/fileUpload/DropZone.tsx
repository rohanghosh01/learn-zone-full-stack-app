import { FileVideo, Image, X } from "lucide-react";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["JPEG", "PNG", "GIF", "MP4", "JPG"];

function MyDiv({ file, onRemove }: { file: any; onRemove: () => void }) {
  let type = file?.content?.type.split("/")[0] || "";

  return (
    <div className="relative flex h-[300px] w-[400px] items-center justify-center rounded-md border border-dashed text-sm">
      {file ? (
        <>
          <button
            className="absolute top-[-10px] right-[-10px] bg-red-600 hover:bg-red-800 rounded-full"
            onClick={onRemove}
          >
            <X className="w-6 h-6" />
          </button>
          {type === "video" ? (
            <div>
              {/* Display video */}
              <video controls className="h-[250px] rounded-md">
                <source src={file.preview} type={file.content.type} />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="">
              {/* Display image */}
              <img
                src={file.preview}
                className="h-[250px] rounded-md"
                alt="Preview"
              />
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4 mt-[-100px] content-center items-center justify-center">
          <h2 className="text-lg font-semibold">Upload files</h2>
          <div className="flex gap-4 ">
            <Image className="w-10 h-10" />
            <FileVideo className="w-10 h-10" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DropZone({ files, setFiles }: any) {
  const handleChange = (file: any) => {
    if (file) {
      let preview = URL.createObjectURL(file[0]);
      setFiles({ preview, content: file[0] });
    }
  };

  const handleRemove = () => {
    setFiles(null);
  };

  return (
    <FileUploader
      multiple={true}
      handleChange={handleChange}
      name="file"
      types={fileTypes}
      children={<MyDiv file={files} onRemove={handleRemove} />}
    />
  );
}
