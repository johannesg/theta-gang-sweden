import * as React from 'react'

import { ApolloProvider } from "@apollo/client"
import { createApolloClient } from '../apollo/client';

import Layout from '../components/Layout'

import { Typography, Grid, makeStyles, Box } from '@material-ui/core'

// import catList from '../cats';
import { green, red } from '@material-ui/core/colors';
import { SelectInstrument, SelectFilters } from '../components/Filters';
import OptionList from '../components/OptionList';
// import { NetworkStatus } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  header: {
    margin: theme.spacing(1)

  },
  actions: {
    margin: theme.spacing(1)
  },
  card: {
    margin: theme.spacing(1)
  },
  progress: {
    margin: theme.spacing(1)
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  favourite: {
    color: red[600]
  },
  thumbUp: {
    color: green[600]
  },
  thumbDown: {
    color: red[600]
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

  return <Grid container>
    <Grid item xs={12}><Header /></Grid>
    <Grid item xs={12}>
      <Box className={classes.actions}>
        <SelectFilters />
      </Box>
    </Grid>
    <Grid item xs={12}>
      <OptionList></OptionList>
    </Grid>
  </Grid>
}

export default function Index() {
  const apolloClient = createApolloClient("");

  return (
    <Layout title="Theta Gang Sweden">
      <ApolloProvider client={apolloClient}>
        <App />
      </ApolloProvider>
    </Layout>
  );
}