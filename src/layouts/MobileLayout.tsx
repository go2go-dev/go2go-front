import React from "react";

interface MobileLayoutProps {
	children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
	return (
		<div className="bg-white flex flex-row justify-center w-full min-h-screen">
			<div className="bg-white w-[390px] h-[844px] relative px-5">
				{children}
			</div>
		</div>
	);
}
