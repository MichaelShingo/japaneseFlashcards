import React, { FC, ReactNode } from "react";
import Typography from "../text/Typography";

interface TableRowProps {
    children: ReactNode;
}

const TableRow: FC<TableRowProps> = ({ children }) => {
    return (
        <tr className="border-[3px] border-black px-4 py-2">
            <Typography variant="h4">{children}</Typography>
        </tr>
    );
};

export default TableRow;