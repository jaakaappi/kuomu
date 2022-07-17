import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const DateTimeSelectors = () => {
  let dateTomorrow = new Date();
  dateTomorrow.setDate(new Date().getDate() + 1);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(dateTomorrow);

  return (
    <>
      Start:
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date!)}
      />
      End:
      <DatePicker selected={endDate} onChange={(date) => setEndDate(date!)} />
    </>
  );
};

export default DateTimeSelectors;
