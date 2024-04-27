import { GetServerSideProps, NextPage } from 'next';
import { useState, useEffect, SetStateAction } from 'react';
import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { run } from '@/scripts/ingest-data';
import { supabase } from '../utils/supabase-client';

import Switch from 'react-switch';
import React from 'react';
import Table from '@/components/Table';
import FileUpload from '@/components/uploadToBucketButton';

interface Props {
  dirs: string[];
  files: string[];
}

const Admin: NextPage<Props> = ({ files }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [allfiles, setallFiles] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [ingested, setIngested] = useState(false);
  const [apiRespone, setApiResponse] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedTempFiles, SetSelectedTempFiles] = useState<File[]>([]);

  const validUsername = process.env.NEXT_PUBLIC_USERNAME;
  const validPassword = process.env.NEXT_PUBLIC_PASSWORD;

  const [bucketData, setBucketData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data, error } = await supabase.from('files_info').select('*');

        if (error) {
          throw error;
        }

        setBucketData(data);
      } catch (error) {
        console.error('Error fetching files_info:', error);
      }
    };

    // Set up Supabase real-time subscription
    const insertChannel = supabase.channel('files_info');

    insertChannel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'files_info' },
        fetchSubjects,
      )
      .subscribe();

    fetchSubjects();
  }, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (username == validUsername && password == validPassword) {
      // If the email and password match, redirect to the home page
      setIsLoggedIn(true);
    } else {
      // Otherwise, show an error message
      setErrorMessage('Incorrect email or password');
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
          <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
            <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
              <div className="max-w-md mx-auto">
                <div>
                  <h1 className="text-2xl font-bold text-center">
                    <span className="text-xl font-semibold">Login to</span>
                    <br />
                    Upload and Ingest
                  </h1>
                </div>
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Username"
                      />
                      <label className="">Username</label>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="rounded-md peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Password"
                      />
                      <label className="">Password</label>
                    </div>
                    <div className="relative">
                      <button
                        className="bg-gray-900 text-white rounded-md px-6 py-2"
                        onClick={handleSubmit}
                      >
                        Log In
                      </button>
                    </div>
                    <div className="text-sm text-red-700">
                      {errorMessage && <p>{errorMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center w-screen h-screen overflow-hidden bg-white p-10">
        <div className="border-gray-600 border w-full h-full">
          <div className="border-b p-6 flex flex-row items-center justify-between">
            <h1 className="text-start text-2xl font-semibold">
              Recruitment Guideline
            </h1>
            <FileUpload />
          </div>
          <div className="p-5 rounded-sm h-[400px] overflow-y-auto">
            <Table data={bucketData} />
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const props: Props = {
    files: [],
    dirs: [],
  };
  try {
    const dirPath = path.join(process.cwd(), '/public/docs');
    const files = await fs.readdir(dirPath);
    const filteredFiles = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file);
        const stat = await fs.stat(filePath);
        return stat.isFile() ? file : null;
      }),
    );
    props.files = filteredFiles.filter((file) => file !== null) as string[];
    return { props };
  } catch (error) {
    return { props };
  }
};

export default Admin;
