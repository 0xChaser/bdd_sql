import { useState, useEffect } from 'react';

export default function GameFormModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        titre: '',
        genre: '',
        plateforme: '',
        editeur: '',
        developpeur: '',
        annee_sortie: new Date().getFullYear(),
        metacritic_score: 0,
        temps_jeu_heures: 0,
        termine: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                genre: initialData.genre.join(', '),
                plateforme: initialData.plateforme.join(', ')
            });
        } else {
            setFormData({
                titre: '',
                genre: '',
                plateforme: '',
                editeur: '',
                developpeur: '',
                annee_sortie: new Date().getFullYear(),
                metacritic_score: 0,
                temps_jeu_heures: 0,
                termine: false
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
            plateforme: formData.plateforme.split(',').map(p => p.trim()).filter(p => p),
            annee_sortie: Number(formData.annee_sortie),
            metacritic_score: Number(formData.metacritic_score),
            temps_jeu_heures: Number(formData.temps_jeu_heures)
        };
        onSubmit(submissionData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">
                    {initialData ? 'Modifier le jeu' : 'Ajouter un jeu'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Titre</label>
                        <input
                            type="text"
                            name="titre"
                            value={formData.titre}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Genre (séparés par des virgules)</label>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Plateforme (séparés par des virgules)</label>
                        <input
                            type="text"
                            name="plateforme"
                            value={formData.plateforme}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Éditeur</label>
                            <input
                                type="text"
                                name="editeur"
                                value={formData.editeur}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Développeur</label>
                            <input
                                type="text"
                                name="developpeur"
                                value={formData.developpeur}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Année</label>
                            <input
                                type="number"
                                name="annee_sortie"
                                value={formData.annee_sortie}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Metacritic</label>
                            <input
                                type="number"
                                name="metacritic_score"
                                value={formData.metacritic_score}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Heures</label>
                            <input
                                type="number"
                                name="temps_jeu_heures"
                                value={formData.temps_jeu_heures}
                                onChange={handleChange}
                                min="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="termine"
                            checked={formData.termine}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">Jeu terminé</label>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {initialData ? 'Mettre à jour' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
