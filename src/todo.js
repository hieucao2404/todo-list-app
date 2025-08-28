export class Todo{
    constructor(id, text, priority = 'low', completed = false){
        this.id = id;
        this.text = text;
        this.priority = priority;
        this.completed = completed;
        this.createdAt = Date.now();
        this.subtasks = []; // array of {id, text, completed}
    }

    addSubtask(text){
        const subtaskId = Date.now() + Math.random();
        this.subtasks.push({id: subtaskId, text, completed:false});
    }

    toggleSubtask(subtaskId){
        this.subtasks = this.subtasks.map(st => 
            st.id === subtaskId ? {...st, completed: !st.completed} : st
        );
    }

    deleteSubtask(subtaskId){
        this.subtasks = this.subtasks.filter(st => st.id !== subtaskId);
    }
}
