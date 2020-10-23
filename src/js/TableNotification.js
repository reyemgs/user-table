class TableNotification {
    constructor() {
        this.notificationBar = document.getElementById('notification-bar');
        this.notificationButton = document.getElementById(
            'notification-button'
        );
    }

    events() {
        this.notificationButton.addEventListener('click', () =>
            this.toggleNotificationBar()
        );
    }

    generateSuccess(object) {
        const success = document.createElement('div');
        const content = `
        <div class="content">
            <div class="close-button">
                <i class="fas fa-times-circle fa-lg"></i>
            </div>
            <span>
                <i> 
                    <b>${new Date().getHours()}:${new Date().getMinutes()}</b>
                    User created
                </i>
                <i class="fas fa-check-circle"></i>
            </span>
            <span>
                ID: <b>${object.id}</b>;
                Name: <b>${object.name}</b>;
                Date: <b>${object.date}</b>;
            </span> 
        </div>
        `;
        success.classList.add('notification', 'notification-success');
        this.notificationBar.prepend(success);
        success.insertAdjacentHTML('afterbegin', content);

        const closeButton = success.querySelector('.close-button');
        closeButton.addEventListener('click', () => success.remove());
    }

    generateWarning(id, name) {
        const warning = document.createElement('div');
        const content = `
        <div class="content">
            <div class="close-button">
                <i class="fas fa-times-circle fa-lg"></i>
            </div>
            <span>
                <i>
                    <b>${new Date().getHours()}:${new Date().getMinutes()}</b>
                    User deleted
                </i>
                <i class="fas fa-exclamation-triangle"></i>
            </span>
            <span>
                ID: <b>${id}</b>;
                Name: <b>${name}</b>;
            </span>
        </div>
        `;
        warning.classList.add('notification', 'notification-warning');
        this.notificationBar.prepend(warning);
        warning.insertAdjacentHTML('afterbegin', content);

        const closeButton = warning.querySelector('.close-button');
        closeButton.addEventListener('click', () => warning.remove());
    }

    generateAlert() {
        const alert = document.createElement('div');
        const content = `
        <div class="content">
            <div class="close-button">
                <i class="fas fa-times-circle fa-lg"></i>
            </div>
            <span>
                <b>${new Date().getHours()}:${new Date().getMinutes()}</b>
                <b>Invalid ID</b>
                <i class="fas fa-skull-crossbones"></i>
            </span>
        </div>
        `;
        alert.classList.add('notification', 'notification-alert');
        this.notificationBar.prepend(alert);
        alert.insertAdjacentHTML('afterbegin', content);

        const closeButton = alert.querySelector('.close-button');
        closeButton.addEventListener('click', () => alert.remove());
    }

    toggleNotificationBar() {
        this.notificationBar.classList.toggle('active');
        this.notificationButton.classList.toggle('active');
    }
}
