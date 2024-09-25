import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/common/Navigation';
import CanadaTrends from './pages/CanadaTrends';
import TimeSeries from './pages/TimeSeries';
import Home from './pages/Home';
import Helmet from 'react-helmet';

function App() {
  return (
    <>
      <Helmet>
        <title>Covid-19 Dashboard</title>
      </Helmet>
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/canadatrends" element={<CanadaTrends />} />
          <Route path="/timeseries" element={<TimeSeries />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
