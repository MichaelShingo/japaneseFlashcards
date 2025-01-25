import { FC, ReactNode } from "react";
import Typography from "../text/Typography";

interface TableDataProps {
    contentType?: 'string' | 'node';
    children?: ReactNode;
}

const TableData: FC<TableDataProps> = ({ contentType = 'string', children }) => {
    return (
        <td className="border-[3px] border-black px-4 py-2">
            {contentType === 'string' ? (
                <Typography variant="p">{children}</Typography>
            ) : (
                <>
                    {children}
                </>
            )
            }
        </td>
    );
};

export default TableData;