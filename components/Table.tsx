// components/Table.tsx
import React from 'react';
import Actions from './actions';
import { Button, Tooltip } from 'flowbite-react';
import { FcOk, FcHighPriority } from 'react-icons/fc';
import { BsDatabaseFillCheck } from 'react-icons/bs';
import { CgSpinnerTwo } from 'react-icons/cg';

interface TableProps {
  data: Array<{
    name: string;
    batches: number;
    text_size: number;
    status: string;
    // Add more fields as needed
  }>;
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="w-full  border rounded-md flex flex-col">
      <table className="w-full">
        <caption className="text-start text-xl font-semibold border-b p-2">
          Documents
        </caption>
        <thead className="text-start">
          <tr>
            <th className="p-2 text-start">Name</th>
            <th className="p-2 text-start">No. of 1KB Batches</th>
            <th className="p-2 text-start">Text Size</th>
            <th className="p-2 text-start">Status</th>
            <th className="p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? 'bg-gray-100 w-full' : 'bg-white w-full'
              }
            >
              <td className="p-2 w-[40%]">{item.name}</td>
              <td className="p-2 w-[15%]">{item.batches}</td>
              <td className="p-2 w-[15%]">{item.text_size}</td>
              <td className="py-2 pr-10 w-[20%] ">
                {/* <div className={item.status == 'uploading'? "border border-yellow-500 text-yellow-500 rounded-full text-center p-1" : item.status == 'uploaded'? "border border-black text-black rounded-full text-center p-1" : item.status == 'ingested'? "border border-green-400 text-green-400 rounded-full text-center p-1" : ""}>
            {item.status}</div> */}
                {item.status == 'deleting' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="red"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-red-600" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'uploading' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="yellow"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-yellow-400" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'uploaded' ? (
                  <Tooltip content='File has uploaded to file storage'>
                                      <Button size="sm" color="green">
                    {item.status}
                    <BsDatabaseFillCheck className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : item.status == 'ingesting' ? (
                  <Button
                    size="sm"
                    isProcessing
                    color="yellow"
                    processingSpinner={
                      <CgSpinnerTwo className="h-4 w-4 animate-spin fill-yellow-400" />
                    }
                  >
                    {item.status}
                  </Button>
                ) : item.status == 'ingested' ? (
                  <Tooltip content='File has uploaded and ingested to the dataset'>
                  <Button size="sm" color="green">
                    <h1 className="text-sm text-green-900 font-semibold">
                      {item.status}
                    </h1>
                    <FcOk className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : item.status == 'error' ? (
                  <Tooltip content='Error! Please check your database'>
                  <Button size="sm" color="red">
                    {item.status}
                    <FcHighPriority className="ml-2 h-5 w-5" />
                  </Button>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </td>
              <td className="p-2 w-[10%]">
                {/* Add your action buttons or links here */}
                <Actions FileName={item.name} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
