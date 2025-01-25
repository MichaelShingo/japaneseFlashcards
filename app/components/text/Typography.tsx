import { FC, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { twJoin } from "tailwind-merge";
import useLocaleFont from "@/app/customHooks/useLocaleFont";

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'p';

interface TypographyProps {
    variant: TypographyVariant;
    className?: string;
    color?: string;
    sticky?: boolean;
    align?: 'center' | 'left' | 'justify' | 'right';
    children: ReactNode;
}

const Typography: FC<TypographyProps> = ({ variant, className, color, sticky, align, children }) => {
    const cn = [className];
    const { headerFont, paragraphFont } = useLocaleFont();

    color ? cn.push(color) : cn.push('text-black');
    sticky ? cn.push('sticky left-0 top-0') : cn.push('relative');

    switch (align) {
        case 'center':
            cn.push('text-center');
            break;
        case 'right':
            cn.push('text-right');
            break;
        case 'justify':
            cn.push('text-justify');
            break;
        default:
            cn.push('text-left');
            break;
    }

    const generateVariant = (): ReactNode => {
        let res;
        switch (variant) {
            case 'h1':
                res = <motion.h1 className={twJoin([...cn, 'w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] uppercase'])}>{children}</motion.h1>;
                break;
            case 'h2':
                res = <motion.h2 viewport={{ once: true }} transition={{ delay: 0 }} initial={{ opacity: '0%' }} whileInView={{ opacity: '100%' }} className={twJoin([...cn, 'my-8 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-8xl uppercase'])}>{children}</motion.h2>;
                break;
            case 'h3':
                res = <motion.h3 viewport={{ once: true }} transition={{ delay: 0 }} initial={{ opacity: '0%' }} whileInView={{ opacity: '100%' }} className={twJoin([...cn, 'my-3 text-3xl sm:text-5xl lg:text-6xl uppercase'])}>{children}</motion.h3>;
                break;
            case 'h4':
                res = <motion.h4 viewport={{ once: true }} transition={{ delay: 0 }} initial={{ opacity: '0%' }} whileInView={{ opacity: '100%' }} className={twJoin([...cn, 'my-2 text-sm sm:text-base md:text-lg text-black first-letter:uppercase'])}>{children}</motion.h4>;
                break;
            case 'p':
                res = <p className={twJoin([...cn, 'text-base font-thin text-black md:text-2xl', paragraphFont])}>{children}</p>;
            default:
                break;
        }
        return res;
    };

    return (
        <>
            {generateVariant()}
        </>
    );
};

export default Typography;