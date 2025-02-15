import { setSnackBarData } from "@/redux/features/globalSlice";
import { useDispatch } from "react-redux";

const useToast = () => {
  const dispatch = useDispatch();

  const toast = (message: string) => {
    dispatch(setSnackBarData({ isOpen: true, message }));
  };

  return toast;
};

export default useToast;