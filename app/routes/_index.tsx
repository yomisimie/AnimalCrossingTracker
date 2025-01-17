import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Animal Crossing Tracker" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function Index() {
  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <header className="flex flex-col items-center gap-9">
        <div className="h-40">
          <Link to="/">
            <img
              src="./logo.png"
              alt="Animal Crossing Tracker"
              className="block h-full w-auto"
            />
          </Link>
        </div>
        <h1 className="leading text-5xl font-bold font-[FinkHeavy]">Tracker</h1>
      </header>
      <nav className="flex flex-col items-center justify-center gap-2 rounded-3xl border border-gray-700 p-4 min-w-96">
        <ul className="w-full">
          {resources.map(({ href, text, icon }) => (
            <li key={href} className="my-2">
              <Link
                className="flex items-center gap-3 self-stretch p-2 btn btn-primary"
                to={href}
                rel="noreferrer"
              >
                {icon}
                {text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

const resources = [
  {
    href: "/ac",
    text: "Animal Crossing (GCN)",
    icon: <i className="icon-bells text-2xl"></i>,
  },
  {
    href: "ac-ww",
    text: "Animal Crossing: Wild World (NDS)",
    icon: <i className="icon-wild-world text-2xl "></i>,
  },
  {
    href: "ac-cf",
    text: "Animal Crossing: City Folk (NDS)",
    icon: <i className="icon-city-folk text-2xl "></i>,
  },
  {
    href: "ac-nl",
    text: "Animal Crossing: New Leaf (3DS)",
    icon: <i className="icon-new-leaf text-2xl "></i>,
  },
  {
    href: "ac-nh",
    text: "Animal Crossing: New Horizons (NSW)",
    icon: <i className="icon-new-horizons text-2xl "></i>,
  },
];
