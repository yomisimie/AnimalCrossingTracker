import { Link } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import rarity from "~/const/rarity";

type TimeRange = {
  from: number;
  to: number;
};

type Availability = {
  month: number[];
  time: TimeRange[];
};

type BaseItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  location?: string;
  weather?: string;
  size?: string;
  rarity?: string;
  availability?: Availability[];
};

type Month = {
  id: number;
  name: string;
  shortName: string;
  letter: string;
};

type ItemType = 'bugs' | 'fish' | 'fossils';

type ACListProps = {
  title: string;
  type: ItemType;
  rawData: BaseItem[];
  months?: Month[];
  caughtId?: string;
  donatedId: string;
  backLink?: string;
};

export default function ACList({
  title,
  type,
  rawData,
  months,
  caughtId,
  donatedId,
  backLink = "/",
}: ACListProps) {
  const [data, setData] = useState<BaseItem[]>(rawData);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedMonths, setSelectedMonths] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [caughtItems, setCaughtItems, removeCaughtItems] = useLocalStorage<
    number[]
  >(caughtId || "caught", []);
  const [donatedItems, setDonatedItems, removeDonatedItems] = useLocalStorage<
    number[]
  >(donatedId, []);

  const hasTimeMonthFilters = type !== 'fossils';
  const hasCaughtTracking = type !== 'fossils';
  const hasFossilSizeColumn = type === 'fossils';
  const usesWeatherColumn = type === "bugs" && backLink === "/ac";

  useEffect(() => {
    let filteredData = rawData;

    if (hasTimeMonthFilters && months && selectedMonths.length > 0) {
      filteredData = filteredData.filter((item) =>
        selectedMonths.some((month) =>
          item.availability?.some((a) => a.month.includes(month)),
        ),
      );
    }

    if (hasTimeMonthFilters && selectedTime !== null) {
      filteredData = filteredData.filter((item) => {
        return item.availability?.some((a) => {
          return a.time.some((t) => {
            if (t.from > t.to) {
              return selectedTime >= t.from || selectedTime <= t.to;
            }
            return selectedTime >= t.from && selectedTime <= t.to;
          });
        });
      });
    }

    if (searchTerm) {
      filteredData = filteredData.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setData(filteredData);
  }, [selectedTime, selectedMonths, searchTerm, rawData, months, hasTimeMonthFilters]);
  return (
    <>
      <div className="flex py-4 border-neutral-500 border-opacity-25 border-b-2">
        <Link to={backLink} className="btn btn-primary">
          <i className="icon-arrow-left"></i>
        </Link>
        <h1 className="mx-auto text-center text-3xl font-[FinkHeavy] text-primary self-center">
          {title}
        </h1>
      </div>

      <div className="flex justify-between gap-2 border-neutral-500 border-opacity-25 border-b-2 py-4 sticky top-0 z-10 bg-base-100">
        <div className="flex justify-start gap-2">
          {hasTimeMonthFilters && (
            <>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-32 justify-start">
                  <i className="icon-stopwatch text-2xl"></i>
                  {selectedTime !== null
                    ? `${selectedTime.toString().padStart(2, "0")}:00`
                    : "--:--"}
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
                <ul className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-80 overflow-auto">
                  {Array.from({ length: 24 }, (_, i) => (
                    <li key={i}>
                      <input
                        type="radio"
                        name="theme-dropdown"
                        className="theme-controller btn btn-ghost btn-sm btn-block justify-start"
                        checked={selectedTime === i}
                        aria-label={`${i.toString().padStart(2, "0")}:00`}
                        value={`${i.toString().padStart(2, "0")}:00`}
                        onChange={() => setSelectedTime(i)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
              <button
                type="button"
                className="btn btn-error"
                disabled={selectedTime === null}
                onClick={() => setSelectedTime(null)}
                title="Clear time"
              >
                <i className="icon-cancel"></i>
              </button>
              <div className="dropdown">
                <div tabIndex={0} role="button" className="btn w-28 justify-start">
                  <i className="icon-calendar text-2xl"></i>
                  {selectedMonths.length
                    ? selectedMonths
                        .map(
                          (monthId) =>
                            months?.find((month) => month.id === monthId)?.shortName,
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
                <ul className="dropdown-content bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl max-h-80 overflow-auto">
                  {months?.map((month) => (
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
                              : [...prev, month.id],
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
              >
                <i className="icon-cancel"></i>
              </button>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => {
                  const date = new Date();
                  setSelectedTime(date.getHours());
                  setSelectedMonths([new Date().getMonth() + 1]);
                }}
                title="Now"
              >
                Now
              </button>
            </>
          )}
        </div>
        <label
          className="input input-bordered flex items-center gap-2"
          aria-label="Search bugs"
        >
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="icon-magnifying-glass"></i>
          <button onClick={() => setSearchTerm("")}>
            <i
              className={`icon-cancel ${
                searchTerm ? "text-red-500 cursor-pointer" : ""
              }`}
              title="Clear search"
            ></i>
          </button>
        </label>
        <a
          className="btn btn-error self-end"
          title="Clear data"
          href="#clear_data_modal"
        >
          <i className="icon-cancel"></i>Clear data
        </a>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-4">
          <div className="py-12 flex gap-4 justify-center align-middle">
            <img
              src="https://dodo.ac/np/images/1/1b/Blathers_NH.png"
              alt="Blathers"
              className="max-w-48"
            />
            <div className="self-center">
              <p>Hooooo... WHO?! Hoo!</p>
              <p>I beg your pardon!</p>
              <p>We seem to have no data for the filters (fortunately).</p>
            </div>
          </div>
        </div>
      ) : (
        <table className="table table-sm text-center w-full my-4">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Image</th>
              <th>Price</th>
              {hasTimeMonthFilters && (
                <>
                  <th>Location</th>
                  <th>{usesWeatherColumn ? "Weather" : "Rarity"}</th>
                  <th>Availability</th>
                </>
              )}
              {hasFossilSizeColumn && <th>Size</th>}
              {hasCaughtTracking && <th>Caught</th>}
              <th>Donated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="hover">
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td className="text-center min-w-16">
                  <div className="avatar">
                    <div className="w-12 rounded-full bg-[#a4d4a2] p-0.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="pixelated inline-block w-12 h-auto"
                      />
                    </div>
                  </div>
                </td>
                <td className="align-middle">
                  <span className="flex gap-1 justify-center items-center">
                    <img
                      src="https://dodo.ac/np/images/thumb/4/49/99k_Bells_NH_Inv_Icon_cropped.png/15px-99k_Bells_NH_Inv_Icon_cropped.png"
                      alt="Bells"
                    />
                    {item.price}
                  </span>
                </td>
                {hasTimeMonthFilters && (
                  <>
                    <td className="max-w-52">{item.location}</td>
                    <td className="max-w-52">
                      {usesWeatherColumn ? item.weather : rarity[item.rarity ?? 0]}
                    </td>
                    <td>
                      <ul className="flex flex-col gap-1">
                        {item.availability?.map((a, index) => (
                          <li key={index} className="flex justify-between">
                            <span className="whitespace-pre-line text-left">
                              {a.time
                                .map(
                                  (t) =>
                                    `${t.from
                                      .toString()
                                      .padStart(2, "0")}:00 - ${t.to
                                      .toString()
                                      .padStart(2, "0")}:00`,
                                )
                                .join("\n")}
                            </span>
                            <span>
                              <ul className="flex gap-1 justify-end flex-wrap">
                                {months?.map((month) => (
                                  <li
                                    key={month.name}
                                    className="tooltip"
                                    data-tip={month.name}
                                  >
                                    <button
                                      className={`badge cursor-pointer ${
                                        a.month.includes(month.id)
                                          ? "badge-primary"
                                          : "badge-neutral"
                                      }`}
                                      aria-label={month.name}
                                      onClick={() => setSelectedMonths([month.id])}
                                    >
                                      {month.letter}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  </>
                )}
                {hasFossilSizeColumn && (
                  <td className="flex justify-center">
                    {item.size ? <img src={item.size} alt="" /> : "-"}
                  </td>
                )}
                {hasCaughtTracking && (
                  <td>
                    <div className="form-control">
                      <label className="label cursor-pointer flex justify-center items-center">
                        <span className="label-text me-2 md:hidden">Caught</span>
                        <input
                          type="checkbox"
                          className="toggle toggle-success"
                          checked={caughtItems.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCaughtItems([...caughtItems, item.id]);
                            } else {
                              setCaughtItems(
                                caughtItems.filter((id) => id !== item.id),
                              );
                            }
                          }}
                        />
                      </label>
                    </div>
                  </td>
                )}
                <td>
                  <div className="form-control">
                    <label className="label cursor-pointer flex justify-center items-center">
                      <span className="label-text me-2 md:hidden">Donated</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={donatedItems.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDonatedItems([...donatedItems, item.id]);
                          } else {
                            setDonatedItems(
                              donatedItems.filter((id) => id !== item.id),
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
      )}

      <div className="modal" role="dialog" id="clear_data_modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Clear saved data?</h3>
          <p className="py-4">This will delete all the saved data</p>
          <div className="modal-action">
            <a
              href="#"
              className="btn btn-error"
              onClick={() => {
                removeCaughtItems();
                removeDonatedItems();
              }}
            >
              Yes
            </a>
            <a href="#" className="btn btn-info">
              No
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
