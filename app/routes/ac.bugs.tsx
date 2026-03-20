import { MetaFunction } from "@remix-run/node";
import ACList from "~/components/ACList";
import bugs from "../../json/ac/bugs.json";
import months from "../../json/months.json";

export const meta: MetaFunction = () => {
  return [
    { title: "Bugs (GCN)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACBugs() {
  return (
    <ACList
      type="bugs"
      title="Bugs (GCN)"
      rawData={bugs}
      months={months}
      caughtId="AC-caughtBugs"
      donatedId="AC-donatedBugs"
      backLink="/ac"
    />
  );
}
