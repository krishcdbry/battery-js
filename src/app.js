/**
 * Battery JS - Elegant HTML5 Battery Status Monitor
 * A beautiful, classic implementation of the Battery Status API
 */

// DOM Elements
const elements = {
    level: document.getElementById('level'),
    value: document.getElementById('value'),
    charging: document.getElementById('charging'),
    percentage: document.getElementById('percentage'),
    status: document.getElementById('status'),
    timeRemaining: document.getElementById('time-remaining')
};

// State
let chargingAnimationInterval = null;
let animatedPercentage = 0;

/**
 * Format seconds into a human-readable time string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
const formatTime = (seconds) => {
    if (!seconds || seconds === Infinity || isNaN(seconds)) {
        return 'Calculating...';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

/**
 * Update the battery level color based on percentage
 * @param {number} level - Battery level (0-1)
 */
const updateLevelColor = (level) => {
    const batteryLevel = elements.level;

    // Remove existing level classes
    batteryLevel.classList.remove('level-low', 'level-medium');

    if (level < 0.1) {
        batteryLevel.classList.add('level-low');
    } else if (level < 0.3) {
        batteryLevel.classList.add('level-medium');
    }
};

/**
 * Update the displayed battery level
 * @param {object} battery - Battery object from the API
 */
const updateLevel = (battery) => {
    const level = battery.level;
    const percentage = Math.round(level * 100);

    elements.level.style.width = `${percentage}%`;
    elements.value.textContent = percentage;

    updateLevelColor(level);
};

/**
 * Run charging animation
 */
const runChargingAnimation = () => {
    if (animatedPercentage >= 100) {
        animatedPercentage = 0;
    }
    animatedPercentage += 0.5;
    elements.level.style.width = `${animatedPercentage}%`;
};

/**
 * Update charging status and related UI
 * @param {object} battery - Battery object from the API
 */
const updateChargingStatus = (battery) => {
    const isCharging = battery.charging;
    const level = battery.level;
    const percentage = Math.round(level * 100);

    // Update charging indicator visibility
    if (isCharging) {
        elements.charging.classList.add('active');
        elements.status.textContent = 'Charging';

        // Update time to full charge
        if (battery.chargingTime && battery.chargingTime !== Infinity) {
            elements.timeRemaining.textContent = formatTime(battery.chargingTime);
        } else {
            elements.timeRemaining.textContent = level >= 1 ? 'Fully Charged' : 'Calculating...';
        }

        // Start charging animation if not at 100%
        if (level < 1) {
            clearInterval(chargingAnimationInterval);
            animatedPercentage = percentage;
            chargingAnimationInterval = setInterval(runChargingAnimation, 30);
        } else {
            clearInterval(chargingAnimationInterval);
            elements.level.style.width = '100%';
        }

        // Reset color to green when charging
        elements.level.classList.remove('level-low', 'level-medium');
    } else {
        elements.charging.classList.remove('active');
        elements.status.textContent = level >= 0.8 ? 'Good' : level >= 0.3 ? 'Moderate' : 'Low';

        // Update time to discharge
        if (battery.dischargingTime && battery.dischargingTime !== Infinity) {
            elements.timeRemaining.textContent = formatTime(battery.dischargingTime);
        } else {
            elements.timeRemaining.textContent = 'Estimating...';
        }

        // Stop animation and show actual level
        clearInterval(chargingAnimationInterval);
        elements.level.style.width = `${percentage}%`;

        // Update colors based on level
        updateLevelColor(level);
    }

    // Always update the displayed percentage value
    elements.value.textContent = percentage;
};

/**
 * Initialize battery monitoring
 */
const initBattery = async () => {
    // Check if Battery API is supported
    if (!navigator.getBattery) {
        showError('Battery Status API not supported in this browser.');
        return;
    }

    try {
        const battery = await navigator.getBattery();

        // Initial update
        updateLevel(battery);
        updateChargingStatus(battery);

        // Event listeners for battery changes
        battery.addEventListener('levelchange', () => {
            updateLevel(battery);
            updateChargingStatus(battery);
        });

        battery.addEventListener('chargingchange', () => {
            updateChargingStatus(battery);
        });

        battery.addEventListener('chargingtimechange', () => {
            updateChargingStatus(battery);
        });

        battery.addEventListener('dischargingtimechange', () => {
            updateChargingStatus(battery);
        });

    } catch (error) {
        console.error('Battery API Error:', error);
        showError('Unable to access battery information.');
    }
};

/**
 * Display an error message to the user
 * @param {string} message - Error message to display
 */
const showError = (message) => {
    const container = document.querySelector('.battery-container');
    if (container) {
        container.innerHTML = `
            <div class="error-message">
                <h2>Oops!</h2>
                <p>${message}</p>
            </div>
        `;
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBattery);
} else {
    initBattery();
}
