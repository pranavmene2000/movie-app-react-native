export const shortTitle = (title) => {
    return (
        title.length < 30 ? title : title.substring(0, 20) + '...'
    )
}

export const shortName = (title) => {
    return (
        title.length < 30 ? title : title.substring(0, 20) + '...'
    )
}

export const shortOverView = (title) => {
    return (
        title.length < 150 ? title : title.substring(0, 150) + '...'
    )
}

export const timeConvert = (n) => {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return rhours + " hr " + rminutes + " mins "
}

export const truncateContent = (text, max) => {
    return text && text.length > max ? text.slice(0, max).split(' ').slice(0, -1).join(' ') + '.' : text
}

export const getParsedDate = (strDate) => {
    var strSplitDate = String(strDate).split(' ');
    var date = new Date(strSplitDate[0]);
    // alert(date);
    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    date = dd + "-" + mm + "-" + yyyy;
    return date.toString();
}


export const getAge = (birth_date) => {
    const current_year = new Date().getFullYear();
    const birth_year = birth_date?.split("-")[0];

    if (birth_date !== "") {
        return current_year - birth_year;
    } else {
        return "-"
    }
}