import { useTranslations } from "next-intl";
import { useState } from "react";

interface ReadMoreProps {
    content: string;
}
const ReadMore = ({ content }) => {
    const [isReadMore, setIsReadMore] = useState(false);
    const t = useTranslations('ReadMore');
    const shortenContent = (content: string) => {
        let i = 100;
        let currentChar = content[i];
        let count = 0;
        while (currentChar !== ' ' && count < 20 && currentChar !== "。") {
            currentChar = content[i];
            i++;
            count++;
        }
        return content.slice(0, i) + t('ellipses');
    };

    const shortenedContent = shortenContent(content);
    return (
        <div className="flex flex-col items-start">
            {isReadMore ? content : shortenedContent}
            <button className="font-bold" onClick={() => setIsReadMore(!isReadMore)}>
                {isReadMore ? t('readLess') : t('readMore')}
            </button>
        </div>
    );
};

export default ReadMore;