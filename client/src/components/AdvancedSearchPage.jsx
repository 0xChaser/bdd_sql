import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gameService from '../services/gameService';

export default function AdvancedSearchPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        genre: '',
        plateforme: ''
    });
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const params = {};
            if (searchParams.genre) params.genre = searchParams.genre;
            if (searchParams.plateforme) params.plateforme = searchParams.plateforme;

            const data = await gameService.getAllGames(params);
            setResults(data);
            setSearched(true);
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            alert("Erreur lors de la recherche.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Recherche Avancée</h1>
                <button
                    onClick={() => navigate('/')}
                    className="text-blue-600 hover:text-blue-800"
                >
                    &larr; Retour à l'accueil
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <form onSubmit={handleSearch} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <input
                            type="text"
                            name="genre"
                            value={searchParams.genre}
                            onChange={handleChange}
                            placeholder="Ex: RPG, Action..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plateforme</label>
                        <input
                            type="text"
                            name="plateforme"
                            value={searchParams.plateforme}
                            onChange={handleChange}
                            placeholder="Ex: PC, PS5..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Recherche...' : 'Rechercher'}
                    </button>
                </form>
            </div>

            {searched && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">Résultats ({results.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border-b p-3 text-left">Titre</th>
                                    <th className="border-b p-3 text-left">Genre</th>
                                    <th className="border-b p-3 text-left">Plateforme</th>
                                    <th className="border-b p-3 text-left">Année</th>
                                    <th className="border-b p-3 text-left">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((game) => (
                                    <tr key={game._id} className="hover:bg-gray-50">
                                        <td className="border-b p-3 font-medium">{game.titre}</td>
                                        <td className="border-b p-3">{game.genre.join(", ")}</td>
                                        <td className="border-b p-3">{game.plateforme.join(", ")}</td>
                                        <td className="border-b p-3">{game.annee_sortie}</td>
                                        <td className="border-b p-3">
                                            <span className={`px-2 py-1 rounded text-sm ${game.metacritic_score >= 80 ? 'bg-green-100 text-green-800' :
                                                    game.metacritic_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {game.metacritic_score}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {results.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-gray-500">
                                            Aucun jeu ne correspond à vos critères.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
