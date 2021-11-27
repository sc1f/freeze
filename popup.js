const button = document.getElementById("freeze-button");

const toggleFreeze = () => {
    const OVERLAY_ID = "__freeze_overlay__";

    const freeze = () => {
        const overlay = document.createElement("div");
        overlay.setAttribute("id", OVERLAY_ID);
        overlay.setAttribute(
            "style",
            "width:100%;height:100%;left:0;top:0;position:fixed;background:none;z-index:100000;"
        );

        overlay.addEventListener("mouseover", (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        });

        overlay.addEventListener("keydown", (ev) => {
            ev.preventDefault();
            ev.stopImmediatePropagation();
        });

        document.body.prepend(overlay);
        console.warn(
            "[freeze] keyboard and mouse events have been frozen from triggering on the current frame!"
        );
    };

    const unfreeze = () => {
        document.body.removeChild(overlay);
        console.warn(
            "[freeze] keyboard and mouse events can now trigger on the current frame."
        );
    };

    const overlay = document.getElementById(OVERLAY_ID);
    const is_frozen = overlay !== null;
    is_frozen ? unfreeze() : freeze();

    console.log("is_frozen", !is_frozen);
    chrome.storage.local.set({
        is_frozen: !is_frozen,
    });
};

const toggleButtonText = () => {
    chrome.storage.local.get("is_frozen", (result) => {
        result.is_frozen === true
            ? (button.innerText = "Unfreeze")
            : (button.innerText = "Freeze");
        button.classList.toggle("frozen");
    });
}

button.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: toggleFreeze,
        }, toggleButtonText
    );
});

(function () {
    toggleButtonText();
}());