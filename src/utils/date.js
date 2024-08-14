export function convertDateToDay(dateString) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    let currentDate = new Date(dateString);

    // Lấy ngày và tháng
    let day = currentDate.getDate();

    // Trả về chuỗi ngày và tháng
    return `${day}`;
}

export function convertDateToDayMonth(dateString) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    let currentDate = new Date(dateString);

    // Lấy ngày và tháng
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // getMonth() trả về tháng từ 0-11

    // Đảm bảo định dạng ngày và tháng là hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;

    // Trả về chuỗi ngày và tháng
    return `${day}/${month}`;
}

export function convertDateToDayMonthYear(date) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    // Lấy ngày và tháng
    let day = date.day
    let month = date.month
    let year = date.year

    // Đảm bảo định dạng ngày và tháng là hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;

    // Trả về chuỗi ngày và tháng
    return `${day}/${month}/${year}`;
}

export function convertDateToDayMonthYearVietNam(date) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    // Lấy ngày và tháng
    let day = date.day
    let month = date.month
    let year = date.year
    let time = date.time

    // Đảm bảo định dạng ngày và tháng là hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;

    // Trả về chuỗi ngày và tháng
    return `${day} tháng ${month}, ${year} (${time} ${Number(time.split(':')[0]) <= 10 ? 'Sáng' : Number(time.split(':')[0]) <= 14 ? 'Trưa' : Number(time.split(':')[0]) <= 17 ? 'Chiều' : 'Tối'})`;
}

export function convertDateToDayMonthYearVietNam2(date) {
    // Tạo một đối tượng Date từ chuỗi ngày hiện tại
    // Lấy ngày và tháng
    let day = date.day
    let month = date.month
    let year = date.year
    let time = date.time

    // Đảm bảo định dạng ngày và tháng là hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;

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
    let minute = currentDate.getMinutes()
    let hour = currentDate.getHours()

    // Đảm bảo định dạng ngày và tháng là hai chữ số
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;
    minute = minute < 10 ? '0' + minute : minute;
    hour = hour < 10 ? '0' + hour : hour;

    // Trả về chuỗi ngày và tháng
    return `${hour}:${minute} - ${day}/${month}/${year}`;
}

export function formatVietnameseDate(date1) {
    // Tạo đối tượng Date từ chuỗi ngày
    const date = new Date(date1.year, date1.month - 1, date1.day)

    // Mảng các ngày trong tuần và các tháng bằng tiếng Việt
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['tháng 01', 'tháng 02', 'tháng 03', 'tháng 04', 'tháng 05', 'tháng 06', 'tháng 07', 'tháng 08', 'tháng 09', 'tháng 10', 'tháng 11', 'tháng 12'];

    // Lấy các thành phần của ngày
    let dayOfWeek = daysOfWeek[date.getDay()];
    let day = date.getDate();
    let month = months[date.getMonth()];
    let year = date.getFullYear();

    // Tạo chuỗi ngày theo định dạng mong muốn
    return `${dayOfWeek}, ngày ${day < 10 ? '0' + day : day} ${month} năm ${year}`;
}

export function generateTimes(startTime, endTime, interval) {
    let times = [];
    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    while (start <= end) {
        let hours = start.getHours();
        let minutes = start.getMinutes();
        let timeString = `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
        times.push(timeString);
        start.setMinutes(start.getMinutes() + interval);
    }

    return times;
}
export const compareDateIsHaveInSchedule = (day, schedules) => {
    if (schedules?.length) {
        for (let i = 0; i < schedules.length; i++) {
            const schedule = schedules[i]
            if (schedule.date.month === day.month && schedule.date.year === day.year && schedule.date.day === day.day) {
                return schedule.times.length
            }
        }
    }
    return 0
}

export const compare2Date = (date1, date2) => {
    if (date1.month === date2.month && date1.year === date2.year && date1.day === date2.day) {
        return true
    }
    return false
}

export const compareDate1GetterThanDate2 = (date1, date2) => {
    if (date1.month >= date2.month && date1.year >= date2.year && date1.day >= date2.day) {
        return true
    }
    return false
}

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


export const convertObjectToDate = (date1) => {
    return new Date(date1.year, date1.month - 1, date1.day)
}


export function compareDates(date1, date2) {

    // Lấy các thành phần năm, tháng, ngày của mỗi đối tượng Date
    const year1 = date1.year;
    const month1 = date1.month;
    const day1 = date1.day;

    const year2 = date2.year;
    const month2 = date2.month;
    const day2 = date2.day;

    // So sánh từng thành phần
    if (year1 < year2) return -1;
    if (year1 > year2) return 1;

    if (month1 < month2) return -1;
    if (month1 > month2) return 1;

    if (day1 < day2) return -1;
    if (day1 > day2) return 1;

    // 0 nếu hai ngày bằng nhau.
    // -1 nếu date1 nhỏ hơn date2.
    // 1 nếu date1 lớn hơn date2.

    return 0; // Các thành phần đều bằng nhau
}


export const sortTimes = (times) => {
    return times.sort(function (a, b) {
        // Chuyển đổi thời gian sang định dạng số phút để so sánh
        const timeA = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
        const timeB = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);

        return timeA - timeB;
    });
}

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
}

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


export function isWithinTenMinutes(A, B) {
    // Chuyển thời gian từ định dạng chuỗi thành mảng số
    const timeA = A.split(":").map(Number);
    const timeB = B.split(":").map(Number);

    // Tạo đối tượng Date cho cả hai thời gian
    const dateA = new Date(0, 0, 0, timeA[0], timeA[1]);
    const dateB = new Date(0, 0, 0, timeB[0], timeB[1]);

    // Tính toán khoảng thời gian giữa A và B tính bằng phút
    const diffInMinutes = (dateB - dateA) / (1000 * 60);

    // Kiểm tra các điều kiện:
    // 1. B nằm trong khoảng 10 phút trước A (0 <= diffInMinutes <= 10)
    // 2. B nằm trong khoảng tối đa 60 phút sau A (0 <= diffInMinutes <= 60)
    return (diffInMinutes >= 0 && diffInMinutes <= 10) || (diffInMinutes >= 0 && diffInMinutes <= 60);
}