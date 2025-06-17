import { ArrowLeftIcon, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

type TodoItem = {
	id: string;
	text: string;
	completed: boolean;
	timerLabel?: string;
};

type DateGroup = {
	date: string;
	todos: TodoItem[];
};

const todoData: DateGroup[] = [
	{
		date: "2025. 06. 14",
		todos: [
			{ id: "1", text: "자격증 공부하기", completed: false },
			{ id: "2", text: "청소 하기", completed: true },
			{
				id: "3",
				text: "할 일이 두 줄 넘어가는 경우할 일이 두 줄 넘어가는 경우 할 일이 두 줄 넘어가는 경우",
				completed: true,
			},
		],
	},
	{
		date: "2025. 06. 13",
		todos: [
			{ id: "4", text: "와이어프레임 완성하기", completed: false },
			{
				id: "5",
				text: "자격증 공부하기",
				completed: false,
				timerLabel: "운동하기",
			},
			{
				id: "6",
				text: "자격증 공부하기",
				completed: true,
				timerLabel: "코딩 공부하기",
			},
			{ id: "7", text: "자격증 공부하기", completed: true },
		],
	},
];

export default function Todo() {
	return (
		<div
			className="bg-white flex flex-row justify-center w-full"
			data-model-id="178:5830"
		>
			<div className="bg-white w-[390px] h-[844px] relative">
				{/* Header */}
				<div className="absolute w-[350px] h-11 top-[49px] left-5 flex items-center justify-between">
					<Button variant="ghost" size="icon" className="p-0 h-6 w-6">
						<ArrowLeftIcon className="h-6 w-6" />
					</Button>

					<div className="[font-family:'Pretendard-SemiBold',Helvetica] font-semibold text-black text-base text-center tracking-[0] leading-[22px] whitespace-nowrap">
						할 일 처리기
					</div>

					<Button variant="ghost" size="icon" className="p-0 h-6 w-6">
						<PlusCircleIcon className="h-6 w-6" />
					</Button>
				</div>

				{/* Todo Lists by Date */}
				{todoData.map((dateGroup, groupIndex) => (
					<div
						key={`date-${groupIndex}`}
						className={`absolute w-[352px] h-auto left-5 ${
							groupIndex === 0 ? "top-[98px]" : "top-[345px]"
						}`}
					>
						<div className="font-button-medium-14p font-[number:var(--button-medium-14p-font-weight)] text-[#8c8f98] text-[length:var(--button-medium-14p-font-size)] tracking-[var(--button-medium-14p-letter-spacing)] leading-[var(--button-medium-14p-line-height)] [font-style:var(--button-medium-14p-font-style)]">
							{dateGroup.date}
						</div>

						<div className="mt-[27px] space-y-[10px]">
							{dateGroup.todos.map((todo, index) => (
								<Card
									key={todo.id}
									className="bg-[#e1e1f3] rounded-[5px] border-none shadow-none"
								>
									<CardContent className="p-0 h-[60px] flex items-center">
										<div className="flex items-center gap-2.5 px-2.5 py-0 w-full h-full">
											<img
												className="relative w-6 h-6"
												alt="Todo checkbox"
												src={
													todo.completed
														? "https://c.animaapp.com/mc0jdrt8AQ7iVs/img/icon---ionicons---filled---checkbox.svg"
														: "https://c.animaapp.com/mc0jdrt8AQ7iVs/img/icon---ionicons---filled---square.svg"
												}
											/>

											<div className="flex flex-col justify-center w-[287px]">
												{todo.timerLabel && (
													<div className="inline-flex items-center gap-1">
														<img
															className="w-[13px] h-[13px]"
															alt="Timer icon"
															src="https://c.animaapp.com/mc0jdrt8AQ7iVs/img/material-symbols-timer-outline-rounded.svg"
														/>
														<div className="[font-family:'Pretendard-Regular',Helvetica] font-normal text-[#8c8f98] text-[11px] text-center tracking-[-0.22px] leading-[normal] whitespace-nowrap">
															{todo.timerLabel}
														</div>
													</div>
												)}

												<div
													className={`${
														todo.completed
															? "font-button-14p font-[number:var(--button-14p-font-weight)] text-[#8c8f98] text-[length:var(--button-14p-font-size)] tracking-[var(--button-14p-letter-spacing)] leading-[var(--button-14p-line-height)] line-through [font-style:var(--button-14p-font-style)]"
															: "font-button-medium-14p font-[number:var(--button-medium-14p-font-weight)] text-black text-[length:var(--button-medium-14p-font-size)] tracking-[var(--button-medium-14p-letter-spacing)] leading-[var(--button-medium-14p-line-height)] [font-style:var(--button-medium-14p-font-style)]"
													}`}
												>
													{todo.text}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				))}

				{/* Home Indicator */}
				<div className="fixed w-[390px] h-[33px] top-[811px] left-0 flex justify-center items-center">
					<div className="w-[135px] h-[5px] bg-black rounded-[100px]" />
				</div>
			</div>
		</div>
	);
}
