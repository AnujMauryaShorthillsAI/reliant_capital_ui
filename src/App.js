import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Login from './components/login'
import CompanyTable from './components/companyTable';
import BronzeLevelTable from './components/bronzeLevelTable';
import React, {useState} from 'react';
import {Route, Routes } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <div className='container'>
        <Header value={loggedIn? "Manual Override Table" : "Login Form"}/>
        <Routes>
          <Route path='/' element={<Login setLoggedIn={setLoggedIn}/>}/>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>}/>
          <Route path="/publish" element={<CompanyTable />}/>
          <Route path="/bronze" element={<BronzeLevelTable />}/>
        </Routes>
        {/* {loggedIn? <> <Header/> <CompanyTable/> </> : <Login setLoggedIn={setLoggedIn}/>}     */}
      </div>
    </div>
  );
}

export default App;
