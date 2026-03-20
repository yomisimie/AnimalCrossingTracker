import { MetaFunction } from "@remix-run/node";
import GameMenu from "~/components/GameMenu";

export const meta: MetaFunction = () => {
  return [
    { title: "Animal Crossing: Wild World (DS)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACWW() {
  return <GameMenu homeLink="/" logoLink="/ac-ww" />;
}
