import { Link } from "@remix-run/react";
import { useLocalStorage } from "usehooks-ts";
import { useEffect, useState } from "react";
import {
  ArrowDownOnSquareStackIcon,
  ArrowUpIcon,
  ArrowUpOnSquareStackIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

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
  color?: string[];
  availability?: Availability[];
};

type Month = {
  id: number;
  name: string;
  shortName: string;
  letter: string;
};

type ItemType = "bugs" | "fish" | "fossils";

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
  const [hideCaught, setHideCaught] = useState<boolean>(false);
  const [hideDonated, setHideDonated] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [caughtItems, setCaughtItems, removeCaughtItems] = useLocalStorage<
    number[]
  >(caughtId || "caught", []);
  const [donatedItems, setDonatedItems, removeDonatedItems] = useLocalStorage<
    number[]
  >(donatedId, []);

  const hasTimeMonthFilters = type !== "fossils";
  const hasCaughtTracking = type !== "fossils";
  const hasFossilSizeColumn = type === "fossils";
  const usesWeatherColumn = type === "bugs" && backLink === "/ac";
  const usesShadowSize = type === "fish" && backLink === "/ac";
  const usesRarity = type === "bugs" && backLink === "/ac-cf";
  const donatedCount = rawData.filter((item) =>
    donatedItems.includes(item.id),
  ).length;
  const caughtCount = rawData.filter((item) =>
    caughtItems.includes(item.id),
  ).length;
  const fossilColorClassMap: Record<string, string> = {
    black: "bg-black text-white border-black",
    white: "bg-white text-black border-base-300",
    gray: "bg-gray-500 text-white border-gray-500",
    grey: "bg-gray-500 text-white border-gray-500",
    brown: "bg-amber-700 text-white border-amber-700",
    red: "bg-red-500 text-white border-red-500",
    orange: "bg-orange-500 text-white border-orange-500",
    yellow: "bg-yellow-400 text-black border-yellow-400",
    green: "bg-green-500 text-white border-green-500",
    blue: "bg-blue-500 text-white border-blue-500",
    purple: "bg-purple-500 text-white border-purple-500",
    pink: "bg-pink-400 text-white border-pink-400",
  };

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 150);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
  }, [
    selectedTime,
    selectedMonths,
    searchTerm,
    rawData,
    months,
    hasTimeMonthFilters,
  ]);

  const filterCaughtItems = (checked: boolean) => {
    setHideCaught(checked);
    if (checked) {
      setData((prev) => prev.filter((item) => !caughtItems.includes(item.id)));
    } else {
      setData(rawData);
    }
  };

  const filterDonatedItems = (checked: boolean) => {
    setHideDonated(checked);
    filterCaughtItems(checked);
    if (checked) {
      setData((prev) => prev.filter((item) => !donatedItems.includes(item.id)));
    } else {
      setData(rawData);
    }
  };

  const exportSavedData = () => {
    const payload = {
      title,
      type,
      exportedAt: new Date().toISOString(),
      data: {
        donated: donatedItems,
        ...(hasCaughtTracking && caughtId ? { caught: caughtItems } : {}),
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const date = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `${type}-saved-data-${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const loadSaveData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const validItemIds = new Set(rawData.map((item) => item.id));
          const normalizeIds = (value: unknown): number[] =>
            Array.isArray(value)
              ? value.filter(
                  (id): id is number =>
                    typeof id === "number" && validItemIds.has(id),
                )
              : [];

          const importedDonatedItems = normalizeIds(json?.data?.donated);
          const importedCaughtItems = normalizeIds(json?.data?.caught);

          setDonatedItems([...new Set(importedDonatedItems)]);

          if (hasCaughtTracking) {
            setCaughtItems([...new Set(importedCaughtItems)]);
          }
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
      <div className="flex py-4 border-neutral-500 border-opacity-25 border-b-2">
        <div className="flex items-start justify-start gap-2">
          <div className="tooltip tooltip-info tooltip-bottom" data-tip="Back">
            <Link to={backLink} className="btn btn-primary">
              <i className="icon-arrow-left"></i>
            </Link>
          </div>
          <div
            className="tooltip tooltip-info tooltip-bottom"
            data-tip="Export data"
          >
            <button
              type="button"
              className="btn btn-info"
              onClick={exportSavedData}
            >
              <ArrowDownOnSquareStackIcon className="w-5 h-5" />
            </button>
          </div>
          <div
            className="tooltip tooltip-info tooltip-bottom"
            data-tip="Load data"
          >
            <button className="btn btn-secondary" onClick={loadSaveData}>
              <ArrowUpOnSquareStackIcon className="w-5 h-5" />
            </button>
          </div>
          <div
            className="tooltip tooltip-info tooltip-bottom"
            data-tip="Clear data"
          >
            <a
              className="btn btn-error self-end"
              title="Clear data"
              href="#clear_data_modal"
            >
              <XCircleIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
        <h1 className="mx-auto text-center text-3xl font-[FinkHeavy] text-primary self-center">
          {title}
        </h1>
        <div className="stats border border-neutral border-opacity-20">
          <div className="stat place-items-center">
            <div className="stat-title">Caught</div>
            <div className="stat-value text-primary">{caughtCount}</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Donated</div>
            <div className="stat-value text-primary">{donatedCount}</div>
          </div>
          <div className="stat place-items-center">
            <div className="stat-title">Left</div>
            <div className="stat-value text-primary">
              {rawData.length - donatedCount}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between gap-2 border-neutral-500 border-opacity-25 border-b-2 py-4 sticky top-0 z-10 bg-base-100">
        <div className="flex justify-start gap-2">
          {hasTimeMonthFilters && (
            <>
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn min-w-32 px-3 justify-start"
                >
                  <ClockIcon className="w-5 h-5" />
                  {selectedTime !== null
                    ? `${selectedTime.toString().padStart(2, "0")}:00`
                    : "--:--"}
                  <ChevronDownIcon className="w-5 h-5" />
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
                <XCircleIcon className="w-5 h-5" />
              </button>
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn min-w-28 px-3 justify-start"
                >
                  <CalendarIcon className="w-5 h-5" />
                  {selectedMonths.length
                    ? selectedMonths
                        .map(
                          (monthId) =>
                            months?.find((month) => month.id === monthId)
                              ?.shortName,
                        )
                        .join(", ")
                        .substring(0, 10) +
                      (selectedMonths.length > 1 ? "..." : "")
                    : "---"}
                  <ChevronDownIcon className="w-5 h-5" />
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
                <XCircleIcon className="w-5 h-5" />
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
        <div className="flex justify-start gap-4">
          <label htmlFor="" className="label">
            Hide:
          </label>
          {hasCaughtTracking && (
            <label className="label">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={hideCaught}
                onChange={(e) => {
                  filterCaughtItems(e.target.checked);
                }}
              />
              &nbsp;Caught
            </label>
          )}
          <label className="label">
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={hideDonated}
              onChange={(e) => {
                filterDonatedItems(e.target.checked);
              }}
            />
            &nbsp;Donated
          </label>
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
          <MagnifyingGlassIcon className="w-5 h-5 opacity-50" />
          <button onClick={() => setSearchTerm("")}>
            <XCircleIcon
              className={`w-5 h-5 ${
                searchTerm ? "text-red-500" : "text-gray-300"
              }`}
              title="Clear search"
            />
          </button>
        </label>
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
                  {usesWeatherColumn && <th>Weather</th>}
                  {usesRarity && <th>Rarity</th>}
                  {usesShadowSize && <th>Shadow Size</th>}
                  <th>Availability</th>
                </>
              )}
              {hasFossilSizeColumn && (
                <>
                  <th>Size</th>
                  <th>Color</th>
                </>
              )}
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
                    {usesWeatherColumn && (
                      <td className="max-w-52">{item.weather}</td>
                    )}
                    {usesRarity && <td className="max-w-52">{item.rarity}</td>}
                    {usesShadowSize && (
                      <td className="max-w-52">{item.size}</td>
                    )}
                    <td>
                      <ul className="flex flex-col gap-1">
                        {item.availability?.map((a, index) => (
                          <li
                            key={index}
                            className="flex justify-between py-[2px] px-2 hover:bg-info/10 rounded-box"
                          >
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
                                    className={
                                      a.month.includes(month.id)
                                        ? "tooltip tooltip-top tooltip-primary"
                                        : ""
                                    }
                                    data-tip={month.name}
                                  >
                                    <button
                                      className={`badge cursor-pointer ${
                                        a.month.includes(month.id)
                                          ? "badge-primary"
                                          : "badge-neutral"
                                      }`}
                                      aria-label={month.name}
                                      onClick={() =>
                                        setSelectedMonths([month.id])
                                      }
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
                  <>
                    <td className="flex justify-center">
                      {item.size ? <img src={item.size} alt="" /> : "-"}
                    </td>
                    <td>
                      {item.color && item.color.length > 0 ? (
                        <span className="flex flex-col align-center justify-center items-center gap-1">
                          {item.color.map((color) => (
                            <span
                              key={color}
                              className={`badge ${
                                fossilColorClassMap[
                                  color.trim().toLowerCase()
                                ] ?? "badge-neutral"
                              } w-16`}
                              title={color}
                            >
                              {color}
                            </span>
                          ))}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </>
                )}
                {hasCaughtTracking && (
                  <td>
                    <div className="form-control">
                      <label className="label cursor-pointer flex justify-center items-center">
                        <span className="label-text me-2 md:hidden">
                          Caught
                        </span>
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

      <button
        className={`fixed  right-4 btn btn-primary rounded-box z-50 transition-all duration-200 ${
          showScrollTop ? "bottom-4" : "-bottom-28 pointer-events-none"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUpIcon className="w-6 h-6" />
      </button>
    </>
  );
}
