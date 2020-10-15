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

        this.pageState = {
            rowPerPage: 5,
            currentPage: 1,
            totalPages: 1,
        };
        this.sortState = {
            ascId: true,
            ascName: true,
            ascDate: true,
        };

        this.list = new UserList();
        this.init();
    }

    init() {
        this.loadRows(userList);
        this.renderPage();
        this.generateButtons();
        this.events();
    }

    loadRows() {
        this.list.userList = userList;
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
        this.select.addEventListener('change', e => this.selectRowPerPage(e));
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
    // TODO render row if user on current page
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

    isLastPage(pages) {
        return (
            this.pageState.currentPage >= pages &&
            this.pageState.totalPages > pages
        );
    }

    generateButtons() {
        this.pageButtons.innerHTML = '';
        let pages = this.calculateTotalPages();

        for (let i = 1; i <= pages; i++) {
            this.createButton(i);
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
        this.pageState.currentPage = +e.target.innerHTML;
        this.renderPage();
    }

    selectRowPerPage(e) {
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
    isUndefinedName() {
        return this.list.getUserByName(this.searchIdName.value) == undefined;
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
        console.log(user);
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
}

const userTable = new Table();
