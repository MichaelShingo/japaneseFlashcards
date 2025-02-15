import { setModalData } from "@/redux/features/globalSlice";
import { useDispatch } from "react-redux";
import { ModalKeys, ModalPropsAll } from "../components/molecules/Modals/ModalHandler";

const useModal = () => {
  const dispatch = useDispatch();

  const openModal = (modalType: ModalKeys, props: ModalPropsAll) => {
    dispatch(setModalData({ modalType, props }));
  };

  return openModal;
};

export default useModal;