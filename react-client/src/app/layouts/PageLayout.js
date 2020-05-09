import { default as React } from 'react';

import { Header } from '../components';

const PageLayout = ({children}) => {
  return (
    <div className="page">
      <Header />
      <main className={`page__main `}>
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default PageLayout;