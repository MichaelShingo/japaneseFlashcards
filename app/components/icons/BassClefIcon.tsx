import { FC } from 'react';
import { CommonIconProps, defaultPathClassName } from './utils';

const BassClefIcon: FC<CommonIconProps> = props => {
    const { size = '100%', pathClassName = defaultPathClassName } = props;
    return (
        <svg
            className="transition dark:invert"
            version="1.1"
            width={size}
            height={size}
            id="Layer_1"
            x="0px"
            y="0px"
            viewBox="0 0 124.7 124.7"
            enableBackground="new 0 0 124.7 124.7"
            xmlSpace="preserve"
        >
            <g>
                <path
                    className={pathClassName}
                    d="M37.6,88.9c1.4-0.5,2.8-1,4.2-1.5c4.2-1.6,7.6-4.2,10.7-7.4c5.2-5.4,9.3-11.5,11.6-18.7
		c1.2-3.7,1.9-7.5,1.5-11.5c-0.4-4.1-1.7-7.8-5-10.5c-4.2-3.5-10.4-3.5-15,0c-1.8,1.3-3.2,3-3.8,5.2c-0.2,0.8-0.4,1.6,0.1,2.5
		c0.2-0.2,0.3-0.3,0.5-0.4c1.6-1.3,3.3-2.1,5.4-1.6c2.3,0.5,3.9,2.5,4.2,5.1c0.3,3.5-1.6,7.3-5.7,8c-2.7,0.5-4.9-0.4-6.5-2.7
		c-2.6-3.7-2.6-9.3,0-13.4c2.5-3.9,6.1-6.1,10.6-7c5.2-1.1,10.3-0.4,15,2c4.6,2.4,7.2,6.4,8.3,11.3c1.3,5.7,0.9,11.3-1.7,16.7
		c-2.6,5.1-5.4,10.1-9.7,14c-5.6,5.1-11.9,8.9-19.1,11.1c-1.2,0.4-2.5,0.5-3.7,0.5C38.3,90.4,37.8,89.9,37.6,88.9z"
                />
                <path
                    className={pathClassName}
                    d="M80.1,60.3c0-1.9,1.5-3.4,3.5-3.3c1.9,0,3.3,1.5,3.3,3.4c0,1.9-1.6,3.4-3.4,3.4
		C81.5,63.7,80.1,62.2,80.1,60.3z"
                />
                <path
                    className={pathClassName}

                    d="M87.1,43.5c0,1.9-1.6,3.4-3.5,3.3c-1.9-0.1-3.3-1.6-3.3-3.5c0-1.9,1.6-3.3,3.4-3.3
		C85.6,40.1,87.1,41.6,87.1,43.5z"
                />
            </g>
        </svg>


    );
};

export default BassClefIcon;