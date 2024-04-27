// import { GetServerSideProps, NextPage } from 'next';
// import { useState, useEffect, SetStateAction } from 'react';
// import axios from 'axios';
// import fs from 'fs/promises';
// import path from 'path';
// import Link from 'next/link';
// import { run } from '@/scripts/ingest-data';
// import { supabase } from '../utils/supabase-client';

// import Switch from 'react-switch';
// import React from 'react';

// interface Props {
//   dirs: string[];
//   files: string[];
// }

// const Home: NextPage<Props> = ({ files }) => {
//   const [uploading, setUploading] = useState(false);
//   const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [allfiles, setallFiles] = useState<string[]>([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [ingesting, setIngesting] = useState(false);
//   const [ingested, setIngested] = useState(false);
//   const [apiRespone, setApiResponse] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedTempFiles, SetSelectedTempFiles] = useState<File[]>([]);

//   const validUsername = process.env.NEXT_PUBLIC_USERNAME;
//   const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleSubmit = (event: any) => {
//     event.preventDefault();
//     if (username == validUsername && password == validPassword) {
//       // If the email and password match, redirect to the home page
//       setIsLoggedIn(true);
//     } else {
//       // Otherwise, show an error message
//       setErrorMessage('Incorrect email or password');
//     }
//   };

//   const handleFileSelection = (files: FileList) => {
//     setApiResponse('');
//     const newFiles = Array.from(files);
//     setSelectedFiles((prevSelectedFiles) => [
//       ...prevSelectedFiles,
//       ...newFiles,
//     ]);
//     setSelectedDocs((prevSelectedDocs) => [
//       ...prevSelectedDocs,
//       ...newFiles.map((file) => file.name),
//     ]);
//   };

//   const handleFileDelete = (index: number) => {
//     setApiResponse('');
//     setSelectedDocs((prevSelectedDocs) => {
//       const updatedSelectedDocs = [...prevSelectedDocs];
//       updatedSelectedDocs.splice(index, 1);
//       return updatedSelectedDocs;
//     });
//     setSelectedFiles((prevSelectedFiles) => {
//       const updatedSelectedFiles = [...prevSelectedFiles];
//       updatedSelectedFiles.splice(index, 1);
//       return updatedSelectedFiles;
//     });
//   };

//   const getFiles = async () => {
//     try {
//       const response = await fetch('/api/upload');
//       const data = await response.json();
//       return data.files;
//     } catch (error) {
//       console.error('Error fetching files:', error);
//       return [];
//     }
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     setApiResponse('Uploading your files. Please wait...');
//     try {
//       if (selectedFiles.length === 0) return;
//       const formData = new FormData();
//       selectedFiles.forEach((file) => {
//         formData.append('myImages', file);
//       });
//       const { data } = await axios.post('/api/upload', formData);
//       console.log(data);
//       setApiResponse('Sucessfully uploaded!');
//     } catch (error: any) {
//       console.log(error.response?.data);
//       setApiResponse('Failed to upload files -_-');
//     }
//     setUploading(false);
//   };

//   const ClearLocalDir = async () => {
//     try {
//       const response = await fetch('/api/deleteTempFiles', {
//         method: 'DELETE',
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data.message);
//       } else {
//         console.error('Failed to delete files');
//       }
//     } catch (error) {
//       console.error('Error deleting files:', error);
//     }
//   };

//   async function runCommand() {
//     // copyFilesToTempFolderonClick()
//     const command = `npm run ingest`;
//     setIngesting(true);
//     setApiResponse('Ingesting your data. Please wait...');
//     const response = await fetch('/api/runCommand', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ command }),
//     });
//     if (response.ok) {
//       const output = await response.text();
//       console.log(output);
//       setApiResponse('Succesfully ingested your data!');
//     } else {
//       const error = await response.text();
//       console.error(error);
//       setApiResponse('Error ingesting your data -_-');
//     }
//     setIngesting(false);
//     setIngested(true);
//   }

//   // const allfiless = ["file1.txt", "file2.txt", "file3.txt"];

//   console.log('allfiles are ', allfiles);
//   console.log(typeof allfiles);

//   const addFilesToSupabase = async () => {
//     const filesArray = await getFiles();

//     const filesData = filesArray.map((file: any) => ({ file_name: file }));
//     console.log('fileData is ', filesData);
//     console.log('type of file data are', typeof filesData);

//     try {
//       const { data, error } = await supabase.from('files').insert(filesData);

//       if (error) {
//         console.error('Error adding files to Supabase:', error.message);
//       } else {
//         console.log('Files added to Supabase successfully:', data);
//       }
//     } catch (error: any) {
//       console.error('Error:', error.message);
//     }
//   };

//   const [values, setValues] = useState<string[]>([]);

//   const fetchData = async () => {
//     try {
//       const { data, error } = await supabase.from('files').select('file_name');

//       if (error) {
//         console.error('Error fetching data from Supabase:', error.message);
//       } else {
//         const fileNames = data.map((row) => row.file_name);
//         console.log('file names are', fileNames);
//         setValues(fileNames);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleButtonclick = async () => {
//     await handleUpload();
//     await getFiles();
//     await runCommand();
//     await addFilesToSupabase();
//     await ClearLocalDir();
//     await fetchData();
//   };

//   if (!isLoggedIn) {
//     return (
//       <div>
//         <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
//           <div className="relative py-3 sm:max-w-xl sm:mx-auto">
//             <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
//             <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
//               <div className="max-w-md mx-auto">
//                 <div>
//                   <h1 className="text-2xl font-bold text-center">
//                     <span className="text-xl font-semibold">Login to</span>
//                     <br />
//                     Upload and Ingest
//                   </h1>
//                 </div>
//                 <div className="divide-y divide-gray-200">
//                   <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={username}
//                         onChange={(e) => setUsername(e.target.value)}
//                         className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
//                         placeholder="Username"
//                       />
//                       <label className="">Username</label>
//                     </div>
//                     <div className="relative">
//                       <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
//                         placeholder="Password"
//                       />
//                       <label className="">Password</label>
//                     </div>
//                     <div className="relative">
//                       <button
//                         className="bg-gray-900 text-white rounded-md px-6 py-2"
//                         onClick={handleSubmit}
//                       >
//                         Log In
//                       </button>
//                     </div>
//                     <div className="text-sm text-red-700">
//                       {errorMessage && <p>{errorMessage}</p>}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full h-screen bg-white mx-auto md:px-20 px-8 flex flex-col items-center pt-5">
//       <div className=" flex flex-col space-y-5">
//         <h1 className="text-black md:text-5xl text-3xl text-center font-bold">
//           Upload Files and Create Dataset
//         </h1>
//         <label>
//           <input
//             type="file"
//             multiple
//             hidden
//             onChange={({ target }) =>
//               handleFileSelection(target.files as FileList)
//             }
//           />
//         </label>
//         <div className="md:flex flex-1 md:space-x-8 space-x-0 space-y-6 md:space-y-0 ">
//           <div className="max-w-5xl text-black border-2 border-black border-dotted p-3 space-y-2 h-full">
//             <h1 className=" text-center text-black text-3xl font-bold mb-3">
//               Select and upload Docs
//             </h1>
//             <div className=" overflow-auto h-[400px] space-y-2 px-1">
//               {selectedDocs.length > 0 ? (
//                 selectedDocs.map((filename, index) => (
//                   <div
//                     className="rounded-md border border-black filter drop-shadow-sm p-5 flex justify-between items-center space-x-3"
//                     key={index}
//                   >
//                     <span className="font-medium flex space-x-3">
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         className="fill-blue-400"
//                       >
//                         <path d="M19.903 8.586a.997.997 0 0 0-.196-.293l-6-6a.997.997 0 0 0-.293-.196c-.03-.014-.062-.022-.094-.033a.991.991 0 0 0-.259-.051C13.04 2.011 13.021 2 13 2H6c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V9c0-.021-.011-.04-.013-.062a.952.952 0 0 0-.051-.259c-.01-.032-.019-.063-.033-.093zM16.586 8H14V5.414L16.586 8zM6 20V4h6v5a1 1 0 0 0 1 1h5l.002 10H6z"></path>
//                         <path d="M8 12h8v2H8zm0 4h8v2H8zm0-8h2v2H8z"></path>
//                       </svg>
//                       {filename}
//                     </span>
//                     <button onClick={() => handleFileDelete(index)}>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         width="24"
//                         height="24"
//                         viewBox="0 0 24 24"
//                         className="fill-gray-400"
//                       >
//                         <path d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"></path>
//                       </svg>
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <span className="mx-1">No files are selected</span>
//               )}
//             </div>
//             <div className=" flex space-x-3">
//               <button
//                 onClick={() =>
//                   (
//                     document.querySelector(
//                       'input[type="file"]',
//                     ) as HTMLInputElement
//                   )?.click()
//                 }
//                 className="bg-blue-600 p-3 w-32 text-center rounded text-white flex justify-center items-center"
//               >
//                 <span>Select Files</span>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   className="fill-white"
//                 >
//                   <path d="M6 22h12a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm7-18 5 5h-5V4zM8 14h3v-3h2v3h3v2h-3v3h-2v-3H8v-2z"></path>
//                 </svg>
//               </button>

//               <button
//                 onClick={handleButtonclick}
//                 disabled={uploading || selectedFiles.length === 0}
//                 style={{ opacity: uploading ? '.5' : '1' }}
//                 className="bg-black p-3 w-32 text-center rounded text-white flex justify-center items-center"
//               >
//                 {uploading ? 'Creating dataset..' : 'Upload & Ingest'}
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   className="fill-white"
//                 >
//                   <path d="M18.944 11.112C18.507 7.67 15.56 5 12 5 9.244 5 6.85 6.611 5.757 9.15 3.609 9.792 2 11.82 2 14c0 2.757 2.243 5 5 5h11c2.206 0 4-1.794 4-4a4.01 4.01 0 0 0-3.056-3.888zM13 14v3h-2v-3H8l4-5 4 5h-3z"></path>
//                 </svg>
//               </button>
//             </div>
//           </div>
//           <div className="max-w-5xl text-black space-y-2 border border-gray-300 rounded-md bg-slate-200 p-3">
//             <h1 className=" text-center text-black text-3xl font-bold mb-3">
//               Uploaded Documents
//             </h1>
//             <ul className="text-black px-4 overflow-auto h-[400px]">
//               {values.map((file) => (
//                 <li
//                   className="space-x-6 flex items-center my-4 justify-between border-b-2 border-gray-200 py-2"
//                   key={file}
//                 >
//                   <div className="font-semibold md:text-[16px]">{file} </div>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="flex space-x-5 text-black md:justify-end justify-center items-center">
//           <div className="flex flex-col space-y-2">
//             <h1 className="text-black italic font-medium">{apiRespone}</h1>
//           </div>
//         </div>

//         <div></div>
//       </div>
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async () => {
//   const props: Props = {
//     files: [],
//     dirs: [],
//   };
//   try {
//     const dirPath = path.join(process.cwd(), '/public/docs');
//     const files = await fs.readdir(dirPath);
//     const filteredFiles = await Promise.all(
//       files.map(async (file) => {
//         const filePath = path.join(dirPath, file);
//         const stat = await fs.stat(filePath);
//         return stat.isFile() ? file : null;
//       }),
//     );
//     props.files = filteredFiles.filter((file) => file !== null) as string[];
//     return { props };
//   } catch (error) {
//     return { props };
//   }
// };

// export default Home;
