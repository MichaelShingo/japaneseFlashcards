'use client';
import { setHeight, setWidth } from '@/redux/features/windowSlice';
import { AppDispatch } from '@/redux/store';
import { debounce } from 'lodash';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const WindowEvents = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(setHeight(window.innerHeight));
        dispatch(setWidth(window.innerWidth));

        const setWindowSize = debounce(() => {
            dispatch(setHeight(window.innerHeight));
            dispatch(setWidth(window.innerWidth));
        }, 200);

        window.addEventListener('resize', setWindowSize);
    }, []);

    return <></>;
};

export default WindowEvents;