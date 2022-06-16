import { useRouter } from 'next/router';

export default function Experiment() {

    const router = useRouter();

    return <div>
        {router.query?.experiment}
    </div>;

}