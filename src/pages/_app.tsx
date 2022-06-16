import { Sidebar } from '@/components';
import type { AppProps } from 'next/app';
import '../styles.css';

export default function App({ Component, pageProps }: AppProps) {

    return <div className="flex h-screen">
        <Sidebar />
        <main className="bg-zinc-900 flex flex-col h-screen flex-1 overflow-hidden text-white">
            <Component {...pageProps} />
        </main>
    </div>;

}