import { FC, ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface GreenTextProps {
    color?: string;
    children: ReactNode;
}

const GreenText: FC<GreenTextProps> = ({ color, children }) => {
    const cn = ['font-semibold'];
    color ? cn.push(color) : cn.push('text-secondary');
    return (
        <span className={twJoin([...cn])}>{children}</span>
    );
};

export default GreenText;