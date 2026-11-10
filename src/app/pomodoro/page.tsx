import type { Metadata } from "next";
import Pomodoro from "./Pomodoro";

export const metadata: Metadata = {
  title: "番茄鐘 | ed_tools",
  description: "番茄工作法計時器，幫助你專注工作",
};

export default function PomodoroPage() {
  return <Pomodoro />;
}
