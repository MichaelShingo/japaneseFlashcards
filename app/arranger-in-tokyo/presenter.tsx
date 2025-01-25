'use client';
import PageLayout from '@/app/components/pageLayout/PageLayout';
import Quote from '@/app/components/text/Quote';
import BioSection from '@/app/components/BioSection/BioSection';
import VideoSection, { VideoData } from '@/app/components/video/VideoSection';
import { useTranslations } from 'next-intl';
import { formatTranslation } from '@/app/utils/formatTranslation';

const Presenter = () => {
    const t = useTranslations('Arranging');
    const arrangingVideos: VideoData[] = [
        {
            label: t('baccano'),
            link: 'https://www.youtube.com/embed/_osln1WT0dk?si=49g0SUVEUxigIHSa',
        },
        {
            label: t('hegemony'),
            link: 'https://www.youtube.com/embed/8MNTf5JAaSI?si=z-zmYorjZ0vxdO7d',
            isDefault: true
        },
        {
            label: t('onePiece'),
            link: 'https://www.youtube.com/embed/z1vmZLW_9kk?si=xEKCOOrnjIScT5_A',
        }
    ];
    return (
        <PageLayout title={t('pageTitle')} backgroundImageUrl="/norway79.jpg">
            <div className="h-fit min-h-[130vh] w-full">
                <Quote>{formatTranslation(t('quote'))}</Quote>
                <BioSection title={t('biographyTitle')} content={formatTranslation(t('biography'))} />
                <VideoSection data={arrangingVideos} />
            </div>
        </PageLayout >
    );
};

export default Presenter;