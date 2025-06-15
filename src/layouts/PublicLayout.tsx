import { Outlet } from "react-router-dom";

export default function PublicLayout() {
	return (
		<div>
			<header>
				<nav>
					<ul>
						<li>Public Layout Header</li>
					</ul>
				</nav>
			</header>

			<main>
				<Outlet />
			</main>

			<footer>
				<p>Public Layout Footer</p>
			</footer>
		</div>
	);
}
