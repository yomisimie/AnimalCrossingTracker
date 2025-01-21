import { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import fossils from "json/ac/fossils.json";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Fossil from "~/types/Fossil";

export const meta: MetaFunction = () => {
  return [
    { title: "Fossils (GCN)" },
    { name: "description", content: "Track your progress!" },
  ];
};

export default function ACFossils() {
  const [data, setData] = useState<Fossil[]>(fossils);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [donatedFossils, setDonatedFossils, removeDonatedFossils] =
    useLocalStorage<number[]>("AC-donatedFossils", []);

  // Filter fossils based on selected time and months
  useEffect(() => {
    let filteredData = fossils;
    if (searchTerm) {
      filteredData = fossils.filter((fossil) =>
        fossil.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setData(filteredData);
  }, [searchTerm]);

  return (
    <>
      <div className="flex py-4 border-neutral-500 border-opacity-25 border-b-2">
        <Link to="/ac" className="btn btn-primary">
          <i className="icon-arrow-left"></i>
        </Link>
        <h1 className="mx-auto text-center text-3xl font-[FinkHeavy] text-primary self-center">
          Fossils (GCN)
        </h1>
      </div>
      <div className="flex justify-between gap-2 border-neutral-500 border-opacity-25 border-b-2 py-4 sticky top-0 z-10 bg-base-100">
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <i className="icon-magnifying-glass"></i>
          <i
            className={`icon-cancel ${
              searchTerm ? "text-red-500 cursor-pointer" : ""
            }`}
            onClick={() => setSearchTerm("")}
            title="Clear search"
          ></i>
        </label>
        <a
          className="btn btn-error self-end"
          title="Clear data"
          aria-description="Clear data"
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
              <th>Group</th>
              <th>HRA Score</th>
              <th>Size</th>
              <th>Donated</th>
            </tr>
          </thead>
          <tbody>
            {data.map((fossil: Fossil) => (
              <tr key={fossil.id} className="hover">
                <td>{fossil.id}</td>
                <td>{fossil.name}</td>
                <td className="text-center min-w-16">
                  <img
                    src={fossil.image}
                    alt={fossil.name}
                    className="pixelated inline-block w-12 h-auto"
                  />
                </td>
                <td>{fossil.price}</td>
                <td>{fossil.group}</td>
                <td>{fossil.score}</td>
                <td>{fossil.size}</td>
                <td>
                  <div className="form-control">
                    <label className="label cursor-pointer flex justify-center items-center">
                      <span className="label-text me-2 md:hidden">Donated</span>
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={donatedFossils.includes(fossil.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDonatedFossils([...donatedFossils, fossil.id]);
                          } else {
                            setDonatedFossils(
                              donatedFossils.filter((id) => id !== fossil.id)
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
              onClick={(e) => {
                console.log("Clearing data");
                removeDonatedFossils();
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
