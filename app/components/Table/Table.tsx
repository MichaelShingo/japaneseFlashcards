import { FC, ReactNode } from "react";

interface TableProps {
    children: ReactNode;
}

const Table: FC<TableProps> = ({ children }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="min-w-[720px] table-fixed px-4 py-2">
                {children}
            </table>
        </div>
    );
};

export default Table;;