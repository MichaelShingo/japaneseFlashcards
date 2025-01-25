import { FC, ReactNode } from "react";
import { twJoin, twMerge } from "tailwind-merge";
import { motion } from "framer-motion";
import { CommonIconProps } from "../icons/utils";

export type DividerVariant = 'small' | 'large';

interface DividerProps {
    variant: DividerVariant;
    icon: FC<CommonIconProps>;
    color?: string;
    iconColor?: string;
}
const Divider: FC<DividerProps> = ({ variant, icon: Icon, color = 'bg-gray-300', iconColor = 'fill-black' }) => {
    const cn = [color];
    const cnIcon = [];

    return (
        <div className={twJoin("mt-24 mb-9 w-full h-12 md:opacity-100 opacity-0")}>
            <motion.div viewport={{ once: true }} transition={{ delay: 0, duration: 0.6 }} initial={{ height: '2px', width: '0%' }} whileInView={{ width: '70%' }} className="relative translate-x-[20%] bg-white" />
            <motion.div viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.3 }} className="relative bg-transparent" initial={{ scale: '0%', width: '100%', translateY: '-51%' }} whileInView={{ scale: '18%' }}>
                <Icon pathClassName={iconColor} />
            </motion.div>
        </div>
    );
};

export default Divider;