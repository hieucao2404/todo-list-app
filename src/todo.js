export class Todo{
    constructor(id, text, priority = 'low', completed = false){
        this.id = id;
        this.text = text;
        this.priority = priority;
        this.completed = completed;
        this.createdAt = Date.now();
    }
}