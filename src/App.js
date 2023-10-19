import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Login from './components/login'
import CompanyTable from './components/companyTable';
import BronzeLevelTable from './components/bronzeLevelTable';
import PublishDataToBronzeDB from './components/publishDataToBronzeDB';
import React, {useState} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';
import PublishDataToSilverDB from './components/publishDataToSilverDB';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className="App">
      <div className='container'>
        {/* <Header value={loggedIn? "Manual Override Table" : "Login Form"}/> */}
        <Routes>
          <Route path='/' element={<Navigate replace to="/login" />}/>
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn}/>}/>
          <Route path="/publish" element={<PublishDataToBronzeDB />}/>
          <Route path="/bronze" element={<PublishDataToSilverDB />}/>
        </Routes>
        {/* {loggedIn? <> <Header/> <CompanyTable/> </> : <Login setLoggedIn={setLoggedIn}/>}     */}
      </div>
    </div>
  );
}

export default App;
