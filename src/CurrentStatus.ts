import { Plugin,UIManager, UIManagerScope, ActionState, SettingsTypes } from '@highlite/plugin-api';

// display the current status of the player
class CurrentStatus extends Plugin {
    pluginName: string = 'Current Status';
    author = 'Doodleman360';
    private uiManager = new UIManager();
    private statusUI: HTMLElement | null = null;
    private statusValueUI: HTMLElement | null = null;

    constructor() {
        super();

        this.settings.xPosition = {
            text: 'X-Position',
            type: SettingsTypes.range,
            value: 6,
            callback: () => {},
        };
        this.settings.yPosition = {
            text: 'Y-Position',
            type: SettingsTypes.range,
            value: 235,
            callback: () => {},
        };
    }

    init(): void {
        this.log('Initialized');
    }

    start(): void {
        this.log('Started');
        if (this.settings.enable.value && !this.statusUI) {
            this.createStatusUI();
        }
    }

    stop(): void {
        this.log('Stopped');
        if (this.statusUI) {
            this.statusUI.remove();
            this.statusUI = null;
        }
    }

    // Create UI Element
    private createStatusUI(): void {
        if (this.statusUI) {
            this.statusUI.remove();
        }
        this.statusUI = this.uiManager.createElement(
            UIManagerScope.ClientInternal
        );
        if (!this.statusUI) {
            this.log('Failed to create status UI element.');
            this.settings.enable.value = false;
            return;
        }

        this.statusUI.style.position = 'absolute';
        this.statusUI.style.height = 'auto';
        this.statusUI.style.zIndex = '1000';
        this.statusUI.style.display = 'flex';
        this.statusUI.style.flexDirection = 'column';
        this.statusUI.style.justifyContent = 'space-evenly';
        this.statusUI.style.width = 'auto';
        this.statusUI.style.padding = '10px';
        const xPos = this.settings.xPosition.value as string;
        const yPos = this.settings.yPosition.value as string;
        this.statusUI.style.right = xPos + 'px';
        this.statusUI.style.bottom = yPos + 'px';

        this.statusUI.classList.add('hs-menu', 'hs-game-menu');

        // Create Sub-Span Element
        const statusSpan = document.createElement('span');
        statusSpan.style.display = 'flex';
        statusSpan.style.justifyContent = 'center';

        // Value
        this.statusValueUI = document.createElement('span');
        this.statusValueUI.innerText = 'Idle';
        statusSpan.appendChild(this.statusValueUI);

        this.statusUI.appendChild(statusSpan);
    }

    // Logged In
    SocketManager_loggedIn(): void {
        if (!this.settings.enable.value) return;
        if (this.statusUI) {
            this.statusUI.remove();
            this.statusUI = null;
        }
        this.createStatusUI();
    }

    // Logged Out
    SocketManager_handleLoggedOut(): void {
        if (this.statusUI) {
            this.statusUI.remove();
            this.statusUI = null;
        }
    }

    GameLoop_update(...args: any) {
        if (!this.settings.enable.value) {
            return;
        }
        if (!this.statusUI) {
            return;
        }

        const xPos = this.settings.xPosition.value as string;
        const yPos = this.settings.yPosition.value as string;
        this.statusUI.style.right = xPos + 'px';
        this.statusUI.style.bottom = yPos + 'px';

        const player = this.gameHooks.EntityManager.Instance._mainPlayer;
        if (!player) return;

        const currentState = ActionState[
            player._currentState.getCurrentState()
            ].replace(/State$/, '');
        if (this.statusValueUI) {
            this.statusValueUI.innerText = currentState;
        }
    }
}
// Export both as default and named export for maximum compatibility
export default CurrentStatus;
export { CurrentStatus };
