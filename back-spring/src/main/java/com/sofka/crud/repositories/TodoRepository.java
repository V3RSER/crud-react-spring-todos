package com.sofka.crud.repositories;

import com.sofka.crud.models.Todo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository // Se establece que la interfaz es de tipo repositorio
public interface TodoRepository extends CrudRepository<Todo, Long> {
}