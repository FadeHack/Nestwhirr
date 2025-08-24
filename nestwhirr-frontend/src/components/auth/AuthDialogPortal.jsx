// src/components/auth/AuthDialogPortal.jsx
import { createPortal } from 'react-dom';
import AuthDialog from './AuthDialog';

function AuthDialogPortal(props) {
  if (!props.isOpen) return null;
  return createPortal(
    <AuthDialog {...props} />,
    document.body
  );
}

export default AuthDialogPortal;