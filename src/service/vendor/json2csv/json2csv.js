function flatObject(obj, prefix = '') {
    if (typeof obj === 'undefined' || obj === null) return {};
    return Object.entries(obj).reduce((acc, [key, value]) => {
        if (typeof value === 'object') return { ...acc, ...flatObject(value, `${prefix}${key}.`) };
        return { ...acc, [`${prefix}${key}`]: value };
    }, {});
}

function escapeCsvValue(cell) {
    if (
        cell
        .replace(/ /g, '')
        .match(/[\s,"]/)) {

        return '"' + cell.replace(/"/g, '""') + '"';
    }
    return cell;
}

function jsonToCsv(arrayOfObjects) {
    let keys = [];
    const values = arrayOfObjects.map(item => {
        const fo = flatObject(item);
        
        keys = Object.keys(fo);
        
        const val = keys.map((key) => (key in fo ? escapeCsvValue(`${fo[key]}`) : ''));

        return val.join(';');
    });
    let header = keys.join(';');
    let body = values.join('\n');
    return `${header}\n${body}`;
}
