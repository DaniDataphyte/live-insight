export default function modalManager() {
    return {
        modals: {
            login: false,
            signup: false,
            passwordReset: false,
            upgrade: false,
            renew: false
        },

        openModal(name) {
            console.log(`✅ Opening modal: ${name}`);
            Object.keys(this.modals).forEach(key => this.modals[key] = false);
            this.modals[name] = true;
            console.log("🔹 Current modals state:", JSON.parse(JSON.stringify(this.modals)));
        },

        closeModal(name) {
            console.log(`❌ Closing modal: ${name}`);
            this.modals[name] = false;

            // ✅ Force Alpine to recognize state change
            Alpine.nextTick(() => {
                console.log("🔄 Alpine UI updated");
                console.log("🔹 Updated modals state:", JSON.parse(JSON.stringify(this.modals)));
            });
        },

        closeAllModals() {
            console.log("❌ Closing all modals");
            Object.keys(this.modals).forEach(key => this.modals[key] = false);

            Alpine.nextTick(() => {
                console.log("🔄 Alpine UI updated");
                console.log("🔹 All modals closed:", JSON.parse(JSON.stringify(this.modals)));
            });
        }
    };
}
// Ensure the script loads properly
console.log("✅ modalManager.js loaded successfully");
