import React, { useState, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns'; // Ensure you have date-fns installed for date formatting

interface Props {
  // Define the props if any are required, otherwise remove this interface
}

const DateComponent: React.FC<Props> = () => {

  const SalesSpanOption = ["時間帯別", "日別", "月別", "曜日別"];
  const SalesTypeOption = ["総売上", "純売上", "粗利益", "営業利益"];

  const SelectedHourOption = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23,
  ];
  const salesDetailData = {
    純売上: 19800,
    "純売上(税別)": 18000,
    消費税: 1800,
    総売上: 18000,
    値引き: 0,
    原価: 4500,
    粗利益: 13500,
    販売費: 11500,
    営業利益: 2000,
    客数: 22,
    価格変動: 2.5,
  };

  const startDate = [2021, 10, 1];
  const Today = new Date();
  const DayName = ["日", "月", "火", "水", "木", "金", "土"];
  const YearMonthList: { [key: string]: number[] } = Object();
  for (
    let i = startDate;
    i[0] < Number(format(Today, "yyyy")) ||
    (i[0] === Number(format(Today, "yyyy")) &&
      i[1] <= Number(format(Today, "MM")));

  ) {
    if (Object.keys(YearMonthList).includes(String(i[0]))) {
      YearMonthList[String(i[0])].push(i[1]);
    } else {
      YearMonthList[String(i[0])] = [i[1]];
    }
    if (i[1] !== 12) {
      i[1]++;
    } else {
      i[0]++;
      i[1] = 1;
    }
  }
  const [selectedSalesSpan, setSelectedSalesSpan] = useState("時間帯別");
  const [selectedSalesType, setSelectedSalesType] = useState("総売上");
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("通常売上");
  const [selectedHour, setSelectedHour] = useState(14);
  const [selectedDate, setSelectedDate] = useState<Date>(Today);
  const [selectedYear, setSelectedYear] = useState<Number>(
    Number(format(Today, "yyyy")),
  );
  const [selectedMonth, setSelectedMonth] = useState<Number>(
    Number(format(Today, "MM")),
  );
  const [selectedDay, setSelectedDay] = useState<String>(
    DayName[Number(format(Today, "e"))],
  );
  const dateList: Date[] = [];


  for (let i = 1; i < 8; i++) {
    const settingDate: Date = new Date(Today);
    settingDate.setDate(Today.getDate() - Number(format(Today, "e")) + i);
    dateList.push(settingDate);
  }
  const [selectedWeek, setSelectedWeek] = useState<Date[]>(dateList);


  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const selectedHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedHour(e.target.value);
  };

  const selectedSalesTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSalesType(e.target.value);
  };

  const customDateFormat = (date: Date) => {
    // Implement your custom date format function here
    return format(date, 'yyyy-MM-dd');
  };

  const highlightCustomDates = (date: Date) => {
    // Implement your custom date highlight function here
    return '';
  };

  return (
    <div className="display-span-option">
            {selectedSalesSpan === "時間帯別" ? (
              <>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat={customDateFormat(selectedDate)} // 日付の表示形式を指定
                  placeholderText="日付を選択" // プレースホルダーテキスト
                  className="display-date"
                />
                <select
                  className="display-hour-select"
                  value={selectedHour}
                  onChange={selectedHourChange}
                >
                  {SelectedHourOption.map((value, index) => (
                    <option value={value}>
                      {value}時〜{value + 1}時
                    </option>
                  ))}
                </select>
              </>
            ) : selectedSalesSpan === "日別" ? (
              <>
                <div className="display-week-select">
                  {format(selectedDate, "M月")}第
                  {Math.floor(
                    (selectedDate.getDate() -
                      Number(format(selectedDate, "e")) +
                      5) /
                      7,
                  ) + 1}
                  週
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat={customDateFormat(selectedDate)} // 日付の表示形式を指定
                  placeholderText="日付を選択" // プレースホルダーテキスト
                  className="display-date"
                  highlightDates={selectedWeek}
                  dayClassName={highlightCustomDates}
                />
              </>
            ) : selectedSalesSpan === "月別" ? (
              <>
                <select
                  className="display-year-select"
                  value={String(selectedYear)}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {Object.keys(YearMonthList).map((key, index) => (
                    <option value={key}>{key}年</option>
                  ))}
                </select>
                <select
                  className="display-month-select"
                  value={String(selectedMonth)}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {YearMonthList[String(selectedYear)].map((value, index) => (
                    <option value={value}>{value}月</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <select
                  className="display-day-select"
                  value={String(selectedDay)}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {DayName.map((value, index) => (
                    <option value={value}>{value}曜日</option>
                  ))}
                </select>
              </>
            )}
            <div
              style={{ fontSize: "16px", width: "30px", textAlign: "center" }}
            >
              の
            </div>
            <select
              className="sales-type-select"
              value={selectedSalesType}
              onChange={selectedSalesTypeChange}
            >
              {SalesTypeOption.map((value, index) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          </div>
  );
};

export default DateComponent;
