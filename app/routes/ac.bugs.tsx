import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import bugs from "json/ac/bugs.json";
import months from "json/months.json";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Bug from "~/types/Bug";

export const meta: MetaFunction = () => {
  return [
    { title: "Bugs (GCN)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACBugs() {
  const [data, setData] = useState<Bug[]>(bugs);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [caughtBugs, setCaughtBugs, removeCaughtBugs] = useLocalStorage<
    number[]
  >("AC-caughtBugs", []);
  const [donatedBugs, setDonatedBugs, removeDonatedBugs] = useLocalStorage<
    number[]
  >("AC-donatedBugs", []);

  // Filter bugs based on selected time and months
  useEffect(() => {
    let filteredData = bugs;

    if (selectedTime) {
      filteredData = filteredData.filter((bug: Bug) => {
        return bug.time.some(
          (t) => selectedTime >= t.from && selectedTime <= t.to
        );
      });
    }

    if (selectedMonths.length > 0) {
      filteredData = filteredData.filter((bug: Bug) =>
        selectedMonths.some((month) => bug.months.includes(month))
      );
    }

    setData(filteredData);
  }, [selectedTime, selectedMonths]);

  return (
    <div>
      <div className="flex py-4 border-neutral-500 border-opacity-25 border-b-2">
        <Link to="/ac" className="btn btn-primary">
          <i className="icon-arrow-left"></i>
        </Link>
        <h1 className="mx-auto text-center text-3xl font-[FinkHeavy] text-primary self-center">
          Bugs (GCN)
        </h1>
      </div>
      <div className="flex justify-between gap-2 border-neutral-500 border-opacity-25 border-b-2 py-4">
        <div className="flex justify-start gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn">
              <i className="icon-stopwatch text-2xl"></i>
              {selectedTime ? selectedTime : "--:--"}
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-80 overflow-auto"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <li key={i}>
                  <input
                    type="radio"
                    name="theme-dropdown"
                    className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
                    checked={
                      selectedTime === `${i.toString().padStart(2, "0")}:00`
                    }
                    aria-label={`${i.toString().padStart(2, "0")}:00`}
                    value={`${i.toString().padStart(2, "0")}:00`}
                    onChange={() =>
                      setSelectedTime(`${i.toString().padStart(2, "0")}:00`)
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-error"
            disabled={!selectedTime}
            onClick={() => setSelectedTime("")}
            title="Clear time"
            aria-description="Clear time"
          >
            <i className="icon-cancel"></i>
          </button>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn">
              <i className="icon-calendar text-2xl"></i>
              {selectedMonths.length
                ? selectedMonths
                    .map(
                      (monthId) =>
                        months.find((month) => month.id === monthId)?.shortName
                    )
                    .join(", ")
                : "---"}
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-80 overflow-auto"
            >
              {months.map((month) => (
                <li key={month.id}>
                  <input
                    type="checkbox"
                    name="theme-dropdown"
                    className="theme-controller btn btn-sm btn-block justify-start btn-ghost"
                    checked={selectedMonths.includes(month.id)}
                    aria-label={month.name}
                    value={month.name}
                    onChange={() =>
                      setSelectedMonths((prev) =>
                        prev.includes(month.id)
                          ? prev.filter((id) => id !== month.id)
                          : [...prev, month.id]
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            className="btn btn-error"
            disabled={!selectedMonths.length}
            onClick={() => setSelectedMonths([])}
            title="Clear months"
            aria-description="Clear months"
          >
            <i className="icon-cancel"></i>
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => {
              const date = new Date();
              setSelectedTime(date.getHours() + ":00");
              setSelectedMonths([new Date().getMonth() + 1]);
            }}
            title="Now"
            aria-description="Now"
          >
            Now
          </button>
        </div>
        <a
          className="btn btn-error self-end"
          title="Clear data"
          aria-description="Clear data"
          href="#clear_data_modal"
        >
          <i className="icon-cancel"></i>Clear data
        </a>
      </div>
      <table className="table table-sm text-center w-full my-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Price</th>
            <th>Location</th>
            <th>Weather</th>
            <th>Time</th>
            <th>Months</th>
            <th>Caught</th>
            <th>Donated</th>
          </tr>
        </thead>
        <tbody>
          {data.map((bug: Bug) => (
            <tr key={bug.id} className="hover">
              <td>{bug.name}</td>
              <td className="text-center min-w-16">
                <img
                  src={bug.image}
                  alt={bug.name}
                  className="pixelated inline-block w-12 h-auto"
                />
              </td>
              <td>{bug.price}</td>
              <td>{bug.location}</td>
              <td>{bug.weather}</td>
              <td>{bug.time.map((t) => `${t.from} - ${t.to}`).join("; ")}</td>
              <td>
                <ul className="flex gap-1">
                  {months.map((month) => (
                    <li
                      key={month.name}
                      className={`badge  ${
                        bug.months.includes(month.id)
                          ? "badge-primary"
                          : "badge-neutral"
                      }`}
                    >
                      {month.shortName}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text me-2 md:hidden">Caught</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={caughtBugs.includes(bug.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCaughtBugs([...caughtBugs, bug.id]);
                        } else {
                          setCaughtBugs(
                            caughtBugs.filter((id) => id !== bug.id)
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </td>
              <td>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <span className="label-text me-2 md:hidden">Donated</span>
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={donatedBugs.includes(bug.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setDonatedBugs([...donatedBugs, bug.id]);
                        } else {
                          setDonatedBugs(
                            donatedBugs.filter((id) => id !== bug.id)
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="modal" role="dialog" id="clear_data_modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Clear saved data?</h3>
          <p className="py-4">This will delete all the saved data</p>
          <div className="modal-action">
            <a
              className="btn btn-error"
              onClick={() => {
                console.log("Clearing data");
                removeCaughtBugs();
                removeDonatedBugs();
              }}
            >
              Yes
            </a>
            <a className="btn btn-info">No</a>
          </div>
        </div>
      </div>
    </div>
  );
}
