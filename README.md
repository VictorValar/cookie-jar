# Cookie Jar

## Introduction

The "Cookie Jar" script is a collection of functions for handling cookies and query parameters on the client side. It provides an easy and efficient way to set, read, and clear cookies, as well as retrieve query parameter values from the URL.

With this script, you can easily personalize user experience, track user behavior, or gather analytics data. It is useful for any website or web application that needs to store cookie data on the client side.

The script also includes a function `setOnFields()` which allows you to set a cookie based on the values of input fields on your HTML page. The function takes in two parameters, the first is an array of the fields' ids and the second is the name of the cookie.

Cookie Jar is easy to implement and use. All you have to do is import the script on all pages and you can start using the provided functions.

***

### Step 1: Include the "Cookie Jar" JavaScript code in your HTML file
Include the "Cookie Jar" JavaScript code in the `<head>` or `<body>` section of your HTML file.
Add this to every page on your site.

```html
<script src="cookie-jar.js"></script>
```

### Step 2: Add hidden fields to your form
Include the hidden fields below in your form.  It is important that the `id` attribute match the one listed here, as the script references these fields by `id`.
These fields are used to store the values of the cookies and other information so that they can be easily passed to your server or CRM when the form is submitted.

```html
    <form>
        <input type="hidden" id="lastSourceAttribution" name="lastSourceAttribution">
        <input type="hidden" id="firstSourceAttribution" name="firstSourceAttribution">
        <input type="hidden" id="multiSourceAttribution" name="multiSourceAttribution">
        <input type="hidden" id="gclid" name="gclid">
        <input type="hidden" id="_fbc" name="_fbc">
        <input type="hidden" id="_fbp" name="_fbp">
        <input type="hidden" id="_ttp" name="_ttp">
        <input type="hidden" id="utm_content" name="utm_content">
        <input type="hidden" id="utm_term" name="utm_term">
        <input type="hidden" id="utm_campaign" name="utm_campaign">
        <input type="hidden" id="utm_source" name="utm_source">
        <input type="hidden" id="utm_medium" name="utm_medium">
        <input type="hidden" id="client_ip_address" name="client_ip_address">
        <input type="hidden" id="client_user_agent" name="client_user_agent">
    </form>
```


## Usage
This code can be used to handle cookies and query parameters on the client side. The `setCookie` function can be used to set cookies, the `readCookie` function can be used to read the value of a cookie, the `cleanseCookie` function can be used to clear a cookie, and the `getQueryParam` function can be used to retrieve the value of a query parameter. This can be useful for tracking user behavior, personalizing user experience, or for analytics purposes. The function `setOnFields(formId)` can be used after the form fields are created and the cookies are set on the client side. This function will check all the form fields and set the value of the fields that have the same name as the cookies, if the cookies are present in the client browser.

It is important to note that this script makes use of the `document.referrer`, `window.location.hostname`, `document.cookie` properties and `getTime()` and `toUTCString()` methods, that are related to the browser's Document and Date objects respectively, so it will only work on client-side JavaScript.

## Script Execution

When the "Cookie Jar" script loads and executes, the following actions occur:

1. The `referrer` and `domain` constants are defined and set to the referrer of the current page and the domain name of the current website, respectively.
2. The `COOKIE_EXPIRE_DATE` constant is defined and set to 5184000 seconds (60 days).
3. The `readCookie(name)`, `setCookie(cookie_name, stored_value, expiration_time)`, `getCookie(cname)`, and `cleanseCookie(cookie_name)` functions are defined and made available for use.
4. The `getQueryParam(name)` function is defined and made available for use.
5. The `lastSourceCookie`, `firstSourceCookie`, `multiSourceCookie`, and `lastDirectCookie` variables are defined and set to the value of the corresponding cookies (if present).
6. The `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, and `fbc` variables are defined and set to the value of the corresponding query parameters (if present).
7. The function `setOnFields(formId)` is defined and made available for use, this function takes the id of a form element as a parameter and sets the values of the form fields based on the cookies with the same name.

Note that if the cookies or query parameters are not present, the corresponding variables will be set to `null` or `undefined`.


## Constants
- `referrer`: The referrer of the current page.
- `domain`: The domain name of the current website.
- `COOKIE_EXPIRE_DATE`: The expiration time of the cookie in seconds (5184000 seconds = 60 days).

## Functions

### `getQueryParam(name)`
This function is used to get the value of a query parameter by its name.
- Input: `name` (string) - The name of the query parameter.
- Output: `results` (string) - The value of the query parameter. If the parameter is not present in the URL, the function returns `null`.

### `readCookie(name)`
This function is used to read the value of a cookie by its name.
- Input: `name` (string) - The name of the cookie.
- Output: `c` (string) - The value of the cookie. If the cookie is not present, the function returns `null`.

### `setCookie(cookie_name, stored_value, expiration_time)`
This function is used to set a cookie with the given name, value and expiration time in seconds. The cookie is set with the path '/' and the  current domain.
- Input: `cookie_name` (string) - The name of the cookie.
- Input: `stored_value` (string) - The value of the cookie.
- Input: `expiration_time` (int) - The expiration time of the cookie in seconds.

### `getCookie(cname)`
This function is used to get the value of a cookie by its name.
- Input: `cname` (string) - The name of the cookie.
- Output: `c.substring(name.length, c.length)` (string) - The value of the cookie. If the cookie is not present, the function returns an empty string.

### `cleanseCookie(cookie_name)`
This function is used to clear cookies that are more than 1000
 * characters long.
- Input: `cookie_name` (string) - The name of the cookie.
- Output: No return value.

If the cookie value is more than 1000 characters, it is truncated to the first and last parameters separated by '| User path too long to be recorded |' and set with a default expiry time of 5184000 seconds (60 days).

## Reading Cookies
The following cookies are read when the script is executed:
- `lastSourceCookie`: The value of the "lastSourceAttribution" cookie.
- `firstSourceCookie`: The value of the "firstSourceAttribution" cookie.
- `multiSourceCookie`: The value of the "multiSourceAttribution" cookie.
- `lastDirectCookie`: The value of the "lastDirectSource" cookie.

## Getting Query Parameters
The following query parameters are retrieved and saved as cookies :

- `Google Ads`: The value of the "gclid" query parameter.
- `Meta Ads`: The value of the "fbc" query parameter.
- `GA4`: For UTM query parameters specifications please refer to [GA4 UTM Documentation](https://support.google.com/analytics/answer/10917952?hl=en#zippy=%2Cin-this-article)
    - utm_id
    - utm_source
    - utm_medium
    - utm_campaign
    - utm_term
    - utm_content
    - utm_marketing_tactic
    - utm_creative_format
    - utm_source_platform




## Getting Paid Source
getPaidSource