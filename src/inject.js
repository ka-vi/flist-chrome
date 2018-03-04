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
