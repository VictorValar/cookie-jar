let finalSource;
const referrer = document.referrer;
const domain = window.location.hostname;
const EXPIRATE_DATE_COOKIE = 5184000;

function getQueryParam(name) {
    let results = new RegExp("[\\?&]" + name + "=([^&#]*)").exec(
        window.location.href
    );
    if (results == null) {
        return results;
    } else {
        return decodeURIComponent(results[1]);
    }
}

function readCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**Sets a cookie with the given name, value and expiration time in seconds. The cookie is set with the path '/' and the current domain. The expiration time is converted to milliseconds before it is set.
 */
function setCookie(cookieName, cookieValue, expirationTime) {
    expirationTime = expirationTime * 1000;
    let date = new Date();
    let dateTimeNow = date.getTime();

    date.setTime(dateTimeNow + expirationTime);
    date = date.toUTCString();
    document.cookie =
        cookieName +
        "=" +
        cookieValue +
        "; expires=" +
        date +
        "; path=/; domain=" +
        domain;
}

/**
 * This function is used to get the cookie value by the name passed as the argument.
 * Userful for debugging
 * @param {string} cname The name of the cookie to be retrieved
 * @returns {string} The value of the cookie
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/**
 * This function is used to clear the cookie by the name passed as the argument.
 * If the cookie value is more than 1000 characters, it is truncated to the first
 * and last parameters separated by '| User path too long to be recorded |' and set
 * with a default expiry time of 5184000 seconds (60 days).
 * @param {string} cookieName - The name of the cookie to be cleared
 */
function clearCookie(cookieName) {
    const cookieValue = readCookie(cookieName);

    if (!cookieValue) return;

    if (cookieValue.length > 1000) {
        const [firstParam, ...rest] = cookieValue.split("|");
        const lastParam = rest.pop();
        const smallCookie = `${firstParam} | User path too long to be recorded | ${lastParam}`;
        setCookie(cookieName, smallCookie, 5184000);
    }
}

// Reads cookies
let lastSourceCookie = readCookie("lastSourceAttribution");
let firstSourceCookie = readCookie("firstSourceAttribution");
let multiSourceCookie = readCookie("multiSourceAttribution");
let lastDirectCookie = readCookie("lastDirectSource");

// Get Query Parameters
let utm_source = getQueryParam("utm_source");
let utm_medium = getQueryParam("utm_medium");
let utm_campaign = getQueryParam("utm_campaign");
let utm_term = getQueryParam("utm_term");
let utm_content = getQueryParam("utm_content");
let gclid = getQueryParam("gclid");
let fbc = getQueryParam("fbc");

// Get Query Parameters
const queryParams = {
    utm_source: getQueryParam("utm_source") || "",
    utm_medium: getQueryParam("utm_medium") || "",
    utm_campaign: getQueryParam("utm_campaign") || "",
    utm_term: getQueryParam("utm_term") || "",
    utm_content: getQueryParam("utm_content"),
    gclid: getQueryParam("gclid") || "",
    fbc: getQueryParam("fbc") || "",
};

function getEmailSource(utm_medium, utm_source) {
    if (utm_medium.includes("mail") || utm_source.includes("mail")) {
        return "Email Marketing";
    }
}

function getReferrerSource(referrer) {
    let source;

    if (referrer) {
        if (referrer.includes(window.location.hostname)) {
            console.log("Self Referral"); //leaving the variable undefined;
        } else if (referrer.includes("google")) {
            source = "Google Organic Search";
        } else if (referrer.includes("bing")) {
            source = "Microsoft Organic Search";
        } else if (referrer.includes("twitter")) {
            source = "Twitter Organic";
        } else if (referrer.includes("facebook") || referrer.includes("fb")) {
            source = "Facebook Organic";
        } else if (referrer.includes("linkedin")) {
            source = "Linkedin Organic";
        } else if (referrer.includes("insta") || referrer.includes("ig")) {
            source = "Instagram Organic";
        } else if (referrer.includes("whats") || referrer.includes("wa")) {
            source = "WhatsApp";
        } else {
            source = "Referral";
        }
        setCookie("referrerSource", referrer, 5184000);
    }
    return source;
}

function getPaidSource(utm_medium, utm_source, gclid, fbc) {
    let source;
    if (utm_medium === "display") {
        return "Google Display";
    }
    if (gclid !== null) {
        setCookie("gclid", gclid, 5184000);
        return "Google Paid Search";
    }
    if (fbc !== null) {
        setCookie("fbcStored", fbc, 5184000);
        return "Facebook Paid Social";
    }
    if (
        utm_medium.includes("ppc") ||
        utm_medium.includes("ad") ||
        utm_medium.includes("cpc") ||
        utm_medium.includes("paid") ||
        utm_medium.includes("adwords")
    ) {
        switch (utm_source) {
            case "adwords":
            case "google":
                source = "Google Paid Search";
                break;
            case "microsoft":
            case "bing":
                source = "Microsoft Paid Search";
                break;
            case "facebook":
            case "instagram":
                source = "Facebook Ad";
                break;
            case "linkedin":
                source = "Linkedin Ad";
                break;
            case "twitter":
                source = "Twitter Ad";
                break;
        }
        return source;
    }
}

let paidSource = getPaidSource(utm_medium, utm_source, gclid, fbc);
let referrerSource = getReferrerSource(referrer);
let emailSource = getEmailSource(utm_medium, utm_source);

finalSource = paidSource || emailSource || referrerSource || "Direct";

if (
    (finalSource === "Direct" && lastDirectCookie === null) ||
    finalSource !== "Direct"
) {
    if (finalSource !== "Direct") {
        setCookie("lastSourceAttribution", finalSource, EXPIRATE_DATE_COOKIE);
    }

    if (firstSourceCookie === null) {
        setCookie("firstSourceAttribution", finalSource, EXPIRATE_DATE_COOKIE);
    }

    if (multiSourceCookie) {
        setCookie(
            "multiSourceAttribution",
            multiSourceCookie + " | " + finalSource,
            EXPIRATE_DATE_COOKIE
        );
    } else {
        setCookie("multiSourceAttribution", finalSource, EXPIRATE_DATE_COOKIE);
    }
}

if (finalSource === "Direct") {
    setCookie("lastDirectSource", "true", 5184000);
}

if (utm_source !== null && utm_source !== "") {
    setCookie("utmSource", utm_source, 5184000);
}

if (utm_campaign !== null) {
    campaign = readCookie("utmCampaign");

    if (campaign) {
        setCookie("utmCampaign", campaign + " | " + utm_campaign, 5184000);
    } else {
        setCookie("utmCampaign", utm_campaign, 5184000);
    }
}

if (utm_term !== null) {
    term = readCookie("utmTerm");

    if (term) {
        setCookie("utmTerm", term + " | " + utm_term, 5184000);
    } else {
        setCookie("utmTerm", utm_term, 5184000);
    }
}

if (utm_content !== null) {
    content = readCookie("utmContent");

    if (content) {
        setCookie("utmContent", content + " | " + utm_content, 5184000);
    } else {
        setCookie("utmContent", utm_content, 5184000);
    }
}

if (utm_medium !== null && utm_medium !== "") {
    setCookie("utmMedium", utm_medium, 5184000);
}

// #### Clear Cookies ####
clearCookie("lastSourceAttribution");
clearCookie("firstSourceAttribution");
clearCookie("multiSourceAttribution");
clearCookie("utmSource");
clearCookie("utmMedium");
clearCookie("utmCampaign");
clearCookie("utmTerm");
clearCookie("utmContent");
clearCookie("gclid");
clearCookie("_fbc");

// #### Set variables ####
client_user_agent = window.navigator.userAgent
    // user_ip = getUserIP();

// function getUserIP() {
//     // Use the fetch API to call the ipify API
//     fetch("https://api.ipify.org?format=json")
//         .then(response => response.json()) // Parse the response as JSON
//         .then(data => {
//             // Extract the user's IP from the response
//             const userIP = data.ip;
//         })
//         .catch(error => console.log(Error: $ { error }));
// }




window.onload = function() {
    ga("require", "getClientId");
    var formClientID = ga.getAll()[0].get("clientId");
    try {
        document.getElementById("analyticsClientId").value = formClientID;
    } catch {
        console.log('Cookie Jar: Missing form field: analyticsClientId');
    };
    try {
        document.getElementById("client_user_agent").value = client_user_agent;
    } catch {
        console.log('Cookie Jar: Missing form field: client_user_agent');
    };

};

// Set the cookies as values on the form fields
function set_cookie_fields(name) {
    try {
        document.getElementById(name).value = readCookie(astr);
    } catch {
        console.log('Cookie Jar: Missing form field:' + name);
    }
}

/**Set the cookies as values on the form fields*/
function setOnFields() {
    fetch('https://ipinfo.io/json', { method: 'GET', mode: 'cors' })
        .then((response) => response.json())
        .then((data) => {
            client_ip_address = data.ip;
            console.log("IP: " + client_ip_address);
            try {
                // console.log(client_ip_address);
                document.getElementById("client_ip_address").value = String(client_ip_address);

            } catch {
                console.log('Cookie Jar: Missing form field: client_ip_address');

            };
        })
    try {
        document.getElementById("lastSourceAttribution").value = readCookie("lastSourceAttribution");
        document.getElementById("firstSourceAttribution").value = readCookie("firstSourceAttribution");
        document.getElementById("multiSourceAttribution").value = readCookie("multiSourceAttribution");
        document.getElementById("gclid").value = readCookie("gclid");
        document.getElementById("_fbc").value = readCookie("_fbc");
        document.getElementById("_fbp").value = readCookie("_fbp");
        document.getElementById("utm_content").value = readCookie("utm_content");
        document.getElementById("utm_term").value = readCookie("utm_term");
        document.getElementById("utm_campaign").value = readCookie("utm_campaign");
        document.getElementById("utm_source").value = readCookie("utm_source");
        document.getElementById("utm_medium").value = readCookie("utm_medium");

    } catch (error) {
        console.log(`Cookie Jar - Missing form fields: ${error.message}`);
    }
}

setTimeout(() => { setOnFields(); }, 2000);