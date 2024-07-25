'use client';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

export default function Analytics() {

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_ANALYTICS_ID) {
            ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID);
        }
    }, []);

    return null;

}