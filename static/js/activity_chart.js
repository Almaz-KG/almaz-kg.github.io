// Add squares

const activities = new Map();

activities.set("2022-10-15", 1);
activities.set("2022-10-16", 5);
activities.set("2022-10-17", 10);
activities.set("2022-10-18", 15);
activities.set("2022-10-19", 20);
activities.set("2022-10-20", 25);
activities.set("2022-10-21", 30);
activities.set("2022-10-22", 35);
activities.set("2022-10-23", 40);
activities.set("2022-10-24", 45);
activities.set("2022-10-25", 50);
activities.set("2022-10-26", 55);
activities.set("2022-10-27", 60);
activities.set("2022-10-28", 65);

const get = (id) => activities.get(id) || 0;

function dateFromDay(year, day){
    var date = new Date(year, 0); // initialize a date in `year-01-01`
    return new Date(date.setDate(day)); // add the number of days
}

const squares = document.querySelector('.squares');
for (var i = 1; i < 365; i++) {
    const activityCount = get(dateFromDay(2022, i).toISOString().slice(0, 10));
    let level = -1;
    if (activityCount < 5 && activityCount != 0 ){
        level = 1;
    } else {
        level = Math.min(Math.floor(activityCount / 5), 12);            
    }

    squares.insertAdjacentHTML('beforeend', `<li data-level="${level}" class="${i}"></li>`);
}