import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const fetchNFTs = new Promise((resolve, reject) => {
      const nfts = spawn('npx', ['hardhat', 'run', 'scripts/fetch.ts', '--network', 'sepolia']);
      
      let resultData = '';

      nfts.stdout.on('data', (data: Buffer) => {
        console.log(`fetch script output: ${data.toString()}`);
        resultData = data.toString()
      });

      nfts.stderr.on('data', (data: Buffer) => {
        console.error(`fetch script error: ${data.toString()}`);
        reject(new Error(`fetch script error: ${data.toString()}`));
      });

      nfts.on('close', (code) => {
        if (code === 0) {
          try {
            resolve(resultData);
          } catch (error: any) {
            reject(new Error(`Failed to parse data: ${error.message}`));
          }
        } else {
          reject(new Error('Failed to fetch NFTs'));
        }
      });
    });

    const result = await fetchNFTs;
    console.log("Raw result data:", result);

    const formattedResult = (result as string).replace(/'/g, '"');
    console.log("Formatted result data:", formattedResult);

    let parsedResult;
    try {
      parsedResult = JSON.parse(formattedResult);
    } catch (error) {
      console.error("Failed to parse formatted result:", error);
      return NextResponse.json({ error: 'Failed to parse fetched NFTs' });
    }

    console.log("Parsed result:", parsedResult);

    return NextResponse.json(parsedResult);
  } catch (error) {
    console.error('Failed to fetch NFTs:', error);
    return NextResponse.json({ error: 'Failed to fetch NFTs' });
  }
}
