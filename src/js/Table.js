// import UserList from './UserList.js';
class Table {
    constructor() {
        this.thead = document.getElementById('head-table');
        this.tbody = document.getElementById('user-table');

        this.addButton = document.getElementById('add-user');
        this.deleteButton = document.getElementById('delete-user');
        this.deleteInput = document.getElementById('delete-input');

        this.select = document.getElementById('selection');
        this.pageButtons = document.getElementById('page-buttons');

        this.searchIdInput = document.getElementById('search-id');
        this.searchNameInput = document.getElementById('search-name');
        this.searchDateInput = document.getElementById('search-date');

        this.sideBar = document.getElementById('sidebar');
        this.sideBarButton = document.getElementById('toggle-button');
        this.selectButtonsPerPage = document.getElementById('select-buttons');
        this.sidebarInfo = document.getElementById('sidebar-info');

        this.downloadUserList = document.getElementById('download-list');

        this.pageState = {
            buttonPerPage: 5,
            rowPerPage: 5,
            currentPage: 1,
            totalPages: 1,
        };
        this.sortState = {
            ascId: true,
            ascName: true,
            ascDate: true,
        };
        this.listState = {
            currentList: '../json/users.json',
        };
        this.list = new UserList();
        this.init();
    }

    init() {
        (async () => {
            await this.request();
            await this.renderPage();
            await this.generateButtons();
            await this.events();
        })();
    }

    async request(url = this.listState.currentList) {
        const data = await this.list.loadAllUsers(url);
        this.list.userList = data;
    }

    events() {
        this.addButton.addEventListener('click', () => this.createRow());
        this.deleteButton.addEventListener('click', () => this.removeRow());

        this.thead.addEventListener('click', e => this.sortID(e));
        this.thead.addEventListener('click', e => this.sortName(e));
        this.thead.addEventListener('click', e => this.sortDate(e));

        this.searchIdInput.addEventListener('keyup', () => this.searchID());
        this.searchNameInput.addEventListener('keyup', () => this.searchName());
        this.searchDateInput.addEventListener('keyup', () => this.searchDate());

        this.pageButtons.addEventListener('click', e => this.onPage(e));
        this.select.addEventListener('change', e => this.changeRowPerPage(e));

        this.sideBarButton.addEventListener('click', () =>
            this.toggleSideBar()
        );
        this.selectButtonsPerPage.addEventListener('change', e =>
            this.changeButtonPerPage(e)
        );

        this.lis = this.downloadUserList.querySelectorAll('li');
        this.lis.forEach(li => {
            if (li.getAttribute('data-json') == this.listState.currentList)
                this.activeList(li);
            li.addEventListener('click', () => {
                const answer = confirm('Are you sure?');
                if (!answer) return;
                this.listState.currentList = li.getAttribute('data-json');
                this.lis.forEach(li => this.removeActiveList(li));
                this.activeList(li);
                (async () => {
                    await this.request(li.getAttribute('data-json'));
                    await this.renderPage();
                    await this.generateButtons();
                })();
            });
        });
    }

    // * DOWNLOAD LIST
    activeList(li) {
        if (li.getAttribute('data-json') == this.listState.currentList) {
            li.classList = 'active-list';
        }
        return;
    }

    confirmList() {}

    removeActiveList(li) {
        if (li.getAttribute('data-json') != this.listState.currentList) {
            li.classList.remove('active-list');
        }
        return;
    }

    // * SET/REMOVE
    findMaxID(userList) {
        return Math.max.apply(
            Math,
            userList.map(user => {
                return user.id + 1;
            })
        );
    }

    promptName() {
        let name = prompt('Enter Name');
        if (name == '' || name == null) return;
        return name;
    }

    promptDate() {
        let date = prompt('Enter Birthday');
        if (date == '' || date == null) return;
        return date;
    }

    createRow() {
        let id;
        if (this.list.userList == 0) id = 1;
        else {
            id = this.findMaxID(this.list.userList);
        }
        let name = this.promptName();
        let date = this.promptDate();
        if (name == undefined || date == undefined) return;
        this.list.setUser(id, name, date);
        this.renderPage();
    }

    removeRow() {
        let index = this.list.userList
            .map(item => item.id)
            .indexOf(+this.deleteInput.value);
        if (index == -1) {
            alert('Invalid ID');
        } else {
            alert(
                `User ${this.list.userList[index].name} with ID ${this.list.userList[index].id} deleted`
            );
            this.tbody.innerHTML = '';
            this.list.userList.splice(index, 1);
            this.renderPage();
        }
    }

    // * RENDER
    render(userList) {
        let templateList = userList.map(item => {
            return this.renderRow(item);
        });
        this.tbody.insertAdjacentHTML(
            'afterbegin',
            templateList.join().replace(/\,/g, '')
        );
        this.generateButtons();
        this.initEdit();
        this.showInfo();
    }

    renderPage() {
        let start =
            (this.pageState.currentPage - 1) * this.pageState.rowPerPage;
        let end = start + this.pageState.rowPerPage;
        let sliceList = this.list.userList.slice(start, end);
        this.tbody.innerHTML = '';
        this.render(sliceList);
    }

    renderRow(item) {
        return `<tr>
                    <td class="id">${item.id}</td>
                    <td class="name">${item.name}</td>
                    <td class="date">${item.date}</td>
                </tr>`;
    }

    // * PAGINATION
    calculateTotalPages() {
        return Math.ceil(this.list.userList.length / this.pageState.rowPerPage);
    }

    setLastPage(pages) {
        this.pageState.currentPage = pages;
        this.pageState.totalPages = pages;
    }

    activeButton(button) {
        if (+button.innerHTML == this.pageState.currentPage) {
            button.classList = 'page-button active';
            button.style.background = '#009879';
            button.style.color = '#ffffff';
        }
    }

    createButton(numberOfPage) {
        let button = document.createElement('button');
        button.className = 'page-button';
        button.innerHTML = numberOfPage;
        this.activeButton(button);
        this.pageButtons.append(button);
    }

    createFirstButton() {
        const firstButton = document.createElement('button');
        firstButton.className = 'first-button';
        firstButton.innerHTML = '<< First';
        this.pageButtons.prepend(firstButton);
    }

    createLastButton() {
        const lastButton = document.createElement('button');
        lastButton.className = 'last-button';
        lastButton.innerHTML = 'Last >>';
        this.pageButtons.append(lastButton);
    }

    isLastPage(pages) {
        return (
            this.pageState.currentPage >= pages &&
            this.pageState.totalPages > pages
        );
    }

    generateButtons() {
        this.pageButtons.innerHTML = '';
        let pages = this.calculateTotalPages();
        let maxLeft =
            this.pageState.currentPage -
            Math.floor(this.pageState.buttonPerPage / 2);
        let maxRight =
            this.pageState.currentPage +
            Math.floor(this.pageState.buttonPerPage / 2);

        if (maxLeft < 1) {
            maxLeft = 1;
            maxRight = this.pageState.buttonPerPage;
        }

        if (maxRight > pages) {
            maxLeft = pages - (this.pageState.buttonPerPage - 1);
            maxRight = pages;
            if (maxLeft < 1) {
                maxLeft = 1;
            }
        }
        for (let i = maxLeft; i <= maxRight; i++) {
            this.createButton(i);
        }

        if (this.pageState.currentPage != 1 && maxLeft > 1) {
            this.createFirstButton();
        }

        if (this.pageState.currentPage != maxRight && maxRight < pages) {
            this.createLastButton();
        }

        if (this.isLastPage(pages)) {
            this.setLastPage(pages);
            this.renderPage();
        } else {
            this.pageState.totalPages = pages;
        }
    }

    onPage(e) {
        if (e.target.nodeName != 'BUTTON') return;
        else if (e.target.className === 'first-button') {
            this.pageState.currentPage = 1;
        } else if (e.target.className === 'last-button') {
            this.pageState.currentPage = this.calculateTotalPages();
        } else {
            this.pageState.currentPage = +e.target.innerHTML;
        }
        this.renderPage();
    }

    changeRowPerPage(e) {
        if (e.target.nodeName == 'SELECT') {
            this.pageState.rowPerPage = +e.target.value;
        }
        this.renderPage();
    }

    // * SORTING
    checkAscDesc(e, className, asc, sortDesc, sortAsc) {
        if (e.target.className == className) {
            if (asc) {
                this.list.userList.sort(sortDesc);
                asc = false;
            } else {
                this.list.userList.sort(sortAsc);
                asc = true;
            }
            this.renderPage();
            return asc;
        }
    }

    sortAscId(a, b) {
        return b.id - a.id;
    }

    sortDescId(a, b) {
        return a.id - b.id;
    }

    sortAscName(a, b) {
        return a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1;
    }

    sortDescName(a, b) {
        return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    }

    parseDate(cell) {
        let date = cell.split('.');

        if (date[0].startsWith('0')) {
            date[0] = date[0].slice(1);
        }
        if (date[1].startsWith('0')) {
            date[1] = date[1].slice(1);
        }
        date[1] -= 1;
        [date[0], date[2]] = [date[2], date[0]];
        return date;
    }

    sortAscDate(a, b) {
        let firstDate = new Date(this.parseDate(a.date));
        let secondDate = new Date(this.parseDate(b.date));
        return secondDate - firstDate;
    }

    sortDescDate(a, b) {
        let firstDate = new Date(this.parseDate(a.date));
        let secondDate = new Date(this.parseDate(b.date));
        return firstDate - secondDate;
    }

    sortID(e) {
        this.sortState.ascId = this.checkAscDesc(
            e,
            'sort-id',
            this.sortState.ascId,
            this.sortAscId,
            this.sortDescId
        );
    }

    sortName(e) {
        this.sortState.ascName = this.checkAscDesc(
            e,
            'sort-name',
            this.sortState.ascName,
            this.sortAscName,
            this.sortDescName
        );
    }

    sortDate(e) {
        this.sortState.ascDate = this.checkAscDesc(
            e,
            'sort-date',
            this.sortState.ascDate,
            this.sortAscDate.bind(this),
            this.sortDescDate.bind(this)
        );
    }

    // * SEARCHING
    isUndefinedID() {
        return this.list.getUserByID(+this.searchIdInput.value) == undefined;
    }

    searchID() {
        this.tbody.innerHTML = '';
        if (this.searchIdInput.value == '') return this.renderPage();
        else if (this.isUndefinedID()) return;
        let user = this.renderRow(
            this.list.getUserByID(+this.searchIdInput.value)
        );
        this.tbody.insertAdjacentHTML('afterbegin', user);
        this.initEdit();
    }

    searchName() {
        this.tbody.innerHTML = '';
        let users = this.list.getUserByName(this.searchNameInput.value);
        if (this.searchNameInput.value == '') return this.renderPage();
        this.render(users);
    }

    searchDate() {
        this.tbody.innerHTML = '';
        let users = this.list.getUserByDate(this.searchDateInput.value);
        if (this.searchDateInput.value == '') return this.renderPage();
        this.render(users);
    }

    // * EDIT
    initEdit() {
        this.tds = this.tbody.querySelectorAll('td');
        this.tds.forEach(td => {
            td.addEventListener('click', () => {
                if (!this.inEditing(td)) {
                    this.startEditing(td);
                }
            });
        });
    }

    startEditing(td) {
        if (td.classList.contains('name') || td.classList.contains('date')) {
            td.setAttribute('contenteditable', true);
        } else return;

        const activeTd = this.findEditing();

        if (activeTd) {
            this.cancelEditing(activeTd);
        }

        td.classList.add(`${td.className}`, 'in-editing');
        td.setAttribute('data-old-value', td.innerHTML);
        this.createEditToolbar(td);
    }

    cancelEditing(td) {
        td.innerHTML = td.getAttribute('data-old-value');
        td.classList.remove('in-editing');
        td.removeAttribute('contenteditable');
    }

    finishEditing(td) {
        const tr = td.parentNode;
        let user = this.list.getUserByID(tr.cells[0].innerHTML);

        td.classList.remove('in-editing');
        td.removeAttribute('contenteditable');

        this.removeEditToolbar(td);

        if (td.classList.contains('name')) {
            user.name = td.textContent.trim();
        } else if (td.classList.contains('date')) {
            user.date = td.textContent.trim();
        }
    }

    inEditing(td) {
        return td.classList.contains('in-editing');
    }

    findEditing() {
        return Array.prototype.find.call(this.tds, td => this.inEditing(td));
    }

    createEditToolbar(td) {
        const toolbar = document.createElement('div');
        toolbar.setAttribute('contenteditable', false);
        toolbar.innerHTML = `
            <div class="edit-toolbar-wrapper">
                <button class="btn-save">Save</button>
                <button class="btn-cancel">Cancel</button>
            </div>
        `;
        toolbar.className = 'edit-toolbar';
        td.append(toolbar);

        const buttonSave = document.querySelector('.btn-save');
        const buttonCancel = document.querySelector('.btn-cancel');

        buttonSave.addEventListener('click', e => {
            e.stopPropagation();
            this.finishEditing(td);
        });

        buttonCancel.addEventListener('click', e => {
            e.stopPropagation();
            this.cancelEditing(td);
        });
    }

    removeEditToolbar(td) {
        const toolbar = td.querySelector('.edit-toolbar');
        toolbar.remove();
    }

    // * SIDEBAR
    toggleSideBar() {
        this.sideBar.classList.toggle('active');
    }

    changeButtonPerPage(e) {
        if (e.target.nodeName == 'SELECT') {
            this.pageState.buttonPerPage = +e.target.value;
        }
        this.renderPage();
    }

    showInfo() {
        this.sidebarInfo.innerHTML = '';
        const info = `
            <span>Current list: <b>${this.listState.currentList}</b></span>
            <span>Total pages: <b>${this.pageState.totalPages}</b></span>
            <span>Current page: <b>${this.pageState.currentPage}</b></span>
            <span>Shown rows: <b>${this.pageState.rowPerPage} of ${this.list.userList.length}</b></span>
        `;
        this.sidebarInfo.insertAdjacentHTML('afterbegin', info);
    }
}

const userTable = new Table();
