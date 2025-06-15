import type { Meta, StoryObj } from "@storybook/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
	title: "Components/Button",
	component: Button,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const 기본버튼: Story = {
	args: {
		label: "클릭하세요",
	},
};

export const 클릭이벤트: Story = {
	args: {
		label: "이벤트 버튼",
		onClick: () => alert("버튼이 클릭되었습니다!"),
	},
};
