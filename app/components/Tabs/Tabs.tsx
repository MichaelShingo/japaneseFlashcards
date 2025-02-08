import { Tab, Tabs } from "@mui/material";
import { FC, SyntheticEvent } from "react";

export type Tab = {
    label: string;
    value: string;
};

interface TabsProps {
    tabs: Tab[];
    currentTab: string;
    handleChange: (e: SyntheticEvent, newValue: string) => void;
}
const DefaultTabs: FC<TabsProps> = ({ tabs, currentTab, handleChange }) => {
    return (
        <Tabs
            value={currentTab}
            onChange={handleChange}

        >
            {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label}
                // className={tab.value === currentTab ? 'text-accent' : 'text-white'}
                />
            ))}
        </Tabs>
    );
};

export default DefaultTabs;