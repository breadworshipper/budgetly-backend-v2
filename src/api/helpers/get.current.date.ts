function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    const dateWithoutTime = new Date(year, month, day);

    return dateWithoutTime
}

export { getCurrentDate }