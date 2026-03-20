import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import fossils from "../../json/ac-cf/fossils.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Fossils (WII)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACCFFossils() {
  return (
    <ACList
      title="Fossils (WII)"
      type="fossils"
      rawData={fossils}
      donatedId="ACCF-donatedFossils"
      backLink="/ac-cf"
    />
  );
}
