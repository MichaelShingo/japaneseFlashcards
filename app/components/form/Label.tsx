import { FC, ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface LabelProps {
    htmlFor: string;
    children: ReactNode;
}

const Label: FC<LabelProps> = ({ htmlFor, children }) => {
    return (
        <label className={twJoin(['mb-2 w-fit pr-2 transition peer-focus:translate-y-[65%] bg-primary peer-focus:bg-white'])} htmlFor={htmlFor}>{children}</label>
    );
};

export default Label;