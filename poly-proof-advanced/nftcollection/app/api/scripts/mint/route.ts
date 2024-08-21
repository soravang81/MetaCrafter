import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { prompts, names, uris } = await req.json(); 

    const env = {
      ...process.env,
      NEXT_PUBLIC_PROMPTS: JSON.stringify(prompts),
      NEXT_PUBLIC_BASE_URI: JSON.stringify(uris)
    };

    const runMintScript = () => {
      return new Promise((resolve, reject) => {
        const mintScript = spawn('npx', ['hardhat', 'run', 'scripts/mint.ts', '--network', 'sepolia'], { env });

        mintScript.stdout.on('data', (data) => {
          console.log(`Mint script output: ${data}`);
        });

        mintScript.stderr.on('data', (data) => {
          console.error(`Mint script error: ${data}`);
          reject(new Error(`Mint script error: ${data}`));
        });

        mintScript.on('close', (code) => {
          if (code === 0) {
            resolve('NFTs minted successfully');
          } else {
            reject(new Error('Failed to mint NFTs'));
          }
        });
      });
    };

    const result = await runMintScript();
    return NextResponse.json({ message: result });
  } catch (error) {
    console.error('Failed to mint NFTs:', error);
    return NextResponse.json({ error: 'Failed to mint NFTs' });
  }
}
