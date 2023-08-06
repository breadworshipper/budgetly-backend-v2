function oneMonthFromNow() {
    var d = new Date();
    const targetMonth = d.getMonth() + 1;

    d.setMonth(targetMonth);

    if(d.getMonth() !== targetMonth % 12) {
        d.setDate(0); 
    }

    return d;
}

export {oneMonthFromNow};
