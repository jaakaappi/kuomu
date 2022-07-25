import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

import "react-datepicker/dist/react-datepicker.css";

const DateTimeSelectors = () => {
  let dateTomorrow = new Date();
  dateTomorrow.setDate(new Date().getDate() + 1);

  const [startDate, setStartDate] = useState(DateTime.local().toJSDate());

  return (
    <>
      Päivä:
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date!)}
      />
    </>
  );
};

export default DateTimeSelectors;
