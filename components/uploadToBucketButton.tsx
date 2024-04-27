import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/supabase-client';

const FileUpload = () => {
  const [fileInfoArray, setFileInfoArray] = useState<
    { name: string; batches: number; textSize: number; status: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFileChange = async () => {
      if (fileInputRef.current && fileInputRef.current.files) {
        const files = fileInputRef.current.files;

        const uploadFiles = async () => {
          const fileArray = Array.from(files);

          for (const file of fileArray) {
            try {
              // Replace spaces with underscores in the file name
              const newName = file.name.replace(/ /g, '_');

              const fileInfoDataBefore = {
                name: newName,
                batches: Math.ceil(file.size / 1024),
                text_size: file.size,
                status: 'uploading',
              };

              const { data: insertDataBefore, error: insertErrorBefore } = await supabase
                .from('files_info')
                .insert([fileInfoDataBefore]);

              if (insertErrorBefore) {
                console.error(
                  'Error inserting data in files_info before upload:',
                  insertErrorBefore.message,
                );
              } else {
                console.log('Data inserted in files_info before upload:', insertDataBefore);
              }

              const { data, error } = await supabase.storage
                .from('files')
                .upload(`${newName}`, file); // Use the modified file name here

              let fileInfoData = {
                name: newName,
                batches: Math.ceil(file.size / 1024),
                text_size: file.size,
                status: 'uploaded',
              };

              if (error) {
                console.error('Error uploading file:', error.message);
                fileInfoData = {
                  name: newName,
                  batches: Math.ceil(file.size / 1024),
                  text_size: file.size,
                  status: 'error',
                };
              }

              const { data: insertData, error: insertError } = await supabase
                .from('files_info')
                .update([fileInfoData])
                .eq('name', newName);

              if (insertError) {
                console.error(
                  'Error inserting data in files_info after upload:',
                  insertError.message,
                );
              } else {
                console.log('Data inserted in files_info after upload:', insertData);
              }
            } catch (uploadError: any) {
              console.error('Error during file upload:', uploadError.message);
            }
          }
        };

        uploadFiles();
      }
    };

    if (fileInputRef.current) {
      fileInputRef.current.addEventListener('change', handleFileChange);
    }

    return () => {
      if (fileInputRef.current) {
        fileInputRef.current.removeEventListener('change', handleFileChange);
      }
    };
  }, []);

  return (
    <div className="mt-4">
      <label
        htmlFor="fileInput"
        className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer"
      >
        Select Files
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        ref={fileInputRef}
      />
    </div>
  );
};

export default FileUpload;
