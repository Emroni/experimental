import { SidebarItem } from '@/components';
import Link from 'next/link';

const experiments = [
    'cubic-3',
    'cubic-2',
    'cubic-1',
];

export default function Sidebar() {

    return <aside className="bg-slate-900 flex flex-col h-screen text-white">
        <div className="bg-slate-800 flex items-center justify-between">
            <Link href="/">
                <a>
                    <h1 className="font-bold p-4 pr-12">Experimental</h1>
                </a>
            </Link>
        </div>
        <ol className="flex-1 overflow-y-auto">
            {experiments.map((experiment, index) => (
                <SidebarItem index={experiments.length - index} key={index} url={experiment} />
            ))}
        </ol>
    </aside>;

}