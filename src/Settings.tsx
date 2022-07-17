import React, { useState } from "react";
import PropTypes, { InferProps } from "prop-types";
import DatePicker, {
  CalendarContainer,
  CalendarContainerProps,
} from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Settings = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  return (
    <div style={{ zIndex: 1, position: "relative" }}>
      Start:
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date!)}
      />
      End:
      <DatePicker selected={endDate} onChange={(date) => setEndDate(date!)} />
    </div>
  );
};

export default Settings;
