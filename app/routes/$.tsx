import { Link } from "@remix-run/react";

export default function NotFound() {
  return (
    <div className="py-12 flex gap-4 justify-center align-middle">
      <img
        src="https://dodo.ac/np/images/1/1b/Blathers_NH.png"
        alt="Blathers"
        className="max-w-48"
      />
      <div className="self-center">
        <p>Hooooo... WHO?! Hoo!</p>
        <p>I beg your pardon! We seem to be lost.</p>
        If you need to gather yourself, return to the{" "}
        <Link to="/" className="btn btn-link p-0">
          homepage
        </Link>
      </div>
    </div>
  );
}
