import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = '/tareas'
const token = '123456'

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${token}`
    }
})

export const useTareasStore = defineStore('tareas', {
    state: () => ({
        tareas: [],
        loading: false
    }),
    actions: {
        async fetchTareas() {
            this.loading = true
            try {
                const response = await api.get('/')
                console.log('Tareas obtenidas:', response.data)
                this.tareas = response.data.data  || response.data  || []
            }
            catch (error) {
                console.error('Error al obtener las tareas:', error)
            }
            this.loading = false
        },

        async addTarea(tarea) {
            try {
                const response = await api.post('/', tarea)
                this.tareas.push(response.data.data || response.data)
            }
            catch (error) {
                console.error('Error al agregar la tarea:', error)
            }
        },

        async updateTarea(tarea) {
            this.loading = true
            try {
                const response = await api.put(`/${tarea.id}`, tarea)
                const index = this.tareas.findIndex(t => t.id === tarea.id)
                if (index !== -1) {
                    this.tareas[index] = response.data.data
                }
            }
            catch (error) {
                console.error('Error al actualizar la tarea:', error)
            }
        },

        async deleteTarea(id) {
            try {
                await api.delete(`/${id}`)
                this.tareas = this.tareas.filter(t => t._id !== id)
            }
            catch (error) {
                console.error('Error al eliminar la tarea:', error)
            }
        }
    }
})