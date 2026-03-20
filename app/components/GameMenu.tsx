import { Link } from "@remix-run/react";

type GameMenuProps = {
  homeLink: string;
  logoLink: string;
};

const menuItems = [
  { to: "bugs", icon: "icon-bug-net", label: "Bugs" },
  { to: "fish", icon: "icon-fishing-pole", label: "Fish" },
  { to: "fossils", icon: "icon-fossil", label: "Fossils" },
];

export default function GameMenu({ homeLink, logoLink }: GameMenuProps) {
  return (
    <div className="flex flex-col items-center gap-10 py-4">
      <div className="flex w-full">
        <Link to={homeLink} className="btn btn-primary">
          <i className="icon-arrow-left"></i>
        </Link>
        <div className="h-40 self-center mx-auto text-center">
          <Link to={logoLink}>
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
          {menuItems.map((item) => (
            <li key={item.to} className="my-2">
              <Link
                className="flex items-center gap-3 self-stretch p-2 btn btn-primary"
                to={item.to}
                rel="noreferrer"
              >
                <i className={`${item.icon} text-2xl`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
