import { FC, ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface FormGroupProps {
    fullWidth?: boolean;
    children: ReactNode;
}

const FormGroup: FC<FormGroupProps> = ({ fullWidth, children }) => {
    const cn = [];
    fullWidth ? cn.push('w-full') : cn.push('w-full md:w-1/2');
    return (
        <div className={twJoin([...cn, 'flex flex-col-reverse'])}>
            {children}
        </div>
    );
};

export default FormGroup;