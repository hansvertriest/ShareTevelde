import { default as React } from 'react';

import { Footer, Header } from '../components';

const SignUpInLayout = ({children}) => {
  return (
    <div className="page">
      <main className="page__main page__main--full-screen">
        {children}
      </main>
    </div>
  );
};

export default SignUpInLayout;