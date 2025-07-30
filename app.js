// ==========================================================
//            LifeOS - Motor Principal de la Aplicación (v18.0)
// ==========================================================
import { BIOMECH_DB } from './database.js'; // <-- Importa la base de datos explícitamente.

const App = {
    state: { editorOpen: false, editorSelectedDay: '', customRoutines: {} },
    init() {
        this.state.customRoutines = JSON.parse(localStorage.getItem('lifeOS_Custom_v18')) || {};
        this.state.editorSelectedDay = new Date().toLocaleDateString('en-US', {weekday:'long'});
        
        document.getElementById('app').addEventListener('click', this.handleEvents.bind(this));
        document.getElementById('app').addEventListener('input', this.handleEvents.bind(this));
        
        this.render();
    },
    saveState() {
        localStorage.setItem('lifeOS_Custom_v18', JSON.stringify(this.state.customRoutines));
    },
    render() {
        document.getElementById('app').innerHTML = `<header><h1>LifeOS <span>v18.0</span></h1></header><main>${this.renderDashboard()}</main>${this.state.editorOpen ? this.renderEditorModal() : ''}`;
    },
    renderDashboard() {
        const todayName = new Date().toLocaleDateString('en-US',{weekday:'long'});
        const routineDay = this.state.customRoutines[todayName];
        let exercisesHTML = `<p>No tienes rutina. ¡Constrúyela!</p>`;
        if (routineDay && routineDay.exercises.length > 0) {
            exercisesHTML = routineDay.exercises.map(ex => this.renderExerciseCard(ex.key)).join('');
        }
        return `<div class="card"><div class="card-header"><h2 class="card-title">Misión: ${todayName}</h2><button class="action-button" data-action="openEditor">Construir / Editar</button></div><div>${exercisesHTML}</div></div>`;
    },
    renderExerciseCard(key) {
        const exData = BIOMECH_DB.get(key); // BIOMECH_DB ahora está disponible de forma segura.
        return `<details class="exercise-item" open><summary>${exData.nc}</summary><div class="biomech-feedback"><p><strong>Tipo:</strong> ${exData.tm}</p><p><strong>Clave:</strong> ${exData.pct}</p><p><strong>Evitar:</strong> <span>${exData.rc}</span></p></div></details>`;
    },
    renderEditorModal() {
        const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
        const routineDay = this.state.customRoutines[this.state.editorSelectedDay];
        let exercisesHTML = (routineDay?.exercises || []).map((ex, i) => `<div class="custom-exercise-item"><span>${BIOMECH_DB.get(ex.key)?.nc}</span><button data-action="deleteExercise" data-index="${i}">×</button></div>`).join('');

        return `<div id="editor-modal"><div class="modal-content"><div class="modal-header"><h2 class="modal-title">Editor</h2><button data-action="closeEditor">×</button></div>
                <div id="editor-day-selector">${days.map(d => `<button data-action="selectEditorDay" data-day="${d}" class="${d===this.state.editorSelectedDay?'active':''} editor-day-btn">${d}</button>`).join('')}</div>
                <h3>Editando: ${this.state.editorSelectedDay}</h3><input id="exercise-search-input" type="text" placeholder="Buscar ejercicio..."><div id="suggestions-box"></div>
                <div id="exercise-list-for-day">${exercisesHTML}</div></div></div>`;
    },
    handleEvents(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;

        if (action === 'openEditor') this.state.editorOpen = true;
        if (action === 'closeEditor') { this.state.editorOpen = false; this.saveState(); }
        if (action === 'selectEditorDay') this.state.editorSelectedDay = target.dataset.day;
        if (action === 'addExercise') {
            const key = target.dataset.key;
            if(!this.state.customRoutines[this.state.editorSelectedDay]) this.state.customRoutines[this.state.editorSelectedDay] = {exercises:[]};
            this.state.customRoutines[this.state.editorSelectedDay].exercises.push({key});
        }
        if (action === 'deleteExercise') this.state.customRoutines[this.state.editorSelectedDay].exercises.splice(target.dataset.index, 1);
        
        if (e.type === 'input' && e.target.id === 'exercise-search-input') {
            const query = e.target.value.toLowerCase();
            const box = document.getElementById('suggestions-box');
            box.innerHTML = '';
            if (query.length > 1) {
                Object.keys(BIOMECH_DB.getAll()).filter(k => BIOMECH_DB.get(k).nc.toLowerCase().includes(query))
                .forEach(k => box.innerHTML += `<div class="suggestion-item" data-action="addExercise" data-key="${k}">${BIOMECH_DB.get(k).nc}</div>`);
            }
            return;
        }
        this.render();
    }
};

App.init();
