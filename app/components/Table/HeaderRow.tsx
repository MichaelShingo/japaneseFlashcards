import React, { FC, ReactNode } from "react";
import TableHead from "./TableHead";
import Typography from "../text/Typography";

interface TableHeaderRowProps {
    headers: ReactNode[];
    cellWidths: string[];
}

const TableHeaderRow: FC<TableHeaderRowProps> = ({ headers, cellWidths }) => {
    return (
        <thead>
            <tr>
                {headers.map((header, index) => (
                    <TableHead key={index} className={cellWidths[index]}>
                        <Typography variant="h4">
                            {header}
                        </Typography>
                    </TableHead>
                ))}
            </tr>
        </thead>
    );
};

export default TableHeaderRow;