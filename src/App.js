import './App.css';
import Toastcontainer from './components/common/Toastcontainer';
import Addcourt from './pages/Addcourt';
import CourtUserViewPage from './pages/CourtUserViewPage';
import Home from './pages/Home';
import Login from './pages/Login';
import{BrowserRouter,Route,Routes}from'react-router-dom'
import Mybookings from './pages/Mybookings';
import { AdminAuth, LoginAuth, UserAuth } from './Authorization/authorization';

function App() {
  return (
    <div className="App">

      <Toastcontainer/>

      <BrowserRouter>

      <Routes>
        {/* Login */}
        <Route element={<LoginAuth/>} >
        <Route path='/' element={<Login/>} />
        </Route>

        {/* userRoutes */}
        <Route element={<UserAuth/>}>
        <Route path='/home' element={<Home/>} />
        <Route path='/courtUserViewPage/:id' element={<CourtUserViewPage/>} />
        <Route path='/mybookings' element={<Mybookings/>} />
        </Route>

         {/* adminroute */}
         <Route element={<AdminAuth/>}>
        <Route path='/addcourt' element={<Addcourt/>} />
        </Route>




        </Routes>
        
      </BrowserRouter>
      
     
      
    </div>
  );
}

export default App;
