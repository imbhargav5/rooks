'use client';
import { Suspense } from 'react';
import { ContributorList } from './ContributorList';

function LoadingContributors() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6">
            {Array.from({ length: 12 }).map((_, index) => (
                <div
                    key={index}
                    className="border-2 border-primary rounded-lg h-24 w-24 animate-pulse bg-gray-200 dark:bg-gray-700"
                />
            ))}
        </div>
    );
}

export function Contributors() {
    return (
        <Suspense fallback={<LoadingContributors />}>
            <ContributorList />
        </Suspense>
    );
} 