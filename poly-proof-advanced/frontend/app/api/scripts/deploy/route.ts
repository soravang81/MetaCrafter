// pages/api/deploy-contract.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export default async function POST(req: NextRequest, res: NextResponse) {
  try {
    const deployScript = spawn('npx', ['hardhat', 'run', 'scripts/deploy.js']);

    deployScript.stdout.on('data', (data) => {
      console.log(`Deploy script output: ${data}`);
    });

    deployScript.stderr.on('data', (data) => {
      console.error(`Deploy script error: ${data}`);
      throw new Error('Failed to deploy contract');
    });

    deployScript.on('close', (code) => {
      if (code === 0) {
        return NextResponse.json({ message: 'Contract deployed successfully' });
      } else {
        console.error('Failed to deploy contract');
        throw new Error('Failed to deploy contract');
      }
    });
  } catch (error) {
    console.error('Failed to deploy contract:', error);
    return NextResponse.json({ success: false, message: 'Failed to deploy contract' });
  }
}
