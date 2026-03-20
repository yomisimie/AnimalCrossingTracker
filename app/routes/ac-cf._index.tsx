import { MetaFunction } from "@remix-run/node";
import GameMenu from "~/components/GameMenu";

export const meta: MetaFunction = () => {
  return [
    { title: "Animal Crossing: City Folk (WII)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function AC() {
  return <GameMenu homeLink="/" logoLink="/ac" />;
}
