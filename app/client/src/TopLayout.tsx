import React from 'react';
import { Helmet } from 'react-helmet';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

type TopLayoutProps = {
  children: React.ReactNode
}

const useGlobalStyles = makeStyles({
  "@global": {
    html: {
      height: "100vh"
    },
    body: {
      height: "100vh",
    }
  }
});

function MyThemeProvider({ children }: { children: React.ReactNode }) {
  useGlobalStyles();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default function TopLayout({ children }: TopLayoutProps) {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Helmet>
      <MyThemeProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {children}
      </MyThemeProvider>
    </React.Fragment>
  );
}