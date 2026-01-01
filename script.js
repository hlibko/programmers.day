function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getProgrammersDay(year) {
    // 256th day of the year
    // In non-leap year: Sept 13
    // In leap year: Sept 12
    // Note: Month is 0-indexed in JS Date (0 = Jan, 8 = Sept)
    const day = isLeapYear(year) ? 12 : 13;
    // Date(year, monthIndex, day, hours, minutes, seconds)
    // 12:00:00 AM start of the day
    return new Date(year, 8, day, 0, 0, 0);
}

function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();

    let targetDate = getProgrammersDay(currentYear);

    // If the holiday has already passed this year, look to next year
    if (now > targetDate) {
        targetDate = getProgrammersDay(currentYear + 1);
    }

    const timeDiff = targetDate - now;

    // Time calculations
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // Update DOM
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    // Update Footer Year
    const yearSpan = document.getElementById('year');
    if (yearSpan && yearSpan.textContent !== String(currentYear)) {
        yearSpan.textContent = currentYear;
    }

    // Update Date Display
    const dateDisplay = document.getElementById('target-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = targetDate.toLocaleDateString('en-US', options);
    }
}

// Initial call
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then((registration) => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch((err) => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
