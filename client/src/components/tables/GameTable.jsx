import { useEffect, useState } from "react";
import gameService from "../../services/gameService";
import GameFormModal from "../modals/GameFormModal";

export default function GameTable() {
    const [games, setGames] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGame, setEditingGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchGames();
        fetchStats();
    }, []);

    const fetchGames = async () => {
        setLoading(true);
        try {
            const data = await gameService.getAllGames();
            setGames(data);
        } catch (error) {
            console.error("Erreur de récupération des jeux :", error);
            alert("Erreur lors de la récupération des jeux. Vérifiez que le serveur backend est démarré sur le port 8080.");
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await gameService.getStats();
            setStats(data);
        } catch (error) {
            console.error("Erreur de récupération des stats :", error);
        }
    };

    const handleAdd = () => {
        setEditingGame(null);
        setIsModalOpen(true);
    };

    const handleEdit = (game) => {
        setEditingGame(game);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
            try {
                await gameService.deleteGame(id);
                await fetchGames();
                await fetchStats();
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                alert("Erreur lors de la suppression du jeu. Vérifiez votre connexion au serveur.");
            }
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (editingGame) {
                await gameService.updateGame(editingGame._id, data);
            } else {
                await gameService.createGame(data);
            }
            setIsModalOpen(false);
            await fetchGames();
            await fetchStats();
        } catch (error) {
            console.error("Erreur lors de la sauvegarde :", error);
            alert("Erreur lors de la sauvegarde du jeu. Vérifiez que tous les champs requis sont remplis.");
        }
    };

    if (loading) return <p>Chargement...</p>;

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">Ma Collection de Jeux</h2>
                    {stats && (
                        <p className="text-sm text-gray-600">
                            Total: {stats.totalGames} jeux | Temps de jeu: {stats.totalPlayTime}h
                        </p>
                    )}
                </div>
                <div className="space-x-2">
                    <button
                        onClick={() => window.location.href = '/search'}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Recherche Avancée
                    </button>
                    <button
                        onClick={handleAdd}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Ajouter un jeu
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">Titre</th>
                            <th className="border p-2">Genre</th>
                            <th className="border p-2">Plateforme</th>
                            <th className="border p-2">Année</th>
                            <th className="border p-2">Score</th>
                            <th className="border p-2">Heures</th>
                            <th className="border p-2">Terminé</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((game) => (
                            <tr key={game._id} className="text-center hover:bg-gray-50">
                                <td className="border p-2 font-medium">{game.titre}</td>
                                <td className="border p-2">{game.genre.join(", ")}</td>
                                <td className="border p-2">{game.plateforme.join(", ")}</td>
                                <td className="border p-2">{game.annee_sortie}</td>
                                <td className="border p-2">
                                    <span className={`px-2 py-1 rounded ${game.metacritic_score >= 80 ? 'bg-green-100 text-green-800' :
                                        game.metacritic_score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {game.metacritic_score}
                                    </span>
                                </td>
                                <td className="border p-2">{game.temps_jeu_heures}h</td>
                                <td className="border p-2">
                                    {game.termine ? (
                                        <span className="text-green-600">✓</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="border p-2 space-x-2">
                                    <button
                                        onClick={() => handleEdit(game)}
                                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(game._id)}
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {games.length === 0 && (
                            <tr>
                                <td colSpan="8" className="p-4 text-center text-gray-500">
                                    Aucun jeu dans la collection. Commencez par en ajouter un !
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <GameFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingGame}
            />
        </div>
    );
}
