import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import fish from "../../json/ac-ww/fish.json";
import months from "../../json/months.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Fish (DS)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACWWFish() {
  return (
    <ACList
      type="fish"
      title="Fish (DS)"
      rawData={fish}
      months={months}
      caughtId="ACWW-caughtFish"
      donatedId="ACWW-donatedFish"
      backLink="/ac-ww"
    />
  );
}
