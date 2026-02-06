import React from 'react';
import { NewLoginPage } from './pages/NewLoginPage';

const LoginPage = ({ onLoginSuccess, onBack }: { onLoginSuccess: (token: string) => void; onBack?: () => void }) => {
  return (
    <NewLoginPage
      onLoginSuccess={onLoginSuccess}
      onBack={onBack}
    />
  );
};

export default LoginPage;

