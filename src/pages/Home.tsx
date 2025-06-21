import { ChevronRightIcon, PlayIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

// Timer card data
const timerCards = [
	{
		id: 1,
		title: "코딩 공부하기",
		duration: "35분",
		position: "top-[114px] left-5",
	},
	{
		id: 2,
		title: "코딩 공부하기",
		duration: "35분",
		position: "top-[114px] left-[205px]",
	},
	{
		id: 3,
		title: "코딩 공부하기",
		duration: "35분",
		position: "top-[299px] left-5",
	},
	{
		id: 4,
		title: "코딩 공부하기",
		duration: "35분",
		position: "top-[299px] left-[205px]",
	},
];

export default function Home() {
	const navigate = useNavigate();
	return (
		<div>
			<div className="bg-white w-[390px] h-[844px] relative">
				{/* Header */}
				<header className="absolute w-[390px] h-[45px] top-[54px] left-0 flex items-center justify-between px-5">
					<h1 className="font-head-h2-24p font-[number:var(--head-h2-24p-font-weight)] text-black text-[length:var(--head-h2-24p-font-size)] tracking-[var(--head-h2-24p-letter-spacing)] leading-[var(--head-h2-24p-line-height)] [font-style:var(--head-h2-24p-font-style)]">
						타이머
					</h1>
					<Button variant="ghost" size="icon" className="h-6 w-6">
						<UserIcon className="h-6 w-6" />
					</Button>
				</header>

				{/* Task Card */}
				<Card className="absolute w-[350px] h-[52px] top-[586px] left-5 bg-[#e1e1f3] rounded-[5px] border-none">
					<CardContent className="p-0 h-full flex items-center justify-between">
						<div className="flex flex-col justify-center ml-[15px]">
							<span className="font-body-semibold-16p font-[number:var(--body-semibold-16p-font-weight)] text-black text-[length:var(--body-semibold-16p-font-size)] tracking-[var(--body-semibold-16p-letter-spacing)] leading-[var(--body-semibold-16p-line-height)] [font-style:var(--body-semibold-16p-font-style)]">
								먼지 치우기
							</span>
							<span className="[font-family:'Pretendard-Medium',Helvetica] font-medium text-[#8c8f98] text-xs tracking-[0] leading-[normal]">
								할 일을 적고 해치워봐요
							</span>
						</div>
						<Button
							variant="ghost"
							size="icon"
							className="mr-1"
							onClick={() => navigate("/todo")}
						>
							<ChevronRightIcon className="h-6 w-6" />
						</Button>
					</CardContent>
				</Card>

				{/* Timer Cards */}
				{timerCards.map((card) => (
					<Card
						key={card.id}
						className={`absolute w-[165px] h-[165px] ${card.position} bg-[#e1e1f4] rounded-[10px] border-none`}
					>
						<CardContent className="p-0 h-full relative">
							<div className="absolute top-[18px] left-3.5 font-body-semibold-14p font-[number:var(--body-semibold-14p-font-weight)] text-black text-[length:var(--body-semibold-14p-font-size)] tracking-[var(--body-semibold-14p-letter-spacing)] leading-[var(--body-semibold-14p-line-height)] [font-style:var(--body-semibold-14p-font-style)]">
								{card.title}
							</div>

							<div className="absolute top-[93px] left-20 [font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-black text-[32px] text-right tracking-[0.96px] leading-[normal] whitespace-nowrap">
								{card.duration}
							</div>

							{/* Cloud Illustration */}
							<div className="absolute w-[57px] h-[101px] top-14 left-0 overflow-hidden">
								<div className="relative w-[87px] h-[101px] left-[-30px]">
									<img
										className="absolute w-[55px] h-[99px] top-px left-[31px]"
										alt="Vector"
										src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/vector-2.svg"
									/>
									<img
										className="absolute w-2 h-[9px] top-[41px] left-8"
										alt="Vector"
										src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/vector.svg"
									/>
									<img
										className="absolute w-2 h-[9px] top-[46px] left-10"
										alt="Vector"
										src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/vector.svg"
									/>
									<img
										className="absolute w-[9px] h-2 top-[54px] left-8"
										alt="Vector"
										src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/vector-1.svg"
									/>
									<div
										className={`absolute w-[27px] h-3.5 top-0 left-[30px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "" : `-${10 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-7 h-[23px] top-3 left-[55px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-1" : `-${11 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-[5px] h-[25px] top-[41px] left-[82px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-2" : `-${12 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-3 h-[13px] top-[69px] left-[68px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-3" : `-${13 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-[22px] h-[11px] top-[90px] left-[30px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-4" : `-${14 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-[23px] h-3.5 top-[79px] left-[50px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-5" : `-${15 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-1 h-1.5 top-8 left-9 bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-6" : `-${16 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-2 h-[3px] top-[41px] left-[49px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-7" : `-${17 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-1 h-1.5 top-[51px] left-[30px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-8" : `-${18 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div
										className={`absolute w-[29px] h-[3px] top-14 left-[37px] bg-[url(https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-9" : `-${19 + card.id * 11}`}.png)] bg-[100%_100%]`}
									/>
									<div className="absolute w-[60px] h-[68px] top-[18px] left-0 overflow-hidden">
										<div className="h-[68px]">
											<div className="relative w-[60px] h-[68px]">
												<img
													className="absolute w-[30px] h-[68px] top-0 left-[30px]"
													alt="Group"
													src={`https://c.animaapp.com/mc0k2rzaB70Vzr/img/group${card.id === 1 ? "-10" : `-${20 + card.id * 11}`}.png`}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* PlayIcon Button */}
							<Button
								variant="ghost"
								size="icon"
								className="absolute w-6 h-6 top-[60px] left-[126px] p-0"
							>
								<PlayIcon className="h-6 w-6" />
							</Button>

							{/* Three Dots Menu */}
							<div className="absolute w-6 h-1.5 top-[142px] left-[124px] flex space-x-[9px]">
								<div className="w-1.5 h-1.5 bg-black rounded-[3px/2.95px]" />
								<div className="w-1.5 h-1.5 bg-black rounded-[3px/2.95px]" />
								<div className="w-1.5 h-1.5 bg-black rounded-[3px/2.95px]" />
							</div>
						</CardContent>
					</Card>
				))}

				{/* Add Timer Button */}
				<Button className="absolute top-[519px] left-[126px] bg-[#d8b0ff] hover:bg-[#c99fee] text-white rounded-[150px] px-[34px] py-3">
					<span className="[font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-[15px] tracking-[0] leading-[normal]">
						타이머 추가
					</span>
				</Button>

				{/* Status Bar */}
				<div className="fixed w-[390px] h-11 top-0 left-0">
					<div className="absolute w-[67px] h-[11px] top-[17px] left-[309px]">
						<div className="absolute w-6 h-[11px] top-0 left-[42px]">
							<div className="absolute w-[22px] h-[11px] top-0 left-0 rounded-[2.67px] border border-solid border-[#3c3c4336]">
								<div className="relative w-[18px] h-[7px] top-px left-px bg-black rounded-[1.33px]" />
							</div>
							<img
								className="absolute w-px h-1 top-1 left-[23px]"
								alt="Cap"
								src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/cap.svg"
							/>
						</div>
						<img
							className="absolute w-[15px] h-[11px] top-0 left-[22px]"
							alt="Wifi"
							src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/wifi.svg"
						/>
						<img
							className="absolute w-[17px] h-[11px] top-0 left-0"
							alt="Cellular connection"
							src="https://c.animaapp.com/mc0k2rzaB70Vzr/img/cellular-connection.svg"
						/>
					</div>
					<div className="absolute w-[54px] h-[21px] top-3 left-[21px]">
						<div className="absolute w-[54px] top-0.5 left-0 [font-family:'Pretendard-SemiBold',Helvetica] font-normal text-transparent text-sm text-center leading-4">
							<span className="font-semibold text-black tracking-[0]">
								9:41
							</span>
						</div>
					</div>
				</div>

				{/* Home Indicator */}
				<div className="fixed w-[390px] h-[33px] top-[811px] left-0">
					<div className="relative w-[135px] h-[5px] top-5 left-[127px] bg-black rounded-[100px]" />
				</div>
			</div>
		</div>
	);
}
