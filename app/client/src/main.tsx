// import React from 'react'
// import ReactDOM from 'react-dom/client'
import { render } from 'react-dom'
import TopLayout from './TopLayout.tsx'
import App from './App.tsx'
import { configure } from './apollo/client';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

configure({ baseUrl: import.meta.env.VITE_API_URL });

const container = document.getElementById('root')!;

render(
    <TopLayout >
      <App />
    </TopLayout>
  , container)