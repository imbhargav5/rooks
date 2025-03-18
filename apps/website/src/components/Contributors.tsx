import { contributorsListData } from './contributors-list-data';

import Image from 'next/image';


// Individual contributor item component
function ContributorItem({
    login,
    name,
    avatar_url,
    profile
}: {
    login: string;
    name?: string;
    avatar_url: string;
    profile: string;
}) {
    return (
        <a
            href={profile}
            key={login}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
        >
            <div className="border-2 border-primary rounded-lg flex items-center justify-center h-24 w-24 p-0 transition-transform hover:scale-105">
                <Image
                    src={avatar_url}
                    alt={name || login}
                    height={90}
                    width={90}
                    className="rounded-lg border border-primary h-[90px] w-[90px]"
                />
            </div>
        </a>
    );
}

function ContributorList() {


    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 my-6">
            {contributorsListData.contributors.map((contributor) => (
                <ContributorItem
                    key={contributor.login}
                    login={contributor.login}
                    name={contributor.name}
                    avatar_url={contributor.avatar_url}
                    profile={contributor.profile}
                />
            ))}
        </div>
    );
}

export function Contributors() {
    return (
        <ContributorList />
    );
} 