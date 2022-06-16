import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function SidebarItem({ index, url }: SidebarItemProps) {

    const [active, setActive] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const newActive = router.pathname === url;
        setActive(newActive);
    }, [
        router,
    ]);

    const anchorClasses = clsx('block px-4 py-1 text-left w-full', {
        'hover:bg-slate-600': !active,
        'bg-slate-700 pointer-events-none': active,
    });

    return <li>
        <Link href={`/${url}`}>
            <a className={anchorClasses}>
                <span className="inline-block opacity-50 mr-2">
                    {index.toString().padStart(3, '0')}
                </span>
                <span className="italic">
                    {url.replace('/', ' / ')}
                </span>
            </a>
        </Link>
    </li>;

}