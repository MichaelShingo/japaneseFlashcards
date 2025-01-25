import { useAppSelector } from '@/redux/store';
import { useEffect, useState } from 'react';

const useIsMobile = () => {
	const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

	const windowWidth: number = useAppSelector(
		(state) => state.windowReducer.value.windowWidth
	);
	useEffect(() => {
		setIsMobileDevice(
			/Android|webOS|iPhone|Surface|iPad|iPod|BlackBerry|IEMobile|Windows Phone|Windows Tablet|Opera Mini/i.test(
				navigator.userAgent
			) ||
				(navigator.userAgent.includes('Macintosh') && 'ontouchend' in document) ||
				(navigator.userAgent.includes('Windows') && navigator.userAgent.includes('Touch'))
		);
	}, [windowWidth]);

	return isMobileDevice;
};

export default useIsMobile;
