import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Home from './pages/Home';
import NotFound from './old_components/NotFound';
import Upload from './pages/Upload';
// import Navbar from './old_components/Navbar';
// TODO: clean up importing of files, move all of this into one file
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Mulish', serif;
  }
`;

function App() {
	return (
		<Router>
			{/* <Navbar /> */}
			<GlobalStyle />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/upload/:uploadType" element={<Upload />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
}

export default App;
