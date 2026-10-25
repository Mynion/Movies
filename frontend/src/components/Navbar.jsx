import { Link } from "react-router";

function Navbar({ search, setSearch }) {
    return (
        <nav className="bg-[#242426] border-b border-[#303034]">

            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">

                <h1 className="text-xl font-bold text-white">
                    MovieDiary
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">

                    {/*<a href="#" className="hover:text-white">Filmy</a>*/}
                    {/*<a href="#" className="hover:text-white">Seriale</a>*/}
                    {/*<a href="#" className="hover:text-white">Rankingi</a>*/}
                    {/*<a href="#" className="hover:text-white">Listy</a>*/}
                    {/*<a href="#" className="hover:text-white">Historia</a>*/}
                    {/*<a href="#" className="hover:text-white">Konto</a>*/}
                    <div className="flex items-center gap-3">

                        <Link to="/" className="text-gray-300 hover:text-white text-sm">
                            Filmy
                        </Link>

                        <Link to="/" className="text-gray-300 hover:text-white text-sm">
                            Seriale
                        </Link>

                        <Link to="/rankings" className="text-gray-300 hover:text-white text-sm">
                            Rankingi
                        </Link>

                        {/*<Link to="/history" className="text-gray-300 hover:text-white text-sm">*/}
                        {/*    Historia*/}
                        {/*</Link>*/}

                        <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                            Zaloguj się
                        </Link>

                        <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                            Rejestracja
                        </Link>

                    </div>

                    <input
                        type="text"
                        placeholder="Szukaj filmu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#303034] rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-[#cf6054]"
                    />

                </div>
            </div>
        </nav>
    );
}

export default Navbar;