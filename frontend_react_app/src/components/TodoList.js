import React from "react";
import TodoItem from "./TodoItem";

/**
 * @param {{todos: Array<{id: string, title: string, completed: boolean}>, onToggle: (id: string) => void, onDelete: (id: string) => void}} props
 */
function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return (
      <section className="empty" aria-label="No todos">
        <div className="emptyTitle">No todos yet</div>
        <div className="emptySubtitle">Add your first task above.</div>
      </section>
    );
  }

  return (
    <section className="list" aria-label="Todo list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </section>
  );
}

export default TodoList;
