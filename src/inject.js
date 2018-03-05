const CATEGORY_NAMES = ['Fave', 'Yes', 'Maybe', 'No'];


function extractList(categoryName) {
    const results = document.querySelectorAll(`#Character_Fetishlist${categoryName} a`);

    return Array.from(results).map(item => {
        return {
            name: item.innerText.trim()
        };
    });
}

function fetchKinkLists() {
    const toReturn = {};

    CATEGORY_NAMES.forEach(categoryName => {
        toReturn[categoryName] = extractList(categoryName);
    });

    return toReturn;
}

function fetchTabInfo() {
    const result = document.querySelector('#tabs-1 div');

    return result.textContent;
}

function fetchDetailBlock(detail) {
    const title = detail.querySelector('h3').innerText;
    const results = detail.querySelectorAll('span');

    return {
        title,
        details: Array.from(results).map(item => {
            return {
                title: item.innerText,
                value: item.nextSibling.textContent.trim(),
            };
        }),
    };
}

function fetchTabDetails() {
    const results = document.querySelectorAll('#tabs-2 div div.itgroup');

    return Array.from(results).map(fetchDetailBlock);
}

function fetchTabImages() {
    const results = document.querySelectorAll('#tabs-4 div a');

    return Array.from(results).map(item => {
        return {
            title: item.querySelector('img').title,
            href: item.href,
        };
    });
}

function fetchTabs() {
    return {
        info: fetchTabInfo(),
        details: fetchTabDetails(),
        images: fetchTabImages(),
    };
}
