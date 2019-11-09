const height = process.stdout.getWindowSize ? process.stdout.getWindowSize()[1] : 99999;
const width = process.stdout.getWindowSize ? process.stdout.getWindowSize()[0] : 99999;

const CATEGORIES = ['Fave', 'Yes', 'Maybe', 'No'];

const MAX_TABS = 4;

const echo = function(o) {
    console.log(o.toString());
    return o;
}

function fill(kink, widest, c) {
    c = c || ' ';
    kink = typeof kink === 'string' ? kink : kink.name;
    let s = kink.slice();
    for(let i = kink.length; i < widest; i++) {
        s += c;
    }
    return s + c + c + c + c;
}

function formatKink(kinks, i, widest) {
    return i < kinks.length ? fill(kinks[i], widest) : fill('', widest);
}

function checkWidest(docs) {
    docs.widest = {};
    CATEGORIES.map(function(c) {
        docs.widest[c] = Math.max.apply(null, docs.kinks[c].map(function(k) {
            return k.name.length;
        }));
        if (docs.widest[c] < 0) {
            docs.widest[c] = c.length;
        }
    });
}

function checkHeight(docs, cats) {
    const h = height - 3;
    let m = cats.length;
    for(let i = 0; i < m; i++) {
        const c = cats[i];
        if(docs.kinks[c].length > h) {
            const k = docs.kinks[c];
            const newKink = c + ' ' + i;
            docs.widest[newKink] = docs.widest[c];
            docs.kinks[c] = k.slice(0, h);
            docs.kinks[newKink] = k.slice(h);
            cats.splice(i + 1, 0, newKink);
            m++;
        }
    }
    return cats;
}

function sortCols(docs) {
    CATEGORIES.map(function(c) {
        docs.kinks[c] = docs.kinks[c].sort((a, b) => a.name.localeCompare(b.name));
    });
}

function kinkName(kinkName) {
    return kinkName.split(' ')[0];
}

function printInfo(info) {
    console.log(info);
}

function printDetails(details) {
    console.log();
    details.forEach(group => {
        console.log(group.title);

        const width = group.details.reduce(widthReducer, 0);

        group.details.forEach(detail => {
            const {title, value} = detail;
            const tabCount = MAX_TABS - Math.floor(title.length / 8);
            const tabs = '\t'.repeat(tabCount);
            console.log(`${title}${tabs}${value}`);
        });

        console.log();
    });
}

function widthReducer(max, item) {
    return item.title.length > max ? item.title.length : max;
}

function printImages(images) {
    const width = images.reduce(widthReducer, 0) + 1;
    const maxTabs = Math.floor(width / 8) + 1;

    images.forEach(image => {
        const {href, title} = image;
        const tabCount = maxTabs - Math.floor((title.length + 1) / 8);
        const tabs = '\t'.repeat(tabCount);
        console.log(`${title}:${tabs}${href}`);
    });
}

function checkWidth(docs, CATS) {
    let line = '';
    let lines = [];
    let subcats = [];
    let groups = [];
    for(let i in CATS) {
        let next = fill(kinkName(CATS[i]), docs.widest[CATS[i]]);
        if (line.length + next.length >= width) {
            lines.push([line]);
            groups.push(subcats);
            subcats = [];
            line = '';
        }
        line += next;
        subcats.push(CATS[i]);
    }
    lines.push([line]);
    groups.push(subcats);
    return {lines, groups};
}

function printColumns(docs) {
    printInfo(docs.tabs.info);
    printDetails(docs.tabs.details);
    printImages(docs.tabs.images);

    console.log();

    checkWidest(docs);
    sortCols(docs);
    let max = Math.max.apply(null, CATEGORIES.map(function(c) { return docs.kinks[c].length; }));
    max = max < height ? max : height - 3;
    let line = '';
    const CATS = checkHeight(docs, CATEGORIES.slice());
    let {lines, groups} = checkWidth(docs, CATS);
    // for(let i in CATS) {
    //     line += fill(kinkName(CATS[i]), docs.widest[CATS[i]]);
    // }
    // console.log(line);
    line = '';
    for(let g in groups) {
        for(let i in groups[g]) {
            line += fill('', docs.widest[groups[g][i]], '-');
        }
        lines[g].push(line);
        line = '';
    }
    //for(let i = 0; i < CATS.length; i++) {
    //    line += fill('', docs.widest[CATS[i]], '-');
    //}
    //console.log(line);
    for(let cnt = 0; cnt < max; cnt++) {
        line = '';
        for(let g in groups) {
            for(let i in groups[g]) {
                line += formatKink(docs.kinks[groups[g][i]], cnt, docs.widest[groups[g][i]]);
            }
            lines[g].push(line);
            line = '';
        }
        //for(let i in CATS) {
        //    line += formatKink(docs.kinks[CATS[i]], cnt, docs.widest[CATS[i]]);
        //}
        //console.log(line);
    }
    for(let i in lines) {
        console.log('');
        for(let j in lines[i]) {
            let ln = lines[i][j];
            if(ln.trim().length == 0) {
                continue;
            }
            console.log(ln);
        }
    }
}

module.exports = {
    printColumns,
};
