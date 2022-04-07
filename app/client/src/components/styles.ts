import { makeStyles } from '@material-ui/core/styles';
import { blue, green, red, yellow } from '@material-ui/core/colors';

export const useStyles = makeStyles({
    container: {
        maxHeight: 1000
    },
    table: {
        minWidth: 650,
        borderCollapse: 'collapse',

        '& th,td': {
            fontSize: "0.7rem",
            padding: "2px 10px 2px 10px"
        },
    },
    head: {
    },
    strike: {
        backgroundColor: "#e6f8d2"
    },
    mark: {
        borderTop: "2px solid red"
        // : red[500]
    },
    selected: {
        // boxSizing: "border-box",
        // border: "2px solid yellow",
        backgroundColor: yellow[500]
    },
    markAsBuy: {
        backgroundColor: green[500]
    },
    markAsSell: {
        backgroundColor: red[500]
    },
    buttonGroup: {
    },
    buyButton: {
        padding: "2px 2px",
        lineHeight: 1,
        fontSize: "0.7rem",
        backgroundColor: green[500],
    },
    sellButton: {
        padding: "2px 2px",
        lineHeight: 1,
        fontSize: "0.7rem",
        backgroundColor: red[500],
    },
    bid: {
        color: blue[500],
    },
    ask: {
        color: red[500],
    },
    // Tried this: https://stackoverflow.com/questions/43173235/make-a-flexbox-middle-part-scroll-without-the-container-taking-100-of-the-page
    mainContainer: {
        flexDirection: 'column',
        flexGrow: 1
    },
    matrixPanel: {
        height: "60vh",
        overflow: 'scroll',
        flexDirection: 'column',
        flexGrow: 1
    },
    detailsPanel: {
        // flexDirection: 'column',
        // flexGrow: 1
    },
    underlyingPanel: {
        // flexDirection: 'column',
        // flexGrow: 1

    }
});
