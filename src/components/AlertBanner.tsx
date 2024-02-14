import { Alert, Collapse } from '@mui/material';

type AlertBannerType = {
  showAlert: boolean,
  alertSeverity: any,
  handleHideAlert: () => any,
  alertMessage: string,
}

const AlertBanner = ({
  showAlert,
  alertSeverity,
  handleHideAlert,
  alertMessage
}: AlertBannerType) => {
  return (
    <Collapse in={showAlert}>
      <Alert severity={alertSeverity} onClose={handleHideAlert}>{alertMessage}</Alert>
    </Collapse>
  );
}

export default AlertBanner;