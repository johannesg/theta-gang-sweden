var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    new_uri = "wss:";
} else {
    new_uri = "ws:";
}
new_uri += "//" + loc.host;
new_uri += loc.pathname + "ws/hmr";

const ws = new WebSocket(new_uri);

ws.addEventListener("open", () => {
    console.log("Socket open");
    ws.send("Hello!");
});

ws.addEventListener("close", ({ reason }) => {
    console.log(`Socket closed. Reason: ${reason}`);
});

ws.addEventListener("message", ({ data }) => {
    console.log(data);
    if (data === "RELOAD") {
        reloadCss();
    }
});

function reloadCss() {
    console.log("reloading css");
    document.querySelectorAll("link[rel=stylesheet]").forEach(link => {
        if (!link.href.startsWith("http://localhost"))
            return;
        link.href = link.href.replace(/\?.*|$/, "?" + Date.now())
    });
}
