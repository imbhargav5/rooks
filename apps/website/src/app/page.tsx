'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/docs');
    }, []);
    return <div className="text-4xl font-bold">Hello World</div>;
}
