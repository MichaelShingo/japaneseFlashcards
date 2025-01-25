import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { Locale } from '../utils/types';

const useLocaleFont = () => {
    const [headerFont, setHeaderFont] = useState<string>('header');
    const [paragraphFont, setParagraphFont] = useState<string>('paragraph');

    const locale: Locale = useLocale() as Locale;

    useEffect(() => {
        setHeaderFont(
            locale === 'jp' ? 'font-header-jp' : 'font-header'
        );
        setParagraphFont(
            locale === 'jp' ? 'font-paragraph-jp' : 'font-paragraph'
        );
    }, []);

    return { headerFont, paragraphFont };
};

export default useLocaleFont;
