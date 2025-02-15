import { ReactNode } from "react";
import ConfirmModal, { ConfirmModalProps } from "./ConfirmModal";
import DeckUpsertModal, { DeckUpsertModalProps } from "./DeckUpsertModal";
import { useAppSelector } from "@/redux/store";
import { ModalData } from "@/redux/features/globalSlice";

export const modalKeys = {
  confirm: 'confirm',
  deckUpsert: 'deckUpsert'
} as const;

export type ModalKeys = keyof typeof modalKeys;

type ModalPropsMap = {
  [modalKeys.confirm]: ConfirmModalProps;
  [modalKeys.deckUpsert]: DeckUpsertModalProps;
};

export type ModalPropsAll = ConfirmModalProps | DeckUpsertModalProps;
// const openModal = useModal();
// openModal( {key: confirm, props: {}} )

const ModalHandler = () => {
  const modalData: ModalData = useAppSelector((state) => state.globalReducer.value.modalData);

  // global state for setting current modal based on modal key, modal 
  // useModal hook sends modalKey and props 

  // switch statement to return correct modal component based on key

  // need to export props from each modal component, and useModal needs to be able to take those props
  const currentModal = (): ReactNode => {
    if (!modalData) {
      return null;
    }
    switch (modalData.modalType) {
      case modalKeys.confirm:
        return <ConfirmModal {...modalData.props as ConfirmModalProps} />;
      case modalKeys.deckUpsert:
        return <DeckUpsertModal {...modalData.props as DeckUpsertModalProps} />;
      default:
        return;
    }
  };

  return (
    <>
      {currentModal()}
    </>
  );
};

export default ModalHandler;