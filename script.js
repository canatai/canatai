// script.js
function loadEvents() {
    const { DateTime, Interval } = luxon;
    const eventList = document.getElementById('eventList');
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = DateTime.now().setZone(userTimezone).startOf('day');
    const oneWeekLater = now.plus({ weeks: 1 });
    const groupedEvents = {};

    // Display user's timezone
    const userTimezoneElement = document.getElementById('userTimezone');
    const displayTimezone = userTimezone.split('/').pop();
    userTimezoneElement.textContent = `(${displayTimezone} Time)`;

    // Process events
    const processedEvents = events.map(event => {
        const eventDateTime = DateTime.fromISO(`${event.date}T${event.time}`, { zone: event.timezone });
        const userEventDateTime = eventDateTime.setZone(userTimezone);
        return {
            ...event,
            timestamp: userEventDateTime.toMillis(),
            userDate: userEventDateTime
        };
    });

    // Filter out events before today and sort remaining events from nearest to furthest
    const filteredAndSortedEvents = processedEvents
        .filter(event => event.userDate >= now)
        .sort((a, b) => a.timestamp - b.timestamp);

    // Get events for the next 7 days
    const nextSevenDaysEvents = filteredAndSortedEvents.filter(event => 
        Interval.fromDateTimes(now, oneWeekLater).contains(event.userDate)
    );

    // If less than 5 events in the next 7 days, add more future events
    let eventsToDisplay = nextSevenDaysEvents;
    if (nextSevenDaysEvents.length < 5) {
        const additionalEvents = filteredAndSortedEvents
            .filter(event => !nextSevenDaysEvents.includes(event))
            .slice(0, 5 - nextSevenDaysEvents.length);
        eventsToDisplay = [...nextSevenDaysEvents, ...additionalEvents];
    }

    // Group events by date
    eventsToDisplay.forEach(event => {
        const dateKey = event.userDate.toISODate();
        if (!groupedEvents[dateKey]) {
            groupedEvents[dateKey] = [];
        }
        groupedEvents[dateKey].push(event);
    });

    // Generate HTML for grouped events
    let html = '';
    Object.keys(groupedEvents).sort().forEach(date => {
        const eventDate = DateTime.fromISO(date).setLocale('zh-TW');
        const formattedDate = eventDate.toFormat("M月d日 cccc");
        html += `<h6>${formattedDate}</h6><ul>`;
        groupedEvents[date].forEach(event => {
            const formattedTime = event.userDate.setLocale('zh-TW').toFormat('HH:mm');
            html += `
                <li>
                    <strong>${formattedTime}</strong>
                    <a href="${event.url}" target="_blank">${event.name} (LINK)</a>
                    <small>${event.location}</small>
                </li>
            `;
        });
        html += '</ul>';
    });

    eventList.innerHTML = html || '<p class="text-muted">未來七天內沒有活動。</p>';
}

function getTimezoneOffset(timezone) {
    const date = new Date();
    const options = { timeZone: timezone, timeZoneName: 'short' };
    const timeString = date.toLocaleString('en-US', options);
    const timeZoneName = timeString.split(' ').pop();
    const offset = timeZoneName.replace(/[^-+\d]/g, '');
    return offset ? (offset.length === 4 ? `${offset.slice(0, 3)}:${offset.slice(3)}` : `${offset.slice(0, 3)}:00`) : '+00:00';
}

function setupMobileEventToggle() {
    const eventSection = document.getElementById('eventSection');
    const eventList = document.getElementById('eventList');
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleEvents';
    toggleButton.textContent = 'Upcoming Events';
    
    eventSection.insertBefore(toggleButton, eventList);

    toggleButton.addEventListener('click', function() {
        eventList.classList.toggle('expanded');
        this.classList.toggle('active');
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Clock functionality
    function updateTime() {
        const options = { weekday: 'short', month: 'numeric', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
        const locations = ['taiwan', 'vancouver', 'alberta', 'toronto'];
        const timeZones = {
            'taiwan': 'Asia/Taipei',
            'vancouver': 'America/Vancouver',
            'alberta': 'America/Edmonton',
            'toronto': 'America/Toronto'
        };

        locations.forEach(location => {
            const time = new Date().toLocaleTimeString("en-US", { timeZone: timeZones[location], ...timeOptions });
            const date = new Date().toLocaleDateString("zh-TW", { timeZone: timeZones[location], ...options });

            document.getElementById(`${location}Time`).textContent = time;
            document.getElementById(`${location}Date`).textContent = date;
        });
    }

    updateTime();
    setInterval(updateTime, 1000); // Update every second

    // Tab functionality
    const categoryTabs = document.querySelectorAll('#categoryTabs .nav-link');
    const tabContent = document.querySelectorAll('.tab-pane');

    function switchTab(tab) {
        // Remove 'show' and 'active' classes from all tabs and panes
        categoryTabs.forEach(t => t.classList.remove('active'));
        tabContent.forEach(c => {
            c.classList.remove('show', 'active');
        });

        // Add 'active' class to current tab
        tab.classList.add('active');

        // Add 'show' and 'active' classes to corresponding content
        const contentId = tab.getAttribute('href').substring(1);
        document.getElementById(contentId).classList.add('show', 'active');

        // Update ads based on the selected category
        updateAds(contentId);
    }

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            switchTab(this);
            if (window.innerWidth <= 767) {
                e.preventDefault(); // Prevent default action
                setTimeout(() => {
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offset = targetElement.offsetTop - 60; // Adjust offset as needed
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                    }
                }, 150); // Small delay to ensure content is loaded
            }
        });
    });

    // Prevent content from disappearing when mouse leaves tabs
    categoryTabs.forEach(tab => {
        tab.removeEventListener('mouseenter', switchTab);
    });

    // Load events
    loadEvents();

    // Initialize ads with the default active tab
    const defaultCategory = document.querySelector('#categoryTabs .nav-link.active').getAttribute('href').substring(1);
    updateAds(defaultCategory);

    if (window.innerWidth <= 767) {
        setupMobileEventToggle();
    }

    const backToTopButton = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

});

window.addEventListener('resize', function() {
    const eventSection = document.getElementById('eventSection');
    const toggleButton = document.getElementById('toggleEvents');
    const eventList = document.getElementById('eventList');

    if (window.innerWidth <= 767) {
        if (!toggleButton) {
            setupMobileEventToggle();
        }
    } else {
        if (toggleButton) {
            toggleButton.remove();
            eventList.classList.remove('expanded');
        }
    }
});