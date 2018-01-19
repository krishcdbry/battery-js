/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

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

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ })
/******/ ]);
//# sourceMappingURL=app.js.map