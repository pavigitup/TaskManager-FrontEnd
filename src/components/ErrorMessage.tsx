'use client'

import { useParams, useRouter } from 'next/navigation';

import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material';


interface ErrorMessageProps {
    titleCode: string;
    detailCode: string;
    message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ titleCode, detailCode, message }) => {
    const router = useRouter();
    const { lang: locale } = useParams()

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        const replaceUrl = '/login';

        router.push(replaceUrl);
    };

    return (
        <div className='flex items-center justify-center min-bs-[78dvh] relative p-6 overflow-x-hidden'>
            <div className='flex items-center flex-col text-center'>
                <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset] mbe-6'>
                    {message ? (<Typography>{message}</Typography>) : null}
                    {(detailCode && titleCode) ? (
                        <>
                            <Typography variant='h3'>{detailCode} ⚠️</Typography>
                            <Box>
                                <Button type="button" variant='contained' onClick={handleLogout}>{titleCode}</Button>
                            </Box>
                        </>) : null}
                </div>
            </div>
        </div>
    )
}

export default ErrorMessage;
