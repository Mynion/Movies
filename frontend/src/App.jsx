
import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Lists from "./pages/Lists";
import History from "./pages/History";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/lists" element={<Lists />} />
                <Route path="/history" element={<History />} />

                <Route path="/movie/:type/:id" element={<MovieDetails />} />

                <Route
                    path="/movie/tv/:id/season/:seasonNumber/episode/:episodeNumber"
                    element={<MovieDetails />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
