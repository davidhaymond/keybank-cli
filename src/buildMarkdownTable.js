const HEADERS = [
    { prop: 'nickname', label: 'Name' },
    { prop: 'type', label: 'Type' },
    { prop: 'balance', label: 'Balance' },
];

const buildCols = (headers, data) => headers.map(
    ({ prop, label }) => ({
        prop,
        label,
        width: data.reduce((acc, cur) => Math.max(cur[prop].length, acc), label.length),
    })
);

const buildHeader = cols => cols.reduce(
    (acc, { label, width }) => `${acc} ${label} ${getPadding(label.length, width)} |`, '|'
);

const buildRow = (rowData, cols) => cols.reduce(
    (acc, { prop, width }) => `${acc} ${rowData[prop]} ${getPadding(rowData[prop].length, width)} |`, '|'
);

const getPadding = (contentLength, colWidth) => ' '.repeat(Math.max(colWidth - contentLength));

function buildTable(data) {
    const cols = buildCols(HEADERS, data);
    const header = cols.reduce((acc, { label, width }) => `${acc} ${label} ${getPadding(label.length, width)} |`, '|') + '\n';
    const rows = data.reduce((acc, cur) => acc + buildRow(cur, cols) + '\n', '');
    return header + rows;
}

module.exports = buildTable;
