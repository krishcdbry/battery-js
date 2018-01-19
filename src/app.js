const batteryLevel = document.getElementById('level');  
const batteryChargingStatus = document.getElementById('charging'); 
const batteryChargingValue = document.getElementById('value'); 
let batteryLevelPercentage = 0;  
let charingInterval = null;

navigator.getBattery().then((battery) => {
   
   charging = () => {
        if (batteryLevelPercentage > 99.9) {
            batteryLevelPercentage = 0;
        }
        batteryLevelPercentage += 0.1;
        batteryLevel.style.width = `${batteryLevelPercentage}%`;
    }
    
    updateLevel = () => {
        const level = battery.level*100;
        batteryLevel.style.width = `${level}%`;
        batteryChargingValue.innerHTML = `${level}%`;
    }

    setLevelColor = (background, shadow) => {
        batteryLevel.style.background = background;
        batteryLevel.style.boxShadow = shadow;
    }

    updateCharge = () => {
        const level = battery.level;
        if (battery.charging) {
            batteryChargingStatus.style.display = "block";
            batteryChargingValue.style.display = "none";
            if (level < 1) {
                clearInterval(charingInterval);
                setLevelColor("linear-gradient(#0c0 0%, #00aa00 50%, #0c0 100%)", "0 0 10px #0c0");
                charingInterval = setInterval(() => {
                    charging();
                }, 10);
            }
        }
        else {
            batteryChargingStatus.style.display = "none";
            batteryChargingValue.style.display = "block";
            batteryChargingValue.innerHTML = `${level*100}%`;
            if (level < 0.1) {
                setLevelColor("linear-gradient(red 0%, red 50%, red 100%)", "0 0 10px red");
            }
            else if (level < 0.3) {
                setLevelColor("linear-gradient(orange 0%, orange 50%, orange 100%)", "0 0 10px orange");
            }
            else {
                setLevelColor("linear-gradient(#0c0 0%, #00aa00 50%, #0c0 100%)", "0 0 10px #0c0");
            }
            updateLevel();
            clearInterval(charingInterval);
        }
    }

    battery.addEventListener('levelchange', () => {
        updateLevel();
        
    });

    battery.addEventListener('chargingchange', () => {
        console.log(battery);
        updateCharge();
    });

    updateCharge();
    updateLevel();
});