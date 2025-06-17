import { CheckIcon, ClockIcon } from "lucide-react";

export const TaskItem = ({ task }: { task: any }) => {
	return (
		<div
			className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-2 ${
				task.checked ? "bg-purple-sub2 opacity-50" : "bg-purple-sub3"
			}`}
		>
			<div className="w-5 h-5 mt-1">
				{task.checked ? (
					<div className="w-5 h-5 bg-purple-sub1 rounded-md flex items-center justify-center">
						<CheckIcon size={14} className="text-white" />
					</div>
				) : (
					<div className="w-5 h-5 bg-gray-30 rounded-md" />
				)}
			</div>
			<div className="flex-1 text-gray-7 text-body2 whitespace-pre-line">
				{task.tag && (
					<div className="flex items-center gap-1 text-gray-50 text-xs mb-0.5">
						<ClockIcon size={12} />
						<span>{task.tag}</span>
					</div>
				)}
				{task.label}
			</div>
		</div>
	);
};
