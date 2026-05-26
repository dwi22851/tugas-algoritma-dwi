import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    // 1. STATE MANAGEMENT
    const [characters, setCharacters] = useState([]);
    const [totalLocations, setTotalLocations] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    // State Tambahan untuk Form POST (Sesuai Halaman 11 Modul)
    const [formData, setFormData] = useState({
        name: "",
        status: "Alive",
        species: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState(null);

    // 2. FUNGSI GET DATA (Mengambil data dari API)
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Endpoint 1: Karakter
            const charResponse = await axios.get(
                `https://rickandmortyapi.com/api/character/?name=${searchTerm}&status=${filterStatus}`,
            );
            setCharacters(charResponse.data.results);

            // Endpoint 2: Lokasi (Memenuhi syarat minimal 2 endpoint berbeda)
            const locResponse = await axios.get(
                "https://rickandmortyapi.com/api/location",
            );
            setTotalLocations(locResponse.data.info.count);
        } catch (err) {
            setError("Waduh, data tidak ditemukan. Coba kata kunci lain!");
            setCharacters([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchTerm, filterStatus]);

    // 3. FUNGSI POST DATA (Mengirim data ke Backend tiruan sesuai Praktikum 2)
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormMessage(null);

        try {
            // Mengirimkan request POST ke JSONPlaceholder seperti contoh di modul
            const response = await axios.post(
                "https://jsonplaceholder.typicode.com/posts",
                {
                    title: formData.name,
                    body: `${formData.status} - ${formData.species}`,
                    userId: 1,
                },
            );

            setFormMessage({
                type: "success",
                text: "Karakter baru berhasil ditambahkan (Simulasi POST)!",
            });

            // Trik agar data lokal langsung bertambah di layar setelah sukses POST
            const newLocalChar = {
                id: Date.now(), // ID acak sementara
                name: formData.name,
                status: formData.status,
                species: formData.species,
                image: "https://rickandmortyapi.com/api/character/avatar/19.jpeg", // Gambar default
                location: { name: "Dimensi Kustom Baru" },
            };
            setCharacters([newLocalChar, ...characters]);
            setFormData({ name: "", status: "Alive", species: "" }); // Reset form
        } catch (err) {
            setFormMessage({
                type: "error",
                text: "Gagal mengirim data POST ke server!",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // 4. TAMPILAN UI
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <header className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                        Rick & Morty Mini Dashboard
                    </h1>
                    <p className="text-gray-400">
                        Menjelajahi alam semesta dengan {totalLocations} dimensi
                        lokasi yang terintegrasi.
                    </p>
                </header>

                {/* FORM POST METHOD (Sesuai Tugas Praktikum 2 di Modul) */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-10 max-w-xl mx-auto shadow-md">
                    <h3 className="text-xl font-bold mb-4 text-green-400">
                        Buat Karakter Kustom Anda (Fitur POST API)
                    </h3>

                    {formMessage && (
                        <div
                            className={`p-3 rounded-lg mb-4 text-sm font-semibold ${formMessage.type === "success" ? "bg-green-900/30 text-green-400 border border-green-800" : "bg-red-900/30 text-red-400 border border-red-800"}`}>
                            {formMessage.text}
                        </div>
                    )}

                    <form
                        onSubmit={handleFormSubmit}
                        className="flex flex-col gap-3">
                        <input
                            type="text"
                            name="name"
                            placeholder="Nama Karakter Baru"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                        />
                        <input
                            type="text"
                            name="species"
                            placeholder="Spesies (Contoh: Human, Alien, Robot)"
                            value={formData.species}
                            onChange={handleInputChange}
                            required
                            className="p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-green-400"
                        />
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="p-2 rounded bg-gray-700 border border-gray-600 text-gray-200 cursor-pointer focus:outline-none focus:border-green-400">
                            <option value="Alive">Hidup (Alive)</option>
                            <option value="Dead">Mati (Dead)</option>
                            <option value="unknown">Tidak Diketahui</option>
                        </select>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-green-500 hover:bg-green-600 text-gray-900 font-bold p-2 rounded transition-colors disabled:opacity-50 cursor-pointer">
                            {isSubmitting
                                ? "Mengirim Data..."
                                : "Simpan Karakter Baru"}
                        </button>
                    </form>
                </div>

                <hr className="border-gray-800 my-8" />

                {/* Search & Filter Section */}
                <div className="flex flex-col md:flex-row gap-4 justify-center mb-10">
                    <input
                        type="text"
                        placeholder="Cari nama karakter asli..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400 w-full md:w-96"
                    />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-green-400 w-full md:w-48 cursor-pointer">
                        <option value="">Semua Status</option>
                        <option value="alive">Hidup (Alive)</option>
                        <option value="dead">Mati (Dead)</option>
                        <option value="unknown">Tidak Diketahui</option>
                    </select>
                </div>

                {/* Conditional Rendering (Loading, Error, Grid) */}
                {loading && (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400 border-solid"></div>
                    </div>
                )}

                {error && !loading && (
                    <div className="text-center text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-800 max-w-md mx-auto">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {characters.map((char) => (
                            <div
                                key={char.id}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300 border border-gray-700">
                                <img
                                    src={char.image}
                                    alt={char.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-5">
                                    <h2
                                        className="text-xl font-bold truncate mb-2"
                                        title={char.name}>
                                        {char.name}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className={`w-3 h-3 rounded-full ${char.status === "Alive" ? "bg-green-500" : char.status === "Dead" ? "bg-red-500" : "bg-gray-400"}`}></span>
                                        <p className="text-gray-300 text-sm">
                                            {char.status} - {char.species}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">
                                            Lokasi Terakhir:
                                        </p>
                                        <p
                                            className="text-sm truncate text-gray-300"
                                            title={char.location?.name}>
                                            {char.location?.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
