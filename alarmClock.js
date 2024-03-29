let alarms = [];
const alarmList = document.getElementById('list');
const hour = document.getElementById('hour');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const meridiem = document.getElementById('meridiem');
var currentTime;

// function to set the current time to clock

function displayTime() {
    var currentDate = new Date();
    var hr = currentDate.getHours();
    var min = currentDate.getMinutes();
    var sec = currentDate.getSeconds();
    var amOrPm = "AM";

    if (hr >= 12) {
        amOrPm = "PM";
    }

    if (hr > 12) {
        hr -= 12;
    }


    hr < 10 ? hr = "0" + hr : hr;
    min < 10 ? min = "0" + min : min;
    sec < 10 ? sec = "0" + sec : sec;

    hour.innerHTML = hr;
    minutes.innerHTML = min;
    seconds.innerHTML = sec;
    meridiem.innerHTML = amOrPm;
    currentTime = `${hr}` + ":" + `${min}` + ":" + `${sec}` + " " + `${amOrPm}`;
    ringAlarm();
}

// function to add the alarm on the srceen

function addAlarmToDOM(alarm) {
    const li = document.createElement('li');
    li.innerHTML = `
    <span class = "alarmTime" id = "${alarm.id}">${alarm.hours}:${alarm.minutes}:${alarm.seconds} ${alarm.ampm}</span>
    <img src="data:image/png;base64,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" class ="delete" data-id="${alarm.id}" />
    `;
    alarmList.append(li);
}

// function to display the alarm list 

function renderList() {
    alarmList.innerHTML = '';
    for (let i = 0; i < alarms.length; i++) {
        addAlarmToDOM(alarms[i]);
    }
}

// function to add alarm to alarm list

function addAlarm(alarm) {
    alarms.push(alarm);
    renderList();
}

// function to delete the alarm

function deleteAlarm(alarmId) {
    const newAlarms = alarms.filter(function (alarm) {
        return alarm.id != alarmId;
    });
    alarms = newAlarms;
    renderList();
}

// function to handle clicks on buttons

function handleClickListener(event) {
    const target = event.target;
    if (target.className == 'setAlarm') {
        const alarm = {
            hours: document.getElementById('getHours').value,
            minutes: document.getElementById('getMinutes').value,
            seconds: document.getElementById('getSeconds').value,
            ampm: document.getElementById('getAMPM').value,
            id: Date.now().toString()
        }
        addAlarm(alarm);
        return;
    }
    if (target.className == 'delete') {
        const alarmId = target.dataset.id;
        deleteAlarm(alarmId);
        return;
    }
}

// function to ring the alarm

function ringAlarm() {
    alarms.forEach(function (alarm) {
        let time = `${alarm.hours}` + ":" + `${alarm.minutes}` + ":" + `${alarm.seconds}` + " " + `${alarm.ampm}`;
        if (time == currentTime) {
            // alert("Ting Ting! Ting Ting!");
            play();
            deleteAlarm(alarm.id);
        }
    });
}

// function to create seconds dropdown list

function initialiseSecondsDropdown() {
    const seconds = document.getElementById('getSeconds');
    for (let i = 1; i < 60; i++) {
        const option = document.createElement('option');
        if (i < 10) {
            option.innerHTML = "0" + i;
        }
        else {
            option.innerHTML = i;
        }
        seconds.append(option);
    }
}

// function to create minutes dropdown list

function initialiseMinutesDropdown() {
    const minutes = document.getElementById('getMinutes');
    for (let i = 1; i < 60; i++) {
        const option = document.createElement('option');
        if (i < 10) {
            option.innerHTML = "0" + i;
        }
        else {
            option.innerHTML = i;
        }
        minutes.append(option);
    }
}

// function to create hours dropdown list

function initialiseHoursDropdown() {
    const hours = document.getElementById('getHours');
    for (let i = 2; i <= 12; i++) {
        const option = document.createElement('option');
        if (i < 10) {
            option.innerHTML = "0" + i;
        }
        else {
            option.innerHTML = i;
        }
        hours.append(option);
    }
}

// function to start all necessary function of the app

function initialiseApp() {
    document.addEventListener('click', handleClickListener);
    setInterval(displayTime, 1000);
    initialiseSecondsDropdown();
    initialiseMinutesDropdown();
    initialiseHoursDropdown();
    ringAlarm();
}

function play() {
    var audio = new Audio('https://www.freespecialeffects.co.uk/soundfx/sirens/fanfare3.wav');
    audio.play();
}

// let roarBtn = document.getElementById("roar");
// roarBtn.addEventListener('click', () => {
//     play();
// })

initialiseApp();
