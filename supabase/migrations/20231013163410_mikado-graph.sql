CREATE TABLE mikado_graph (
    mikado_graph_id UUID PRIMARY KEY,
    goal TEXT,
    done BOOLEAN
);

CREATE TYPE Status AS ENUM ('todo', 'experimenting', 'done');

CREATE TABLE prerequisite (
    prerequisite_id UUID PRIMARY KEY,
    mikado_graph_id UUID REFERENCES mikado_graph(mikado_graph_id),
    parent_id UUID,
    label TEXT,
    status Status,
    all_children_done BOOLEAN,
    started_at TIMESTAMPTZ
);
