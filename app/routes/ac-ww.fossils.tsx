import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import fossils from "../../json/ac-ww/fossils.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Fossils (DS)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACWWFossils() {
  return (
    <ACList
      type="fossils"
      title="Fossils (DS)"
      rawData={fossils}
      donatedId="ACWW-donatedFossils"
      backLink="/ac-ww"
    />
  );
}
