import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import fish from "../../json/ac-cf/fish.json";
import months from "../../json/months.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Fish (WII)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACCFFish() {
  return (
    <ACList
      title="Fish (WII)"
      type="fish"
      rawData={fish}
      months={months}
      caughtId="ACCF-caughtFish"
      donatedId="ACCF-donatedFish"
      backLink="/ac-cf"
    />
  );
}
