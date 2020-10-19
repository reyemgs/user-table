/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/Table.js":
/*!*************************!*\
  !*** ./src/js/Table.js ***!
  \*************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ Table\n/* harmony export */ });\n/* harmony import */ var _UserList_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserList.js */ \"./src/js/UserList.js\");\n\n\nclass Table {\n    constructor() {\n        this.thead = document.getElementById('head-table');\n        this.tbody = document.getElementById('user-table');\n\n        this.addButton = document.getElementById('add-user');\n        this.deleteButton = document.getElementById('delete-user');\n        this.deleteInput = document.getElementById('delete-input');\n\n        this.select = document.getElementById('selection');\n        this.pageButtons = document.getElementById('page-buttons');\n\n        this.searchIdInput = document.getElementById('search-id');\n        this.searchNameInput = document.getElementById('search-name');\n        this.searchDateInput = document.getElementById('search-date');\n\n        this.pageState = {\n            rowPerPage: 5,\n            currentPage: 1,\n            totalPages: 1,\n        };\n        this.sortState = {\n            ascId: true,\n            ascName: true,\n            ascDate: true,\n        };\n\n        this.list = new _UserList_js__WEBPACK_IMPORTED_MODULE_0__.default();\n        this.init();\n    }\n\n    init() {\n        (async () => {\n            await this.request();\n            await this.renderPage();\n            await this.generateButtons();\n            await this.events();\n        })();\n    }\n\n    async request() {\n        const data = await this.list.loadAllUsers();\n        this.list.userList = data;\n    }\n\n    events() {\n        this.addButton.addEventListener('click', () => this.createRow());\n        this.deleteButton.addEventListener('click', () => this.removeRow());\n\n        this.thead.addEventListener('click', e => this.sortID(e));\n        this.thead.addEventListener('click', e => this.sortName(e));\n        this.thead.addEventListener('click', e => this.sortDate(e));\n\n        this.searchIdInput.addEventListener('keyup', () => this.searchID());\n        this.searchNameInput.addEventListener('keyup', () => this.searchName());\n        this.searchDateInput.addEventListener('keyup', () => this.searchDate());\n\n        this.pageButtons.addEventListener('click', e => this.onPage(e));\n        this.select.addEventListener('change', e => this.selectRowPerPage(e));\n    }\n\n    // * SET/REMOVE\n    findMaxID(userList) {\n        return Math.max.apply(\n            Math,\n            userList.map(user => {\n                return user.id + 1;\n            })\n        );\n    }\n\n    promptName() {\n        let name = prompt('Enter Name');\n        if (name == '' || name == null) return;\n        return name;\n    }\n\n    promptDate() {\n        let date = prompt('Enter Birthday');\n        if (date == '' || date == null) return;\n        return date;\n    }\n\n    createRow() {\n        let id;\n        if (this.list.userList == 0) id = 1;\n        else {\n            id = this.findMaxID(this.list.userList);\n        }\n        let name = this.promptName();\n        let date = this.promptDate();\n        if (name == undefined || date == undefined) return;\n        this.list.setUser(id, name, date);\n        this.renderPage();\n    }\n\n    removeRow() {\n        let index = this.list.userList\n            .map(item => item.id)\n            .indexOf(+this.deleteInput.value);\n        if (index == -1) {\n            alert('Invalid ID');\n        } else {\n            alert(\n                `User ${this.list.userList[index].name} with ID ${this.list.userList[index].id} deleted`\n            );\n            this.tbody.innerHTML = '';\n            this.list.userList.splice(index, 1);\n            this.renderPage();\n        }\n    }\n\n    // * RENDER\n    render(userList) {\n        let templateList = userList.map(item => {\n            return this.renderRow(item);\n        });\n        this.tbody.insertAdjacentHTML(\n            'afterbegin',\n            templateList.join().replace(/\\,/g, '')\n        );\n        this.generateButtons();\n        this.initEdit();\n    }\n\n    renderPage() {\n        let start =\n            (this.pageState.currentPage - 1) * this.pageState.rowPerPage;\n        let end = start + this.pageState.rowPerPage;\n        let sliceList = this.list.userList.slice(start, end);\n        this.tbody.innerHTML = '';\n        this.render(sliceList);\n    }\n\n    renderRow(item) {\n        return `<tr>\n                    <td class=\"id\">${item.id}</td>\n                    <td class=\"name\">${item.name}</td>\n                    <td class=\"date\">${item.date}</td>\n                </tr>`;\n    }\n\n    // * PAGINATION\n    calculateTotalPages() {\n        return Math.ceil(this.list.userList.length / this.pageState.rowPerPage);\n    }\n\n    setLastPage(pages) {\n        this.pageState.currentPage = pages;\n        this.pageState.totalPages = pages;\n    }\n\n    activeButton(button) {\n        if (+button.innerHTML == this.pageState.currentPage) {\n            button.classList = 'page-button active';\n            button.style.background = '#009879';\n            button.style.color = '#ffffff';\n        }\n    }\n\n    createButton(numberOfPage) {\n        let button = document.createElement('button');\n        button.className = 'page-button';\n        button.innerHTML = numberOfPage;\n        this.activeButton(button);\n        this.pageButtons.append(button);\n    }\n\n    isLastPage(pages) {\n        return (\n            this.pageState.currentPage >= pages &&\n            this.pageState.totalPages > pages\n        );\n    }\n\n    generateButtons() {\n        this.pageButtons.innerHTML = '';\n        let pages = this.calculateTotalPages();\n\n        for (let i = 1; i <= pages; i++) {\n            this.createButton(i);\n        }\n\n        if (this.isLastPage(pages)) {\n            this.setLastPage(pages);\n            this.renderPage();\n        } else {\n            this.pageState.totalPages = pages;\n        }\n    }\n\n    onPage(e) {\n        if (e.target.nodeName != 'BUTTON') return;\n        this.pageState.currentPage = +e.target.innerHTML;\n        this.renderPage();\n    }\n\n    selectRowPerPage(e) {\n        if (e.target.nodeName == 'SELECT') {\n            this.pageState.rowPerPage = +e.target.value;\n        }\n        this.renderPage();\n    }\n\n    // * SORTING\n    checkAscDesc(e, className, asc, sortDesc, sortAsc) {\n        if (e.target.className == className) {\n            if (asc) {\n                this.list.userList.sort(sortDesc);\n                asc = false;\n            } else {\n                this.list.userList.sort(sortAsc);\n                asc = true;\n            }\n            this.renderPage();\n            return asc;\n        }\n    }\n\n    sortAscId(a, b) {\n        return b.id - a.id;\n    }\n\n    sortDescId(a, b) {\n        return a.id - b.id;\n    }\n\n    sortAscName(a, b) {\n        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;\n    }\n\n    sortDescName(a, b) {\n        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;\n    }\n\n    parseDate(cell) {\n        let date = cell.split('.');\n\n        if (date[0].startsWith('0')) {\n            date[0] = date[0].slice(1);\n        }\n        if (date[1].startsWith('0')) {\n            date[1] = date[1].slice(1);\n        }\n        date[1] -= 1;\n        [date[0], date[2]] = [date[2], date[0]];\n        return date;\n    }\n\n    sortAscDate(a, b) {\n        let firstDate = new Date(this.parseDate(a.date));\n        let secondDate = new Date(this.parseDate(b.date));\n        return secondDate - firstDate;\n    }\n\n    sortDescDate(a, b) {\n        let firstDate = new Date(this.parseDate(a.date));\n        let secondDate = new Date(this.parseDate(b.date));\n        return firstDate - secondDate;\n    }\n\n    sortID(e) {\n        this.sortState.ascId = this.checkAscDesc(\n            e,\n            'sort-id',\n            this.sortState.ascId,\n            this.sortAscId,\n            this.sortDescId\n        );\n    }\n\n    sortName(e) {\n        this.sortState.ascName = this.checkAscDesc(\n            e,\n            'sort-name',\n            this.sortState.ascName,\n            this.sortAscName,\n            this.sortDescName\n        );\n    }\n\n    sortDate(e) {\n        this.sortState.ascDate = this.checkAscDesc(\n            e,\n            'sort-date',\n            this.sortState.ascDate,\n            this.sortAscDate.bind(this),\n            this.sortDescDate.bind(this)\n        );\n    }\n\n    // * SEARCHING\n    isUndefinedID() {\n        return this.list.getUserByID(+this.searchIdInput.value) == undefined;\n    }\n\n    searchID() {\n        this.tbody.innerHTML = '';\n        if (this.searchIdInput.value == '') return this.renderPage();\n        else if (this.isUndefinedID()) return;\n        let user = this.renderRow(\n            this.list.getUserByID(+this.searchIdInput.value)\n        );\n        this.tbody.insertAdjacentHTML('afterbegin', user);\n        this.initEdit();\n    }\n\n    searchName() {\n        this.tbody.innerHTML = '';\n        let users = this.list.getUserByName(this.searchNameInput.value);\n        if (this.searchNameInput.value == '') return this.renderPage();\n        this.render(users);\n    }\n\n    searchDate() {\n        this.tbody.innerHTML = '';\n        let users = this.list.getUserByDate(this.searchDateInput.value);\n        if (this.searchDateInput.value == '') return this.renderPage();\n        this.render(users);\n    }\n\n    // * EDIT\n    initEdit() {\n        this.tds = this.tbody.querySelectorAll('td');\n        this.tds.forEach(td => {\n            td.addEventListener('click', () => {\n                if (!this.inEditing(td)) {\n                    this.startEditing(td);\n                }\n            });\n        });\n    }\n\n    startEditing(td) {\n        if (td.classList.contains('name') || td.classList.contains('date')) {\n            td.setAttribute('contenteditable', true);\n        } else return;\n\n        const activeTd = this.findEditing();\n\n        if (activeTd) {\n            this.cancelEditing(activeTd);\n        }\n\n        td.classList.add(`${td.className}`, 'in-editing');\n        td.setAttribute('data-old-value', td.innerHTML);\n        this.createEditToolbar(td);\n    }\n\n    cancelEditing(td) {\n        td.innerHTML = td.getAttribute('data-old-value');\n        td.classList.remove('in-editing');\n        td.removeAttribute('contenteditable');\n    }\n\n    finishEditing(td) {\n        const tr = td.parentNode;\n        let user = this.list.getUserByID(tr.cells[0].innerHTML);\n\n        td.classList.remove('in-editing');\n        td.removeAttribute('contenteditable');\n\n        this.removeEditToolbar(td);\n\n        if (td.classList.contains('name')) {\n            user.name = td.textContent.trim();\n        } else if (td.classList.contains('date')) {\n            user.date = td.textContent.trim();\n        }\n    }\n\n    inEditing(td) {\n        return td.classList.contains('in-editing');\n    }\n\n    findEditing() {\n        return Array.prototype.find.call(this.tds, td => this.inEditing(td));\n    }\n\n    createEditToolbar(td) {\n        const toolbar = document.createElement('div');\n        toolbar.setAttribute('contenteditable', false);\n        toolbar.innerHTML = `\n            <div class=\"edit-toolbar-wrapper\">\n                <button class=\"btn-save\">Save</button>\n                <button class=\"btn-cancel\">Cancel</button>\n            </div>\n        `;\n        toolbar.className = 'edit-toolbar';\n        td.append(toolbar);\n\n        const buttonSave = document.querySelector('.btn-save');\n        const buttonCancel = document.querySelector('.btn-cancel');\n\n        buttonSave.addEventListener('click', e => {\n            e.stopPropagation();\n            this.finishEditing(td);\n        });\n\n        buttonCancel.addEventListener('click', e => {\n            e.stopPropagation();\n            this.cancelEditing(td);\n        });\n    }\n\n    removeEditToolbar(td) {\n        const toolbar = td.querySelector('.edit-toolbar');\n        toolbar.remove();\n    }\n}\n\n\n//# sourceURL=webpack://user-table/./src/js/Table.js?");

/***/ }),

/***/ "./src/js/UserList.js":
/*!****************************!*\
  !*** ./src/js/UserList.js ***!
  \****************************/
/*! namespace exports */
/*! export default [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => /* binding */ UserList\n/* harmony export */ });\nclass UserList {\n    constructor() {\n        this.userList = [];\n    }\n\n    setUser(id, name, date) {\n        const user = { id: id, name: name, date: date };\n        this.userList.push(user);\n    }\n\n    getUserByID(id) {\n        return this.userList.find(user => user.id == id);\n    }\n\n    getUserByName(name) {\n        return this.userList.filter(item =>\n            item.name.toLowerCase().startsWith(name.toLowerCase())\n        );\n    }\n\n    getUserByDate(date) {\n        return this.userList.filter(item => item.date.includes(date));\n    }\n\n    async loadAllUsers() {\n        let response = await fetch('../json/users.json');\n        if (response.ok) {\n            let data = await response.json();\n            const users = data.users;\n            return users;\n        } else {\n            console.error(response.status);\n        }\n    }\n}\n\n\n//# sourceURL=webpack://user-table/./src/js/UserList.js?");

/***/ }),

/***/ "./src/js/app.js":
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Table_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Table.js */ \"./src/js/Table.js\");\n\n\nconst userTable = new _Table_js__WEBPACK_IMPORTED_MODULE_0__.default();\n\n\n//# sourceURL=webpack://user-table/./src/js/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/js/app.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;