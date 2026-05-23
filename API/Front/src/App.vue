<template>
    <div class="container">
        <h1>Tareas Personales</h1>

        <div class="card">
            <div class="task-form">
                <input v-model="nuevaTarea.titulo" placeholder="Nueva tarea" @keyup.enter="addTask" />
                <textarea v-model="nuevaTarea.descripcion" placeholder="Descripción de la tarea" rows="2"></textarea>
                <button @click="addTask">Agregar</button>
            </div>
        </div>

        <div v-if="store.loading" class="loading">
            <p>Cargando tareas...</p>
        </div>
        <div v-else class="card">
            <div v-if="store.tareas.length === 0" class="loading">
                <p>No hay tareas. ¡Agrega una nueva tarea para empezar!</p>
            </div>
            <div v-else>
                <div v-for="task in store.tareas" :key="task.id" class="task-item">
                    <div class="task-info">
                        <div class="task-title">{{ task.titulo }}</div>
                        <div class="task-description">{{ task.descripcion }}</div>
                        <div class="task-date">Creada el: {{ formatDate(task.fechaCreacion) }}</div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" @click="editTask(task)">Editar</button>
                        <button class="btn-delete" @click="deleteTask(task.id)">Eliminar</button>
                        <button @click="toggleComplete(task)">{{ task.completado ? 'Marcar como Incompleta' : 'Marcar como Completa' }}</button>
                    </div>    
                </div>
            </div>
        </div>

        <div v-if="editingTask" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <h3>Editar Tarea</h3>
                <input v-model="editingTask.title" placeholder="Título de la tarea" class="modal-input"/>
                <textarea v-model="editingTask.description" placeholder="Descripción de la tarea" rows="3" class="modal-input"></textarea>
                <div class="modal-actions">
                    <button @click="updateTask">Guardar Cambios</button>
                    <button @click="cancelEdit">Cancelar</button>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {useTareasStore} from './store.js';

const store = useTareasStore();
const newTask = ref('');
const newDescription = ref('');
const editingTask = ref(null);

const addTask = async () => {
    if (newTask.value.trim() === '') return;
    const tareaData = {
        titulo: newTask.value,
        descripcion: newDescription.value,
        completado: false
    };

    const exito = await store.createTarea(tareaData);
    if (exito) {
        newTask.value = '';
        newDescription.value = '';
    } else {
        alert('Error al crear la tarea. Por favor, inténtalo de nuevo.');
    }
}

const editTask = (task) => {
    editingTask.value = {
        id: task.id,
        titulo: task.titulo,
        descripcion: task.descripcion
    };
}

const saveCambios = async () => {
    if (editingTask.value.titulo.trim() === '') return;

    await store.updateTarea(editingTask.value.id, {
        titulo: editingTask.value.titulo,
        descripcion: editingTask.value.descripcion
    });
    closeModal();
}

const deleteTask = async (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
        await store.deleteTarea(id);
    }
}

const toggleComplete = async (task) => {
    const tareaActualizada = {
        id: task.id,
        titulo: task.titulo,
        descripcion: task.descripcion,
        completado: !task.completado
    };
    await store.updateTarea(tareaActualizada);
}

const cerrarModal = () => {
    editingTask.value = null;
}

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
}

onMounted(() => {
    store.fetchTareas();
})
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    .modal-content {
        background: #fff;
        padding: 24px;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
    }

    .modal-content h3 {
        margin-bottom: 20px;
    }

    .modal-input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
    }

    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
</style>