package com.sofka.crud.services;

import com.sofka.crud.models.Todo;
import com.sofka.crud.repositories.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service // Se establece que la clase es de tipo servicio
public class TodoService {

    @Autowired // Instancia automáticamente TodoRepository
    private TodoRepository repository;

    public Iterable<Todo> listByID() {
        return this.repository.findAll();
    }

    public Todo save(Todo todo) {
        return this.repository.save(todo);
    }

    public void delete(Long id) {
        this.repository.deleteById(id);
    }

    public Todo getByID(Long id) {
        // Si el id no existe, arroja una excepción
        return this.repository.findById(id).orElseThrow();
    }
}
