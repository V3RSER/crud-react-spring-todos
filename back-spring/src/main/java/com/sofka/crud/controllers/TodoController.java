package com.sofka.crud.controllers;

import com.sofka.crud.models.Todo;
import com.sofka.crud.services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController // Se establece que la clase es de tipo controlador
@RequestMapping("/api") // Dirección del donde se pueden usar los métodos de la clase
public class TodoController {

    @Autowired // Instancia automáticamente TodoService
    private TodoService service;

    @GetMapping(path = "/todo") // Petición GET
    public Iterable<Todo> listByID() {
        return service.listByID();
    }

    @PostMapping(path = "/todo") // Petición POST
    public Todo save(@RequestBody Todo todo) {
        return service.save(todo);
    }

    @PutMapping(path = "/todo") // Petición PUT
    public Todo update(@RequestBody Todo todo) {
        if (todo.getId() != null) {
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id para actualizar.");
    }

    @DeleteMapping(path = "/todo/{id}") // Petición DELETE
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }

    @GetMapping(path = "/todo/{id}") // Petición GET
    public Todo getByID(@PathVariable("id") Long id) {
        return service.getByID(id);
    }
}