// TODO: create types for FileUpload params as well

import { forwardRef } from "react";

interface FileUploadProps {
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// export default function FileUpload({ handleFileChange }: FileUpload) {
//   return (
//     <div id="file-upload">
//       <label htmlFor="file" className="sr-only">
//         Choose a file
//       </label>
//       <input id="file" type="file" onChange={handleFileChange} />
//     </div>
//   );
// }

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ handleFileChange }, ref) => {
    return (
      <div className="flex flex-col">
        <label htmlFor="file" className="text-[2rem] font-bold font-white">
          Choose a file
        </label>
        <input
          className="w-fit bg-[#323232] rounded-[5px] outline-none"
          type="file"
          onChange={handleFileChange}
          ref={ref}
          accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>
    );
  }
);

export default FileUpload;
