class DateHandler {
    formatDate = (date, format) => {
        date = new Date(date) || "";
        return new Intl.DateTimeFormat(`en-${format.toUpperCase()}`).format(date)
            .split('/').map(x => x.length < 2 ? '0' + x : x).join('/') || "";
    }

    getCurrentDate = (format = 'us', seperator = '/') => {
        let date = new Date();
        let sep = seperator;
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        format = format.toLowerCase()
        return format === 'us' ? `${month}${sep}${day}${sep}${year}` :
            format === 'gb' ? `${day}${sep}${month}${sep}${year}` : 'Invalid Date'
    }

    getCurrentDateTwo = (loc = "en-US", opts = { year: 'numeric', month: 'long', day: 'numeric' }) => {
        let _now = new Date();
        return _now.toLocaleDateString(loc, opts)
    }

    customDate = (date, format = 'dmy', separator = '/') => {
        date = new Date(date)
        let s = separator
        format = format.toLowerCase()
        let year = date.getFullYear();
        let month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
        let day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        return format === "dmy" ? `${day}${s}${month}${s}${year}` : format === "mdy" ?
            `${month}${s}${day}${s}${year}` : format === "ymd" ?
                `${year}${s}${month}${s}${day}` : 'Invalid Date'
    }

    addDays = (date, NumWorkDays) => {
        date = new Date(date);
        date.setDate(date.getDate() + NumWorkDays);
        return date;
    }

    calendarFormat = (date, sep) => {
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        date = new Date(date);
        let year = date.getFullYear();
        let month = (1 + date.getMonth());
        let day = date.getDate().toString();
        return `${day}${sep}${months[month - 1]}${sep}${year}`
    }

}