import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { SupabaseVectorStore } from 'langchain/vectorstores';
import { CustomPDFLoader , CustomCSVLoader, CustomTextLoader, CustomMarkdownLoader } from '@/utils/customPDFLoader';
import { DirectoryLoader } from 'langchain/document_loaders';
import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

/* Name of directory to retrieve your files from */
const filePath = 'public/docs';

const privateKey = process.env.SUPABASE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

export const run = async () => {
  try {
    /*load raw docs from the all files in the directory */
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new CustomPDFLoader(path),
      '.csv': (path) => new CustomCSVLoader(path),
      '.txt':(path) => new CustomTextLoader(path),
      '.md':(path) => new CustomMarkdownLoader(path),
    });

    // const loader = new PDFLoader(filePath);
    const rawDocs = await directoryLoader.load();

    /* Split text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('split docs', docs);

    console.log('creating vector store...');
    /*create and store the embeddings in the vectorStore*/
    const embeddings = new OpenAIEmbeddings();

    const client = createClient(url, privateKey);

    //embed the PDF documents
    await SupabaseVectorStore.fromDocuments(docs, embeddings,
      {
        client,
        tableName: "documents",
        queryName: "matching_docs",
      });
  } catch (error) {
    console.log('error', error);
    throw new Error('Failed to ingest your data');
  }
};

(async () => {
  await run();
  console.log('ingestion complete');
})();
