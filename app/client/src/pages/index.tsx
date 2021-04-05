import * as React from 'react'

import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo/client';

import { Typography, Grid, makeStyles, Box, Drawer, AppBar, Toolbar, Divider, Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core'

import { OptionFilters } from '../components/Filters';
import { UnderlyingTable, OptionMatrix } from '../components/OptionList';
import { OptionActions, OptionHeader, OptionsStrategy } from '../components/Sidebar';

const drawerWidth = 400;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginRight: 0,
  },
  header: {
    margin: theme.spacing(1)

  },
  actions: {
    margin: theme.spacing(1)
  },
}));

function Header() {
  const classes = useStyles();

  const username = "Theta Warrior";

  return <Typography className={classes.header} variant="h5" align="center" component="h1" gutterBottom>
    Hello {username}. Here's some options
   </Typography>
}

function App() {
  const classes = useStyles();

  return <div className={classes.root}>
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          Theta Gang Sweden
          </Typography>
      </Toolbar>
    </AppBar>
    <main className={classes.content}>
      <Grid container spacing={2}>
        <Grid item xs={12}><Header /></Grid>
        <Grid item xs={12}>
          <Box className={classes.actions}>
            <OptionFilters />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <UnderlyingTable></UnderlyingTable>
        </Grid>
        <Grid item xs={12}>
          <OptionMatrix></OptionMatrix>
        </Grid>
      </Grid>
    </main>
    <Drawer
      className={classes.drawer}
      variant="permanent"
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerHeader}>
        <OptionHeader></OptionHeader>
      </div>
      <Divider />
      <div className={classes.drawerContainer}>
        <OptionActions></OptionActions>
      </div>
      <Divider />
      <div className={classes.drawerHeader}>
        <Typography variant="h6">Strategy</Typography>
      </div>
      <div className={classes.drawerContainer}>
        <OptionsStrategy></OptionsStrategy>
      </div>
    </Drawer>

  </div>
}

export default function Index() {
  const apolloClient = createApolloClient("");

  return (
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  );
}