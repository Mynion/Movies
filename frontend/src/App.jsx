import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
// import Register from "./pages/Register";
// import MovieDetails from "./pages/MovieDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                {/*<Route path="/register" element={<Register />} />*/}

                {/*<Route*/}
                {/*    path="/movie/:type/:id"*/}
                {/*    element={<MovieDetails />}*/}
                {/*/>*/}
            </Routes>
        </BrowserRouter>
    );
}

export default App;