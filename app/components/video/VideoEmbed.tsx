import { FC } from "react";

interface VideoEmbedProps {
    useGlobalLink?: boolean;
    src?: string;
}

const VideoEmbed: FC<VideoEmbedProps> = ({ src }) => {
    return (
        <div className="my-12 flex h-fit w-full items-center justify-center">
            <iframe
                className="aspect-video h-full w-full"
                src={src}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default VideoEmbed;
