import { standardPadding } from "@/app/constants/styleConstants";
import { FC, ReactNode, useState } from "react";
import { twJoin } from "tailwind-merge";
import Typography from "../text/Typography";
import Button from "../Button/Button";
import { motion, AnimatePresence } from "framer-motion";
import PlainTextSection from "../PlainTextSection/PlainTextSection";
import { useDispatch } from "react-redux";
import { openVideoModal, setCurrentVideo, setIsModalOpen } from "@/redux/features/locationSlice";
import { useTranslations } from "next-intl";

export type Tab = {
    title: string;
    content: ReactNode;
    bgImageUrl?: string;
    videoUrl?: string;
};

interface TabsProps {
    tabs: Tab[];

}

const Tabs: FC<TabsProps> = ({ tabs }) => {
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const cn = [tabs[selectedTab].bgImageUrl];
    const dispatch = useDispatch();
    const currentTab = tabs[selectedTab];
    const t = useTranslations('Tabs');

    const handleClick = (link: string) => {
        dispatch(openVideoModal(link));
    };

    return (
        <div className={twJoin([...cn, " flex items-start justify-center border-black"])}>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={tabs[selectedTab].bgImageUrl}
                    className="absolute h-full w-full bg-cover bg-center" style={{
                        backgroundImage: `url(${tabs[selectedTab].bgImageUrl})`
                    }} />
            </AnimatePresence>
            <div className="flex flex-row items-center justify-stretch">
                <div className="z-10 flex h-full w-[30vw] flex-col items-start justify-center gap-3">
                    {tabs.map((tab, index) => (
                        <div
                            className={twJoin(['border-[2px] backdrop-blur-sm ml-3 md:ml-7 px-2 md:px-4 py-0 md:py-2  transition duration-500 cursor-pointer', selectedTab === index ? 'border-accent bg-secondary/55 hover:bg-secondary/75' : 'border-white bg-black/25 hover:bg-black/65'])}
                            key={index}
                            onClick={() => setSelectedTab(index)}
                        >
                            <Typography variant="h4" color={selectedTab === index ? 'text-white' : 'text-white'}>{tab.title}</Typography>
                        </div>
                    ))}
                </div>
                <div className="z-10 flex h-dvh min-h-dvh w-[70vw] flex-col items-center justify-center gap-8 md:gap-20">
                    {currentTab.videoUrl &&
                        <Button onClick={() => handleClick(currentTab.videoUrl)} className="relative z-10" variant="primary" size="large">{t('watchVideo')}</Button>
                    }
                    <div className="z-10 flex w-[90%] flex-col items-center justify-center rounded-md bg-white py-5 md:my-10 md:py-10">
                        <PlainTextSection marginSize="none" paddingSize="none">{currentTab.content}
                        </PlainTextSection>
                    </div>
                </div>
            </div >

        </div>
    );
};

export default Tabs;