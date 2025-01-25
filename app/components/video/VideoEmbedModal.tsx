'use client';
import { useAppSelector } from "@/redux/store";
import { FC, useEffect, useRef, useState } from "react";

interface VideoEmbedProps {
    useGlobalLink?: boolean;
    src?: string;
}

const VideoEmbedModal: FC<VideoEmbedProps> = ({ useGlobalLink = false, src }) => {
    const windowWidth: number = useAppSelector(
        (state) => state.windowReducer.value.windowWidth
    );
    const isModalOpen: boolean = useAppSelector((state) => state.locationReducer.value.isModalOpen);
    const [isReady, setIsReady] = useState<boolean>(false);
    const windowHeight: number = useAppSelector((state) => state.windowReducer.value.windowHeight);
    const link: string = useAppSelector(
        (state) => state.locationReducer.value.currentVideo
    );
    const ref = useRef<HTMLIFrameElement>(null);

    const factor = Math.min(windowWidth, windowHeight) / 1920;

    useEffect(() => {
        if (isModalOpen) {
            checkIfVideoReady();
        }
    }, [isModalOpen]);
    const checkIfVideoReady = () => {
        const iframe = ref.current;
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc.readyState === 'complete') {
                iframe.contentWindow.onload = () => {
                    setIsReady(true);
                };
                setIsReady(true);
                return;
            }
            setTimeout(() => {
                checkIfVideoReady();
            }, 100);
        }
    };

    return (
        <iframe
            ref={ref}
            className=""
            width={1920 * factor}
            height={1080 * factor}
            src={useGlobalLink ? link : src}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        />
    );
};

export default VideoEmbedModal;
