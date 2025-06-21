import { TaskItem } from "./TaskItem";

export const DateGroup = ({ group }: { group: any }) => {
	return (
		<div className="mb-6">
			<div className="text-sm text-gray-50 font-semibold mb-2">
				{group.date}
			</div>
			{group.items.map((task: any) => (
				<TaskItem key={task.id} task={task} />
			))}
		</div>
	);
};
