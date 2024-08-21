import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(req: NextRequest) {
  try {
    const transferScript = spawn('npx', ['hardhat', 'run', 'scripts/transfer.ts', '--network', 'sepolia']);

    transferScript.stdout.on('data', (data) => {
      console.log(`Transfer script output: ${data}`);
    });

    transferScript.stderr.on('data', (data) => {
      console.error(`Transfer script error: ${data}`);
    });

    return new Promise((resolve, reject) => {
      transferScript.on('close', (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ message: 'NFTs transferred to Polygon successfully' }));
        } else {
          console.error('Failed to transfer NFTs');
          reject(NextResponse.json({ message: 'Failed to transfer NFTs', code }));
        }
      });
    });
  } catch (error) {
    console.error('Failed to transfer NFTs:', error);
    return NextResponse.json({ message: 'Failed to transfer NFTs', error });
  }
}
