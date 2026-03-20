import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import bugs from "../../json/ac-ww/bugs.json";
import months from "../../json/months.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Bugs (DS)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACWWBugs() {
  return (
    <ACList
      type="bugs"
      title="Bugs (DS)"
      rawData={bugs}
      months={months}
      caughtId="ACWW-caughtBugs"
      donatedId="ACWW-donatedBugs"
      backLink="/ac-ww"
    />
  );
}
