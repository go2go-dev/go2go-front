import  { useState } from "react";
import { ArrowLeft, Plus, Check } from "lucide-react";

interface TodoItem {
	id: number;
	text: string;
	completed: boolean;
	type: "study" | "work" | "chore" | "note";
	hasTime?: boolean;
	time?: string;
}

interface TodoGroup {
	id: number;
	date: string;
	items: TodoItem[];
}

type TodoType = "study" | "work" | "chore" | "note";

export default function TodoApp() {
	const [todos, setTodos] = useState<TodoGroup[]>([
		{
			id: 1,
			date: "2025. 06. 14",
			items: [
				{ id: 1, text: "자격증 공부하기", completed: false, type: "study" },
				{ id: 2, text: "청소 하기", completed: true, type: "chore" },
				{
					id: 3,
					text: "할 일이 모 줄 넘어가는 경우할 일이 두 줄 넘어가는 경우 할 일이 모 줄 넘어가는 경우",
					completed: true,
					type: "note",
				},
			],
		},
		{
			id: 2,
			date: "2025. 06. 13",
			items: [
				{
					id: 4,
					text: "와이어프레임 완성하기",
					completed: false,
					type: "work",
				},
				{
					id: 5,
					text: "자격증 공부하기",
					completed: false,
					type: "study",
					hasTime: true,
					time: "오후 5시",
				},
				{
					id: 6,
					text: "자격증 공부하기",
					completed: true,
					type: "study",
					hasTime: true,
					time: "오전 오후하기",
				},
				{ id: 7, text: "자격증 공부하기", completed: true, type: "study" },
			],
		},
	]);

	const toggleTodo = (dateId: number, itemId: number): void => {
		setTodos((prevTodos) =>
			prevTodos.map((dateGroup) =>
				dateGroup.id === dateId
					? {
							...dateGroup,
							items: dateGroup.items.map((item) =>
								item.id === itemId
									? { ...item, completed: !item.completed }
									: item
							),
						}
					: dateGroup
			)
		);
	};

	const getBackgroundColor = (type: TodoType, completed: boolean): string => {
		if (completed) {
			return "bg-purple-100";
		}

		switch (type) {
			case "study":
				return "bg-blue-50";
			case "work":
				return "bg-blue-50";
			case "chore":
				return "bg-purple-100";
			case "note":
				return "bg-purple-100";
			default:
				return "bg-gray-50";
		}
	};

	const getTextColor = (completed: boolean): string => {
		return completed ? "text-gray-500" : "text-gray-800";
	};

	return (
		<div className="max-w-sm mx-auto bg-white min-h-screen">
			{/* Header */}
			<div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
				<ArrowLeft className="w-6 h-6 text-gray-700" />
				<h1 className="text-lg font-medium text-gray-900">할 일 처리</h1>
				<div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
					<Plus className="w-5 h-5 text-gray-600" />
				</div>
			</div>

			{/* Status Bar */}
			<div className="px-4 py-2 text-xs text-gray-500">9:41</div>

			{/* Todo Lists */}
			<div className="px-4 pb-20">
				{todos.map((dateGroup: TodoGroup) => (
					<div key={dateGroup.id} className="mb-6">
						{/* Date Header */}
						<div className="text-sm text-gray-400 mb-3 font-medium">
							{dateGroup.date}
						</div>

						{/* Todo Items */}
						<div className="space-y-2">
							{dateGroup.items.map((item: TodoItem) => (
								<div
									key={item.id}
									className={`${getBackgroundColor(item.type, item.completed)} rounded-xl p-4 transition-all duration-200`}
								>
									<div className="flex items-start gap-3">
										{/* Checkbox */}
										<button
											onClick={() => toggleTodo(dateGroup.id, item.id)}
											className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors ${
												item.completed
													? "bg-purple-500 border-purple-500"
													: "border-gray-300 bg-white hover:border-purple-300"
											}`}
										>
											{item.completed && (
												<Check className="w-3 h-3 text-white" />
											)}
										</button>

										<div className="flex-1 min-w-0">
											{/* Time indicator if exists */}
											{item.hasTime && item.time && (
												<div className="flex items-center gap-1 mb-1">
													<div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
														<div className="w-2 h-2 bg-gray-500 rounded-full"></div>
													</div>
													<span className="text-xs text-gray-500">
														{item.time}
													</span>
												</div>
											)}

											{/* Todo text */}
											<p
												className={`${getTextColor(item.completed)} text-sm leading-relaxed ${
													item.completed ? "line-through" : ""
												}`}
											>
												{item.text}
											</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Bottom indicator */}
			<div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
				<div className="w-32 h-1 bg-black rounded-full"></div>
			</div>
		</div>
	);
}
