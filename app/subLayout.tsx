'use client';
import { FC, ReactNode } from "react";
import WindowEvents from "./components/eventHandlers/windowEvents";
import Modal from "./components/modal/Modal";

interface SubLayoutProps {
    children: ReactNode;
}
const SubLayout: FC<SubLayoutProps> = ({ children }) => {

    return (
        <>
            <Modal />
            <WindowEvents />
            {children}
        </>
    );
};

export default SubLayout;