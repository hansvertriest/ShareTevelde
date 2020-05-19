import { default as React } from 'react';

import { Logo } from '../components/misc';
import { useAuth } from '../services';

const AdminLayout = (props) => {
	const { logout } = useAuth();
  return (
    <div className="page">
		<div className="admin-header">
			<div className="admin-header__top">
				<Logo />
				<p 
				onClick={() => {
					logout();
					window.location.href='/auth/signin';
					}}
				>
					Uitloggen
				</p>
			</div>
			<div className="admin-header__bottom">
				<a href="/admin/delete">Verwijderen</a>
				<a href="/admin/merge">Samenvoegen</a>
			</div>
		</div>
		<main className={`page__main `}>
			{props.children}
		</main>
    </div>
  );
};

export default AdminLayout;