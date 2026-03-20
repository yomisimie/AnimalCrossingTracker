import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import bugs from "../../json/ac-cf/bugs.json";
import months from "../../json/months.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Bugs (WII)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACCFBugs() {
  return (
    <ACList
      type="bugs"
      title="Bugs (WII)"
      rawData={bugs}
      months={months}
      caughtId="ACCF-caughtBugs"
      donatedId="ACCF-donatedBugs"
      backLink="/ac-cf"
    />
  );
}
