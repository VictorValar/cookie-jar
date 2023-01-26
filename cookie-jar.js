let finalSource;
const referrer = document.referrer;
const domain = window.location.hostname;
const EXPIRATE_DATE_COOKIE = 5184000;
const DEBUG_MODE = false;

/** Gets the value of the query parameter passed as the argument.
 * @param {string} name The name of the query parameter to be retrieved
 * @returns {string} The value of the query parameter
 */
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

/** Reads a cookie by the name passed as the argument.
 * @param {string} cname The name of the cookie to be retrieved
 * @returns {string} The value of the cookie
 */
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

/**
 * Sets a cookie with the given name, value and expiration time in seconds.
 * The cookie is set with the path '/' and the  current domain.
 * @param {string} cookieName - The name of the cookie to be set
 * @param {string} cookieValue - The value of the cookie to be set
 * @param {number} expirationTime - The expiration time of the cookie in seconds
 * @returns {string} The value of the cookie
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

    return cookieValue;
}

/**
 * This function is used to clear cookies that are more than 1000
 * characters long.
 * @param {string} cookieName - The name of the cookie to be cleared
 */
function clearCookie(cookieName) {
    const cookieValue = readCookie(cookieName);

    if (!cookieValue) return;

    if (cookieValue.length > 1000) {
        const [firstParam, ...rest] = cookieValue.split("|");
        const lastParam = rest.pop();
        const smallCookie = `${firstParam} | User path too long to be recorded | ${lastParam}`;
        setCookie(cookieName, smallCookie, EXPIRATE_DATE_COOKIE);
    }
}

// Reads stored source cookies
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
let ttclid = getQueryParam("ttclid");

/** Get Email Source and sets a cookie with the value.
 * @param {string} utm_medium - Medium from the query parameters
 * @param {string} utm_source - Source from the query parameters
 * @returns {string} The value of the source
 */
function getEmailSource(utm_medium, utm_source) {
    if (utm_medium != null && utm_medium.includes("email") || utm_source != null && utm_source.includes("email")) {
        return "Email Marketing";
    }
}

/** Get Referral Source and sets a cookie with the value.
 * @param {string} referrer - The referrer of the page
 * @returns {string} The value of the source
 */
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
        setCookie("referrerSource", referrer, EXPIRATE_DATE_COOKIE);
    }
    return source;
}

/** Get Paid Source and sets a cookie with the value.
 * @param {string} utm_medium - Medium from the query parameters
 * @param {string} utm_source - Source from the query parameters
 * @param {string} gclid - Google Ads Click ID
 * @param {string} fbc - Facebook Click ID
 * @param {string} ttclid - TikTok Click ID
 * @returns {string} The value of the source
 */
function getPaidSource(utm_medium, utm_source, gclid, fbc, ttclid) { // todo: add TikTok
    let source;
    if (["display", "gdn"].includes(utm_medium)) {
        return "Google Display";
    }
    if (gclid !== null) {
        setCookie("gclid", gclid, EXPIRATE_DATE_COOKIE);
        return "Google Paid Search";
    }
    if (fbc !== null) {
        setCookie("fbcStored", fbc, EXPIRATE_DATE_COOKIE);
        return "Facebook Paid Social";
    }
    if (
        utm_medium != null && utm_medium.includes("ppc") ||
        utm_medium != null && utm_medium.includes("ad") ||
        utm_medium != null && utm_medium.includes("cpc") ||
        utm_medium != null && utm_medium.includes("paid") ||
        utm_medium != null && utm_medium.includes("adwords")
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
    setCookie("lastDirectSource", "true", EXPIRATE_DATE_COOKIE);
}




// Check if UTM parameters are present
const utm_params = ["utm_campaign", "utm_term", "utm_content"]

if (utm_source !== null && utm_source !== "") {
    setCookie("utm_source", utm_source, EXPIRATE_DATE_COOKIE);
}

if (utm_medium !== null && utm_medium !== "") {
    setCookie("utm_medium", utm_medium, EXPIRATE_DATE_COOKIE);
}

for (i in utm_params) {
    if (i !== null) {
        cookie_name = String(utm_params[i]);
        saved_cookie = readCookie(cookie_name);

        if (saved_cookie) {
            new_value = saved_cookie + " | " + i;
            setCookie(cookie_name, new_value, EXPIRATE_DATE_COOKIE);
        } else {
            setCookie(cookie_name, utm_campaign, EXPIRATE_DATE_COOKIE);
        }

    }
}

// if (utm_campaign !== null) {
//     campaign = readCookie("utm_campaign");

//     if (campaign) {
//         setCookie("utm_campaign", campaign + " | " + utm_campaign, EXPIRATE_DATE_COOKIE);
//     } else {
//         setCookie("utm_campaign", utm_campaign, EXPIRATE_DATE_COOKIE);
//     }
// }

// if (utm_term !== null) {
//     term = readCookie("utm_term");

//     if (term) {
//         setCookie("utm_term", term + " | " + utm_term, EXPIRATE_DATE_COOKIE);
//     } else {
//         setCookie("utm_term", utm_term, EXPIRATE_DATE_COOKIE);
//     }
// }

// if (utm_content !== null) {
//     content = readCookie("utm_content");

//     if (content) {
//         setCookie("utm_content", content + " | " + utm_content, EXPIRATE_DATE_COOKIE);
//     } else {
//         setCookie("utm_content", utm_content, EXPIRATE_DATE_COOKIE);
//     }
// }


// Clear cookies
clearCookie("lastSourceAttribution");
clearCookie("firstSourceAttribution");
clearCookie("multiSourceAttribution");
clearCookie("utm_source");
clearCookie("utm_medium");
clearCookie("utm_campaign");
clearCookie("utm_term");
clearCookie("utm_content");
// clearCookie("gclid");
// clearCookie("_fbc");
// clearCookie("_fbc");

/**Set the cookies and other useful information as values on the form fields. */
function setOnFields() {

    if (document.querySelector('form')) {
        try {
            console.info('Setting on fields');
            const formFields = {
                "lastSourceAttribution": "lastSourceAttribution",
                "firstSourceAttribution": "firstSourceAttribution",
                "multiSourceAttribution": "multiSourceAttribution",
                "gclid": "gclid",
                "ttclid": "ttclid",
                "_ttp": "_ttp",
                "_fbc": "_fbc",
                "_fbp": "_fbp",
                "utm_content": "utm_content",
                "utm_term": "utm_term",
                "utm_campaign": "utm_campaign",
                "utm_source": "utm_source",
                "utm_medium": "utm_medium",
                "client_ip_address": "client_ip_address",
                "client_user_agent": "client user agent",

            };

            // Set the client IP address
            fetch('https://ipinfo.io/json', { method: 'GET', mode: 'cors' })
                .then((response) => response.json())
                .then((data) => {
                    const client_ip_address = data.ip;
                    setCookie("client_ip_address", client_ip_address, EXPIRATE_DATE_COOKIE);
                    // console.log(`IP: ${client_ip_address}`);
                    const formElement = document.getElementById("client_ip_address");
                    if (formElement) {
                        formElement.value = String(client_ip_address);

                    } else {
                        console.error('Cookie Jar - Missing form field: client_ip_address');
                    }
                });

            // Set the client user agent as a cookie
            const client_user_agent = navigator.userAgent;
            setCookie("client_user_agent", client_user_agent, EXPIRATE_DATE_COOKIE);

            const formFieldsStatus = [];

            // Set the cookies as values on the form fields
            Object.keys(formFields).forEach(function(key) {
                const formElement = document.getElementById(key);
                if (formElement) {
                    formElement.value = readCookie(formFields[key]);
                    formFieldsStatus.push({
                        Field: key,
                        Status: "Found",
                        Value: readCookie(formFields[key]) || "N/A"
                    });
                } else {
                    console.error(`Cookie Jar - Missing form field: ${key}`);
                    formFieldsStatus.push({
                        Field: key,
                        Status: "Not Found",
                        Value: readCookie(formFields[key]) || "-"
                    });
                }
            });

            console.table(formFieldsStatus);

        } catch (error) {
            console.error(`${error.name}: ${error.message}`);
            console.trace(error);
        }
    } else {
        console.error('Cookie Jar - No form found');

    }
}


/** Listens to DOM Ready Event and then calls setOnFields() if it is ready.*/
function onDOMReady() {
    try {
        if (document.readyState === "interactive" || document.readyState === "complete") {
            setOnFields();
        } else {
            document.addEventListener("DOMContentLoaded", setOnFields);
        }
    } catch (error) {
        console.error(`${error.name}: ${error.message}`);
        console.trace(error);
    }
}

onDOMReady();