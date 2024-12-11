export function convertDateToDay(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  let currentDate = new Date(dateString);

  // Lấy ngày và tháng
  let day = currentDate.getDate();

  // Trả về chuỗi ngày và tháng
  return `${day}`;
}

export const editNumber = (num) => {
  if (num < 10) {
    return `0${num}`
  }
  return `${num}`
}

export function convertDateInputToObject(dateString) {
  return {
    day: Number(dateString.split("-")[2]),
    month: Number(dateString.split("-")[1]),
    year: Number(dateString.split("-")[0]),
  };
}
// 2002-12-12 => 12-12-2002
// export function revertDate (dateString)  {
//     const [year, month, day] = dateString?.split('-');
//     const formattedDate = `${day}-${month}-${year}`;
//     return formattedDate;
// }
export function convertDateToDayMonth(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  let currentDate = new Date(dateString);

  // Lấy ngày và tháng
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // getMonth() trả về tháng từ 0-11

  // Đảm bảo định dạng ngày và tháng là hai chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Trả về chuỗi ngày và tháng
  return `${day}/${month}`;
}

export function convertDateToDayMonthYear(date) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  // Lấy ngày và tháng
  let day = date.day;
  let month = date.month;
  let year = date.year;

  // Đảm bảo định dạng ngày và tháng là hai chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Trả về chuỗi ngày và tháng
  return `${day}/${month}/${year}`;
}

export function convertDateToDayMonthYearVietNam(date) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  // Lấy ngày và tháng
  let day = date.day;
  let month = date.month;
  let year = date.year;
  let time = date.time;

  // Đảm bảo định dạng ngày và tháng là hai chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Trả về chuỗi ngày và tháng
  return `${day} tháng ${month}, ${year} (${time} ${Number(time.split(":")[0]) <= 10
    ? "Sáng"
    : Number(time.split(":")[0]) <= 14
      ? "Trưa"
      : Number(time.split(":")[0]) <= 17
        ? "Chiều"
        : "Tối"
    })`;
}

export function convertDateToDayMonthYearVietNam2(date) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  // Lấy ngày và tháng
  let day = date.day;
  let month = date.month;
  let year = date.year;
  let time = date.time;

  // Đảm bảo định dạng ngày và tháng là hai chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;

  // Trả về chuỗi ngày và tháng
  return `${day} tháng ${month}, ${year}`;
}

export function convertDateToDayMonthYearMinuteHour(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  let currentDate = new Date(dateString);

  // Lấy ngày và tháng
  let day = currentDate.getDate() - 1;
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();
  let minute = currentDate.getMinutes();
  let hour = currentDate.getHours();

  // Đảm bảo định dạng ngày và tháng là hai chữ số
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  year = year < 10 ? "0" + year : year;
  minute = minute < 10 ? "0" + minute : minute;
  hour = hour < 10 ? "0" + hour : hour;

  // Trả về chuỗi ngày và tháng
  return `${hour}:${minute} - ${day}/${month}/${year}`;
}

export function formatVietnameseDate(date1) {
  // Tạo đối tượng Date từ chuỗi ngày
  const date = new Date(date1.year, date1.month - 1, date1.day);

  // Mảng các ngày trong tuần và các tháng bằng tiếng Việt
  const daysOfWeek = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy",
  ];
  const months = [
    "tháng 01",
    "tháng 02",
    "tháng 03",
    "tháng 04",
    "tháng 05",
    "tháng 06",
    "tháng 07",
    "tháng 08",
    "tháng 09",
    "tháng 10",
    "tháng 11",
    "tháng 12",
  ];

  // Lấy các thành phần của ngày
  let dayOfWeek = daysOfWeek[date.getDay()];
  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  // Tạo chuỗi ngày theo định dạng mong muốn
  return `${dayOfWeek}, ngày ${day < 10 ? "0" + day : day
    } ${month} năm ${year}`;
}

export function generateTimes(startTime, endTime, interval) {
  let times = [];
  let start = new Date(`1970-01-01T${startTime}:00`);
  let end = new Date(`1970-01-01T${endTime}:00`);

  while (start <= end) {
    let hours = start.getHours();
    let minutes = start.getMinutes();
    let timeString = `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    times.push(timeString);
    start.setMinutes(start.getMinutes() + interval);
  }

  return times;
}
export const compareDateIsHaveInSchedule = (day, schedules) => {
  if (schedules?.length) {
    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i];
      if (
        schedule.date.month === day.month &&
        schedule.date.year === day.year &&
        schedule.date.day === day.day
      ) {
        return schedule.times.length;
      }
    }
  }
  return 0;
};

export const compare2Date = (date1, date2) => {
  if (
    date1.month === date2.month &&
    date1.year === date2.year &&
    date1.day === date2.day
  ) {
    return true;
  }
  return false;
};
export const compare2DateTime = (date1, date2) => {
  if (
    date1.month === date2.month &&
    date1.year === date2.year &&
    date1.day === date2.day &&
    date1.time === date2.time
  ) {
    return true;
  }
  return false;
};

export const compareDate1GetterThanDate2 = (date1, date2) => {
  const d1 = new Date(date1.year + '-' + date1.month + '-' + date1.day)
  const d2 = new Date(date2.year + '-' + date2.month + '-' + date2.day)
  return d1 >= d2
  // if (
  //   date1.month >= date2.month &&
  //   date1.year >= date2.year &&
  //   date1.day >= date2.day
  // ) {
  //   return true;
  // }
  // return false;
};

export const compareTimeDate1GreaterThanDate2 = (date1, date2) => {
  const d1 = new Date(date1.year + '-' + date1.month + '-' + date1.day)
  const d2 = new Date(date2.year + '-' + date2.month + '-' + date2.day)
  if (d1 > d2) {
    return true
  } else if (d1 === d2) {
    const time1 = date1.time.split(":").map(Number);
    const time2 = date2.time.split(":").map(Number);

    const hour1 = time1[0];
    const minute1 = time1[1];
    const hour2 = time2[0];
    const minute2 = time2[1];

    if (hour1 > hour2) return true;
    if (hour1 < hour2) return false;
    return minute1 >= minute2;
  }
  else {
    return false
  }
  // // So sánh năm
  // if (date1.year > date2.year) return true;
  // if (date1.year < date2.year) return false;

  // // So sánh tháng nếu năm bằng nhau
  // if (date1.month > date2.month) return true;
  // if (date1.month < date2.month) return false;

  // // So sánh ngày nếu tháng và năm bằng nhau
  // if (date1.day > date2.day) return true;
  // if (date1.day < date2.day) return false;

  // // Nếu ngày, tháng và năm bằng nhau, so sánh thời gian
  // const time1 = date1.time.split(":").map(Number);
  // const time2 = date2.time.split(":").map(Number);

  // const hour1 = time1[0];
  // const minute1 = time1[1];
  // const hour2 = time2[0];
  // const minute2 = time2[1];

  // if (hour1 > hour2) return true;
  // if (hour1 < hour2) return false;

  // // Nếu giờ bằng nhau, so sánh phút
  // return minute1 >= minute2;
};

export function convertDateToDayMonthYearObject(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  let currentDate = new Date(dateString);

  // Lấy ngày và tháng
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();

  // Trả về chuỗi ngày và tháng
  return { day, month, year };
}

export function convertDateToDayMonthYearTimeObject(dateString) {
  // Tạo một đối tượng Date từ chuỗi ngày hiện tại
  let currentDate = new Date(dateString);

  // Lấy ngày, tháng, năm
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1;
  let year = currentDate.getFullYear();

  // Lấy giờ và phút
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();

  // Định dạng lại thời gian thành chuỗi 'HH:mm'
  let time = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  // Trả về đối tượng chứa ngày, tháng, năm và thời gian
  return { day, month, year, time };
}

export const convertObjectToDate = (date1) => {
  return new Date(date1.year, date1.month - 1, date1.day);
};

export function compareDates(date1, date2) {
  // Lấy các thành phần năm, tháng, ngày của mỗi đối tượng Date
  // const year1 = date1.year;
  // const month1 = date1.month;
  // const day1 = date1.day;

  // const year2 = date2.year;
  // const month2 = date2.month;
  // const day2 = date2.day;

  const d1 = new Date(date1.year + '-' + date1.month + '-' + date1.day)
  const d2 = new Date(date2.year + '-' + date2.month + '-' + date2.day)
  if (d1 === d2) {
    return 0
  } else if (d1 < d2) {
    return -1
  } else {
    return 1
  }

  // So sánh từng thành phần
  // if (year1 < year2) return -1;
  // if (year1 > year2) return 1;

  // if (month1 < month2) return -1;
  // if (month1 > month2) return 1;

  // if (day1 < day2) return -1;
  // if (day1 > day2) return 1;

  // 0 nếu hai ngày bằng nhau.
  // -1 nếu date1 nhỏ hơn date2.
  // 1 nếu date1 lớn hơn date2.

  return 0; // Các thành phần đều bằng nhau
}

export const sortTimes = (times) => {
  return times.sort(function (a, b) {
    // Chuyển đổi thời gian sang định dạng số phút để so sánh
    const timeA =
      parseInt(a.time.split(":")[0]) * 60 + parseInt(a.time.split(":")[1]);
    const timeB =
      parseInt(b.time.split(":")[0]) * 60 + parseInt(b.time.split(":")[1]);

    return timeA - timeB;
  });
};

export const sortDates = (schedule) => {
  schedule.sort((a, b) => {
    // So sánh năm
    if (a.date.year !== b.date.year) {
      return a.date.year - b.date.year;
    }
    // So sánh tháng
    if (a.date.month !== b.date.month) {
      return a.date.month - b.date.month;
    }
    // So sánh ngày
    return a.date.day - b.date.day;
  });
  return schedule;
};

export function sortByAppointmentDate(array) {
  return array.sort((a, b) => {
    const dateA = new Date(
      a.appointment_date.year,
      a.appointment_date.month - 1, // JavaScript months are 0-based
      a.appointment_date.day,
      ...a.appointment_date.time.split(":").map(Number)
    );
    const dateB = new Date(
      b.appointment_date.year,
      b.appointment_date.month - 1,
      b.appointment_date.day,
      ...b.appointment_date.time.split(":").map(Number)
    );
    return dateA - dateB;
  });
}

export function isALargerWithin10Minutes(A, B) {
  // Chuyển đổi thời gian từ chuỗi thành số phút kể từ nửa đêm
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Loại bỏ ký tự '+' nếu có trong chuỗi thời gian B
  if (B.startsWith("+")) {
    B = B.slice(1).trim();
  }

  const minutesA = timeToMinutes(A);
  const minutesB = timeToMinutes(B);

  // Kiểm tra nếu A lớn hơn B trong khoảng cách 10 phút
  return minutesA > minutesB && minutesA - minutesB <= 10;
}

export function calculateDetailedTimeDifference(A, B) {
  // A là thời gian hiện tại
  // B là thời gian cuộc hẹn

  // Tạo đối tượng Date cho A
  const dateA = new Date(
    A.year,
    A.month - 1, // JavaScript months are 0-based
    A.day,
    ...A.time.split(":").map(Number)
  );

  // Tạo đối tượng Date cho B
  const dateB = new Date(
    B.year,
    B.month - 1,
    B.day,
    ...B.time.split(":").map(Number)
  );

  // Tính toán chênh lệch thời gian giữa B và A (milliseconds)
  let diffInMilliseconds = dateB - dateA;

  if (diffInMilliseconds <= 0) {
    return "Cuộc hẹn đã diễn ra";
  }

  // Tính toán các đơn vị thời gian
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Lấy phần dư cho các đơn vị nhỏ hơn
  const remainingHours = diffInHours % 24;
  const remainingMinutes = diffInMinutes % 60;
  const remainingSeconds = diffInSeconds % 60;

  // Tạo chuỗi kết quả
  let result = "";
  if (diffInDays > 0) {
    result += `${diffInDays} ngày `;
  }
  if (remainingHours > 0) {
    result += `${remainingHours} giờ `;
  }
  if (remainingMinutes > 0) {
    result += `${remainingMinutes} phút `;
  }

  return "còn " + result.trim();
}

export function isALargerWithin60Minutes(A, B) {
  // Chuyển đổi thời gian từ chuỗi thành số phút kể từ nửa đêm
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Loại bỏ ký tự '+' nếu có trong chuỗi thời gian B
  if (B.startsWith("+")) {
    B = B.slice(1).trim();
  }

  const minutesA = timeToMinutes(A);
  const minutesB = timeToMinutes(B);

  // Kiểm tra nếu A lớn hơn B trong khoảng cách 60 phút
  return minutesA > minutesB && minutesA - minutesB <= 60;
}

export function isALargerThanBPlus60Minutes(A, B) {
  // Chuyển đổi thời gian từ chuỗi thành số phút kể từ nửa đêm
  function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  // Loại bỏ ký tự '+' nếu có trong chuỗi thời gian B
  if (B.startsWith("+")) {
    B = B.slice(1).trim();
  }

  const minutesA = timeToMinutes(A);
  const minutesB = timeToMinutes(B);

  // Cộng thêm 60 phút vào thời gian B
  const minutesBPlus60 = minutesB + 60;

  // Kiểm tra nếu A lớn hơn B cộng thêm 60 phút
  return minutesA > minutesBPlus60;
}

export const adjustDisplayTime = (time) => {
  const timeNumber = Number(time);
  if (timeNumber < 10) {
    return `0${timeNumber}`;
  }
  return timeNumber;
};

/// them
export const getMonthArray = (startMonth, startYear) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Tháng hiện tại (1 - 12)

  const months = [];

  let year = startYear;
  let month = startMonth;

  while (
    year < currentYear ||
    (year === currentYear && month <= currentMonth)
  ) {
    months.push(`${month.toString().padStart(2, "0")}/${year}`);
    month++;

    if (month > 12) {
      month = 1;
      year++;
    }
  }

  return months;
};

export const getFirstAndLastDayOfMonth = (month) => {
  const [monthStr, yearStr] = month.split("/");
  const monthNumber = parseInt(monthStr, 10) - 1; // Trừ đi 1 vì tháng trong Date bắt đầu từ 0
  const year = parseInt(yearStr, 10);

  // Ngày đầu tiên của tháng
  const firstDay = new Date(year, monthNumber, 1).toISOString();

  // Ngày cuối cùng của tháng
  const lastDay = new Date(year, monthNumber + 1, 0).toISOString(); // Chuyển sang tháng tiếp theo và lùi lại một ngày

  return {
    firstDay,
    lastDay,
  };
};

export const getFirstAndLastDayOfWeek = (date = new Date()) => {
  const currentDate = new Date(date);

  // Tìm ngày đầu tiên của tuần (Thứ Hai)
  const firstDay = new Date(currentDate);
  const dayOfWeek = currentDate.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Nếu là Chủ Nhật (0), lùi về Thứ Hai trước đó
  firstDay.setDate(currentDate.getDate() + diffToMonday);

  // Tìm ngày cuối cùng của tuần (Chủ Nhật)
  const lastDay = new Date(firstDay);
  lastDay.setDate(firstDay.getDate() + 6); // Cộng 6 ngày để ra Chủ Nhật

  return { firstDay: firstDay.toISOString(), lastDay: lastDay.toISOString() };
};
