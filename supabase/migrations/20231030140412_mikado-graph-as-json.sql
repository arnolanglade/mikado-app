DROP TABLE prerequisite;
ALTER TABLE mikado_graph DROP goal, DROP done, ADD aggregate jsonb;
