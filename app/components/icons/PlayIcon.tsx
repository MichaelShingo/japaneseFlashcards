import { FC } from 'react';
import { CommonIconProps, defaultPathClassName } from './utils';

const PlayIcon: FC<CommonIconProps> = props => {
    const { size = '100%', pathClassName = defaultPathClassName } = props;
    return (
        <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 125 125">
            <g>
                <g id="Layer_1">
                    <path className={pathClassName} d="M112.94,55.02L20.84,1.84c-5.85-3.38-13.17.84-13.17,7.6v106.35c0,6.76,7.32,10.98,13.17,7.6l92.1-53.17c5.85-3.38,5.85-11.83,0-15.21Z" />
                </g>
            </g>
        </svg>


    );
};

export default PlayIcon;