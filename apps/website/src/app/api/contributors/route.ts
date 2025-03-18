import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { findUpSync } from 'find-up';

interface Contributor {
    login: string;
    name?: string;
    avatar_url: string;
    profile: string;
    contributions: string[];
}

// Use find-up to locate the .all-contributorsrc file by walking up directories
const contributorsConfigPath = findUpSync('.all-contributorsrc');

if (!contributorsConfigPath) {
    throw new Error('.all-contributorsrc file not found');
}


const allContributorsRaw = readFileSync(contributorsConfigPath, "utf-8");


export async function GET() {
    try {

        const allContributors = JSON.parse(allContributorsRaw);

        return NextResponse.json(allContributors.contributors);
    } catch (error) {
        console.error('Error fetching contributors:', error);
        return NextResponse.json(
            { message: 'Failed to fetch contributors' },
            { status: 500 }
        );
    }
} 