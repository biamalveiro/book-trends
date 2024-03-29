import { useState, useEffect, useCallback } from "react";
import AsyncSelect from "react-select/async";
import { debounce, isEmpty } from "lodash";

import "./App.scss";

import BookBarChart from "./BookBarChart";
import Tops from "./Tops";

const escapeSoQL = (queryString) => {
  return queryString.replace("'", "''");
};

function App() {
  const [inputValue, setInputValue] = useState("");
  const [bookData, setBookData] = useState([]);

  const getBookNames = async (searchString) => {
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        $limit: 50,
        $select: "distinct title, sum(checkouts)",
        $where: `materialtype='BOOK'`,
        $q: `${escapeSoQL(searchString)}`,
        $group: "title",
        $order: "sum_checkouts DESC",
      }),
    });
    const names = await res.json();
    return names.map((name) => {
      return { value: name.title, label: name.title };
    });
  };

  const getBookData = async (book) => {
    const res = await fetch("/api/books", {
      method: "POST",
      body: JSON.stringify({
        $where: `title='${escapeSoQL(book)}'`,
      }),
    });
    const data = await res.json();
    setBookData(data);
  };

  useEffect(() => {
    if (!isEmpty(inputValue)) {
      getBookData(inputValue.value);
    }
  }, [inputValue]);

  const loadOptions = useCallback(
    debounce((inputValue, callback) => {
      if (inputValue.length > 5)
        getBookNames(inputValue).then((options) => callback(options));
    }, 500),
    []
  );

  const handleChange = (newValue) => {
    setInputValue(newValue);
  };

  return (
    <div className="container md:mx-auto text-gray-800">
      <header className="text-center py-10">
        <h1 className="text-3xl font-semibold grey">Book Trends 📚</h1>
      </header>
      <div className="w-2/4 mx-auto my-10">
        <AsyncSelect
          loadOptions={loadOptions}
          onChange={handleChange}
          isSearchable
          placeholder="Search for a book..."
        />
        {!isEmpty(bookData) ? <BookBarChart data={bookData} /> : null}
      </div>
      <div className="w-3/4 mx-auto">
        <Tops getBookData={getBookData} />
      </div>
    </div>
  );
}

export default App;
