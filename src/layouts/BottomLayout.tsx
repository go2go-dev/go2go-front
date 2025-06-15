import { Outlet, Link } from "react-router-dom";

export default function BottomLayout() {
	return (
		<div>
			<main>
				<Outlet />
			</main>
			<nav className="bottom-nav">
				<ul>
					<li>
						<Link to="/home">홈</Link>
					</li>
					<li>
						<Link to="/post-history">게시글</Link>
					</li>
					<li>
						<Link to="/feed">피드</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
}
