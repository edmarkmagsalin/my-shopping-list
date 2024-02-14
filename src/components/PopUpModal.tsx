import { Box, Modal } from '@mui/material';

type PopUpModalType = {
  open: boolean,
  modalMessage: string,
  handleClose: () => any
}

const PopUpModal = ({open, modalMessage, handleClose}: PopUpModalType) => {
  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle} textAlign='center'>
          <h2>{modalMessage}</h2>
        </Box>
      </Modal>
  );
}

export default PopUpModal;