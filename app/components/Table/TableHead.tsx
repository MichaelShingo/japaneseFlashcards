import React, { FC, ReactNode } from "react";
import Typography from "../text/Typography";
import { twJoin } from "tailwind-merge";

interface TableHeadProps {
    className: string;
    children: ReactNode;
}

const TableHead: FC<TableHeadProps> = ({ children, className }) => {
    return (
        <th className={twJoin(['border-[3px] border-black px-4 py-2', className])} >
            <Typography variant="h4">{children}</Typography>
        </th >
    );
};

export default TableHead;