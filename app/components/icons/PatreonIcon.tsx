import { FC } from 'react';
import { CommonIconProps, defaultPathClassName } from './utils';

const PatreonIcon: FC<CommonIconProps> = props => {
    const { size = '100%', pathClassName = defaultPathClassName } = props;
    return (
        <svg height={size} width={size} xmlns="http://www.w3.org/2000/svg" viewBox="-10 0 540 540">
            <path className={pathClassName} d="M489.7 153.8c-.1-65.4-51-119-110.7-138.3C304.8-8.5 207-5 136.1 28.4C50.3 68.9 23.3 157.7 22.3 246.2C21.5 319 28.7 510.6 136.9 512c80.3 1 92.3-102.5 129.5-152.3c26.4-35.5 60.5-45.5 102.4-55.9c72-17.8 121.1-74.7 121-150z" />
        </svg>


    );
};

export default PatreonIcon;;