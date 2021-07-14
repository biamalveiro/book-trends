import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import moment from "moment";

export default function Tops({ getBookData }) {
  const [topThreeMonths, setTopThreeMonths] = useState([]);
  const [topSixMonths, setTopSixMonths] = useState([]);
  const [topOneYear, setTopOneYear] = useState([]);

  const sixMonthsAgo = moment().subtract(6, "months");
  const threeMonthsAgo = moment().subtract(3, "months");
  const oneYearAgo = moment().subtract(1, "years");

  const getBookTops = async (date, stateCallback) => {
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        $limit: 10,
        materialtype: "BOOK",
        usageclass: "Physical",
        $select: "title, sum(checkouts) AS sum",
        $where: `(checkoutyear > ${date.year()}) OR (checkoutyear = ${date.year()} AND checkoutmonth >= ${date.month()})`,
        $group: "title",
        $order: "sum DESC",
      }),
    });
    const names = await res.json();
    stateCallback(names);
  };

  const renderTop = (topArray, title) => (
    <ol className={"w-4/12 mx-2"}>
      <h4 className="text-xl text-gray-500 my-4">{title}</h4>
      {isEmpty(topArray) ? <p className="text-gray-400">Loading...</p> : null}
      {topArray.map((datum, index) => (
        <li>
          <span className="font-bold text-gray-500 mr-2">{index + 1}.</span>
          <a
            onClick={() => getBookData(datum.title)}
            className="underline text-green-600 cursor-pointer hover:text-green-800"
          >
            {datum.title}
          </a>
        </li>
      ))}
    </ol>
  );

  useEffect(() => {
    getBookTops(oneYearAgo, setTopOneYear);
    getBookTops(sixMonthsAgo, setTopSixMonths);
    getBookTops(threeMonthsAgo, setTopThreeMonths);
  }, []);
  return (
    <div className="flex flex-row">
      {renderTop(topThreeMonths, "Last Three Months")}
      {renderTop(topSixMonths, "Last Six Months")}
      {renderTop(topOneYear, "Last Year")}
    </div>
  );
}
