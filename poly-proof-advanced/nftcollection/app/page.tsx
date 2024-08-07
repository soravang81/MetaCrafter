"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ethers } from "ethers";
import NFTCollection from "../artifacts/contracts/NFTcollection.sol/NFTCollection.json";

type nft = {
  name : string,
  prompt : string,
  tokenUri : string,
}
export default function Home(): React.ReactNode {
  const [prompt, setPrompt] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [cid, setCid] = useState<string | null>(null);
  const [isMinted, setIsMinted] = useState<boolean>(false);
  const [nfts, setNfts] = useState<nft[]>([]);
  const [account, setAccount] = useState<string | null>(null);
 
  useEffect(() => {
    const loadAccount = async () => {
      if ((window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      }
    };
    loadAccount();
  }, []);

  const handleSubmit = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      const prompts = prompt.split(",");
      try {
        const imgRequests = prompts.map((p) =>
          axios({
            method: "POST",
            url: "https://api.edenai.run/v2/image/generation",
            headers: {
              authorization: `Bearer ${process.env.NEXT_PUBLIC_EDEN_API_KEY}`,
            },
            data: {
              providers: "replicate",
              text: p.trim(),
              resolution: "512x512",
            },
          })
        );

        const imgResponses = await Promise.all(imgRequests);
        const imgUrls = imgResponses.map(
          (res) => res.data.replicate.items[0].image_resource_url
        );

        const filePromises = imgUrls.map(async (url, index) => {
          const response = await axios.get(url, { responseType: "blob" });
          const blob = response.data;
          return new File([blob], `image_${index}.jpg`, { type: blob.type });
        });

        const filesArray = await Promise.all(filePromises);
        setFiles(filesArray);
        resolve('Images generated successfully');
      } catch (error) {
        console.error("Error generating images:", error);
        reject('Error generating images');
      }
    });

    toast.promise(myPromise, {
      loading: 'Loading...',
      success: (data) => {
        return `${data}`;
      },
      error: 'Error',
    });
  };

  const uploadFiles = async () => {
    const myPromise = new Promise(async (resolve, reject) => {
      try {
        const uploadPromises = files.map(async (file) => {
          const data = new FormData();
          data.set("file", file);
        
          const res = await axios.post('/api/files', data, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        
          const resData = res.data;
          return resData.IpfsHash;
        });

        const cids = await Promise.all(uploadPromises);
        setCid(cids.join(", "));
        resolve('Files uploaded successfully');
      } catch (e) {
        console.log(e);
        reject('Trouble uploading files');
      }
    });

    toast.promise(myPromise, {
      loading: 'Uploading...',
      success: (data) => {
        return `${data}`;
      },
      error: 'Error',
    });
  };

  const mintNFTs = async () => {
    try {
      const promptsArray = prompt.split(',').map(prompt => prompt.trim());
      const urisArray = (cid as string).split(',').map(uri => uri.trim());
      const namesArray = "MyNFT"

      const myPromise = new Promise(async (resolve, reject) => {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000));

          const response = await axios.post('/api/scripts/mint', {
            prompts: promptsArray,
            uris: urisArray,
            names : namesArray
          });
          console.log(response.data)
          resolve(response.data.message);
          setIsMinted(true)
        } catch (error) {
          console.log(error)
          reject('Failed to mint NFTs');
        }
      });

      // Display toast notification based on promise state
      toast.promise(myPromise, {
        loading: 'Minting...',
        success: (data) => `${data}`,
        error: 'Error',
      });
    } catch (error) {
      console.error('Error minting NFTs:', error);
      toast.error('Failed to mint NFTs');
    }
  };


  const transferNFTs = async () => {
    try {
  
      const myPromise = new Promise(async(resolve) => {
        const response = await axios.post('/api/scripts/transfer');
        const { message } = response.data;        
        setTimeout(() => {
          resolve(message);
        }, 2000); // Adjust delay as needed
      });
  
      toast.promise(myPromise, {
        loading: 'Transferring...',
        success: (data) => {
          return `NFTs transferred successfully: ${data}`;
        },
        error: 'Failed to transfer NFTs',
      });
    } catch (error) {
      console.error('Failed to transfer NFTs:', error);
      toast.error('Failed to transfer NFTs');
    }
  };
  
console.log(nfts)

  return (
    <div className="flex flex-col justify-center items-center absolute left-0 right-0 top-0 bottom-0">
      <div className="flex gap-4 flex-wrap">
        {files.map((file, index) => (
          <div key={index} className="flex flex-col items-center">
            <img
              src={URL.createObjectURL(file)}
              className="h-80 w-80"
              alt={`Generated ${index}`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <input
          type="text"
          className="border rounded-xl h-10 w-96 p-1"
          placeholder="Enter your prompts, separated by commas"
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-blue-500"
          onClick={handleSubmit}
        >
          Send
        </button>
      </div>
      {files.length > 0 && (
        <button
          className="mt-4 px-4 py-2 rounded-xl bg-green-500"
          onClick={uploadFiles}
        >
          Upload All
        </button>
      )}
      {cid && (
        <div className="mt-4">
          <p>Uploaded file CIDs: {cid}</p>
        </div>
      )}
      {cid && (
        <button
          className="mt-4 px-4 py-2 rounded-xl bg-purple-500"
          onClick={mintNFTs}
        >
          Mint NFTs
        </button>
      )}
      {isMinted && cid && (
        <button
          className="mt-4 px-4 py-2 rounded-xl bg-yellow-500"
          onClick={transferNFTs}
        >
          Transfer to Polygon
        </button>
      )}
      <div className="mt-8 w-full flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
        <div className="flex flex-wrap gap-4">
          {nfts.map((nft, index) => (
            <div key={index} className="flex flex-col items-center border p-4 rounded-xl">
              <img src={`https://gateway.pinata.cloud/ipfs/${nft.tokenUri}`} className="h-40 w-40 mb-2" alt={`NFT ${index}`} />
              <p>{nft.name}</p>
              <button
                className="mt-2 px-4 py-2 rounded-xl bg-blue-500"
                onClick={() => alert(`Prompt: ${nft.prompt}`)}
              >
                Show Prompt
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
