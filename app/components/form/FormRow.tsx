import { FC, ReactNode } from "react";

interface FormRowProps {
    children: ReactNode;
}

const FormRow: FC<FormRowProps> = ({ children }) => {
    return (
        <div className="flex w-full flex-col gap-0 md:flex-row md:gap-8">{children}</div>
    );
};

export default FormRow;