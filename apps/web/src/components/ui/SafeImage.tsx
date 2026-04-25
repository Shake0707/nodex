'use client';

import Image, { type ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type SafeImageProps = Omit<ImageProps, 'src'> & {
    src: string | null | undefined;
    fallback: string;
};

export default function SafeImage({ src, fallback, alt, ...rest }: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState<string>(src || fallback);

    useEffect(() => {
        setImgSrc(src || fallback);
    }, [src, fallback]);

    return (
        <Image
            {...rest}
            src={imgSrc}
            alt={alt}
            onError={() => {
                if (imgSrc !== fallback) setImgSrc(fallback);
            }}
            unoptimized={imgSrc === fallback}
        />
    );
}
