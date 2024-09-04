import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.section`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);

  & > * {
    width: 100%;
    height: auto;
    max-width: 100%;
    margin: 20px auto;
  }

  @media screen and (max-width: 767px) {
    width: 100vw;
    max-width: none;
    margin: 0;
  }
`;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
