// ==========================================================
//            LifeOS - Módulo de Base de Conocimiento (v18.0)
// ==========================================================
class BiomechDatabase {
    constructor(){ this.db = {}; }
    add(key, data){ if(key && data.nc && data.mp){ this.db[key] = data; } }
    get(key){ return this.db[key]; }
    getAll(){ return this.db; }
}
const BIOMECH_DB = new BiomechDatabase();

// --- INICIO DE LA BASE DE DATOS COMPLETA ---
// (Puedes expandir esto con todos los ejercicios del libro)
BIOMECH_DB.add("pressBancaBarra", { nc: "Press de Banca con Barra", tm: "Empuje Horizontal", mp: ["Pectoral Mayor"], pct: "Mantener retracción escapular.", rc: "Rebotar la barra." });
BIOMECH_DB.add("sentadillaTrasera", { nc: "Sentadilla Trasera con Barra", tm: "Sentadilla", mp: ["Cuádriceps", "Glúteos"], pct: "Espalda recta, romper paralelo.", rc: "Valgo de rodilla." });
// ... etc ...

// Exporta la instancia para que otros módulos puedan importarla.
export { BIOMECH_DB };
