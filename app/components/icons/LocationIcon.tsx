import { FC } from 'react';
import { CommonIconProps, defaultPathClassName } from './utils';
import { easeIn, easeInOut, motion } from 'framer-motion';

const pathVariants = {
    hidden: {
        pathLength: 0
    },
    visible: {
        pathLength: 100,
        transition: {
            duration: 20,
            ease: easeIn,
        }
    }
};
const LocationIcon: FC<CommonIconProps> = props => {
    const { size = '100%', pathClassName = defaultPathClassName } = props;
    return (
        <svg width={size} height={size} viewBox="0 -25 384 605" xmlns="http://www.w3.org/2000/svg">
            <motion.path variants={pathVariants} initial="hidden" animate="visible" className={pathClassName} d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" fillRule="nonzero" strokeWidth={'25px'} strokeMiterlimit="10" />
        </svg>


    );
};

export default LocationIcon;