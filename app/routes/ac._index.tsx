import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Animal Crossing (GCN)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function AC() {
  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <div className="flex w-full">
        <Link to="/" className="btn btn-primary">
          <i className="icon-arrow-left"></i>
        </Link>
        <div className="h-40 self-center mx-auto text-center">
          <Link to="/ac">
            <img
              src="./logo.png"
              alt="Animal Crossing Tracker"
              className="block h-full w-auto"
            />
          </Link>
        </div>
        <div className="w-12 h-12"></div>
      </div>
      <nav className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-gray-700 p-4 min-w-96">
        <ul className="w-full">
          <li key="ac/bugs" className="my-2">
            <Link
              className="flex items-center gap-3 self-stretch p-2 btn btn-primary"
              to="bugs"
              rel="noreferrer"
            >
              <i className="icon-bug-net text-2xl"></i>
              Bugs
            </Link>
          </li>
          <li key="ac/fish" className="my-2">
            <Link
              className="flex items-center gap-3 self-stretch p-2 btn btn-primary"
              to="fish"
              rel="noreferrer"
            >
              <i className="icon-fishing-pole text-2xl"></i>
              Fish
            </Link>
          </li>
          <li key="ac/fossils" className="my-2">
            <Link
              className="flex items-center gap-3 self-stretch p-2 btn btn-primary"
              to="fossils"
              rel="noreferrer"
            >
              <i className="icon-fossil text-2xl"></i>
              Fossils
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
