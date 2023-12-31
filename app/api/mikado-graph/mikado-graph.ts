export interface Clock {
  now(): Date
}

export class MikadoGraphId {
  constructor(private id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('The mikado graph id does follow the required format');
    }
  }

  equals(other: MikadoGraphId): boolean {
    return this.id === other.id;
  }

  toString() {
    return this.id;
  }
}

export class PrerequisiteId {
  constructor(private id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      throw new Error('The prerequisite id does follow the required format');
    }
  }

  equals(other: PrerequisiteId): boolean {
    return this.id === other.id;
  }

  toString() {
    return this.id;
  }
}

export class Label {
  constructor(private label: string) {
    if (label === '') {
      throw new Error('The label cannot be empty');
    }
  }

  toString() {
    return this.label;
  }
}

export enum Status {
  TODO = 'todo',
  EXPERIMENTING = 'experimenting',
  DONE = 'done',
}

export class Prerequisite {
  constructor(
    private prerequisiteId: PrerequisiteId,
    private label: Label,
    private status: Status,
    public parentId: MikadoGraphId,
    private canBeCommitted: boolean | null = null,
    private startedAt?: Date,
  ) {
  }

  static new(
    prerequisiteId: string,
    parentId: string,
    label: string,
  ) {
    return new Prerequisite(
      new PrerequisiteId(prerequisiteId),
      new Label(label),
      Status.TODO,
      new MikadoGraphId(parentId),
    );
  }

  start(startedAt: Date): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.EXPERIMENTING,
      this.parentId,
      this.canBeCommitted,
      startedAt,
    );
  }

  done(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      Status.DONE,
      this.parentId,
      this.canBeCommitted,
      this.startedAt,
    );
  }

  prerequisiteCanBeCommitted(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      this.status,
      this.parentId,
      true,
      this.startedAt,
    );
  }

  prerequisiteCannotBeCommitted(): Prerequisite {
    return new Prerequisite(
      this.prerequisiteId,
      this.label,
      this.status,
      this.parentId,
      false,
      this.startedAt,
    );
  }

  identifyBy(prerequisiteId: string): boolean {
    return this.prerequisiteId.equals(new PrerequisiteId(prerequisiteId));
  }

  isParentOf(prerequisite: Prerequisite): boolean {
    return this.prerequisiteId.toString() === prerequisite.parentId.toString();
  }

  hasParent(prerequisite: Prerequisite): boolean {
    return this.parentId === prerequisite.parentId;
  }

  hasStatus(status: Status): boolean {
    return this.status === status;
  }

  toView(): PrerequisiteView {
    return {
      prerequisiteId: this.prerequisiteId.toString(),
      label: this.label.toString(),
      status: this.status as unknown as StatusView,
      startedAt: this.startedAt?.toISOString(),
      parentId: this.parentId.toString(),
      canBeCommitted: this.canBeCommitted === null ? true : this.canBeCommitted,
    };
  }

  toState(): PrerequisiteState {
    return {
      prerequisite_id: this.prerequisiteId.toString(),
      label: this.label.toString(),
      status: this.status as unknown as StatusState,
      started_at: this.startedAt?.toISOString(),
      parent_id: this.parentId.toString(),
      all_children_done: this.canBeCommitted,
    };
  }
}

export class Goal {
  constructor(private goal: string) {
    if (goal === '') {
      throw new Error('The goal cannot be empty');
    }
  }

  toString() {
    return this.goal;
  }
}

export class PrerequisiteList {
  constructor(private prerequisites: Prerequisite[] = []) {}

  add(prerequisite: Prerequisite): PrerequisiteList {
    return new PrerequisiteList([...this.prerequisites, prerequisite]);
  }

  find(callback: (prerequisite: Prerequisite) => boolean): Prerequisite {
    const matchingPrerequisites = this.prerequisites
      .filter(callback);

    return matchingPrerequisites[0];
  }

  replace(prerequisiteId: string, callback: (prerequisite: Prerequisite) => Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map(
          (currentPrerequisite) => (currentPrerequisite.identifyBy(prerequisiteId) ? callback(currentPrerequisite) : currentPrerequisite),
        ),
    );
  }

  replaceParent(prerequisite: Prerequisite, callback: (prerequisite: Prerequisite) => Prerequisite): PrerequisiteList {
    return new PrerequisiteList(
      this.prerequisites
        .map((currentPrerequisite) => (currentPrerequisite.isParentOf(prerequisite) ? callback(currentPrerequisite) : currentPrerequisite)),
    );
  }

  isDone(): boolean {
    return this.prerequisites.every((prerequisite) => prerequisite.hasStatus(Status.DONE));
  }

  toView(): PrerequisiteView[] {
    return this.prerequisites.map((prerequisite) => prerequisite.toView());
  }

  toState(): PrerequisiteState[] {
    return this.prerequisites.map((prerequisite) => prerequisite.toState());
  }
}

export class MikadoGraph {
  private prerequisites: PrerequisiteList;

  constructor(
    private id: MikadoGraphId,
    private goal: Goal,
    private done: boolean,
    prerequisites: Prerequisite[] = [],
  ) {
    this.prerequisites = new PrerequisiteList(prerequisites);
  }

  static start(id: string, goal: string) {
    return new MikadoGraph(new MikadoGraphId(id), new Goal(goal), false, []);
  }

  static fromState(mikadoGraphState: MikadoGraphState) {
    return new MikadoGraph(
      new MikadoGraphId(mikadoGraphState.mikado_graph_id),
      new Goal(mikadoGraphState.goal),
      mikadoGraphState.done,
      mikadoGraphState.prerequisite.map((prerequisiteState) => new Prerequisite(
        new PrerequisiteId(prerequisiteState.prerequisite_id),
        new Label(prerequisiteState.label),
        prerequisiteState.status as unknown as Status,
        new MikadoGraphId(prerequisiteState.parent_id),
        prerequisiteState.all_children_done,
        prerequisiteState.started_at ? new Date(prerequisiteState.started_at) : undefined,
      )),
    );
  }

  startExperimentation(prerequisiteId: string, startedAt: Date): void {
    this.prerequisites = this.prerequisites.replace(prerequisiteId, (prerequisite) => {
      if (!prerequisite.hasStatus(Status.TODO)) {
        throw new Error('You can only start an experimentation an a todo prerequisite');
      }
      return prerequisite.start(startedAt);
    });
  }

  addPrerequisite(prerequisiteId: string, label: string, parentId?: string): void {
    if (parentId) {
      this.prerequisites = this.prerequisites.replace(parentId, (prerequisite) => prerequisite.prerequisiteCannotBeCommitted());
    }

    this.prerequisites = this.prerequisites.add(Prerequisite.new(prerequisiteId, parentId ?? this.id.toString(), label));
  }

  commitChanges(prerequisiteId: string): void {
    this.prerequisites = this.prerequisites.replace(prerequisiteId, (prerequisite) => {
      if (!prerequisite.hasStatus(Status.EXPERIMENTING)) {
        throw new Error('Chances can only be committed on a experimenting prerequisite');
      }

      return prerequisite.done();
    });

    this.done = this.prerequisites.isDone();

    const prerequisite = this.prerequisites.find((p) => p.identifyBy(prerequisiteId));
    const childrenPrerequisiteUnDone = this.prerequisites.find((p) => p.hasParent(prerequisite) && !p.hasStatus(Status.DONE));
    if (!childrenPrerequisiteUnDone) {
      this.prerequisites = this.prerequisites.replaceParent(prerequisite, (p) => p.prerequisiteCanBeCommitted());
    }
  }

  toView(): MikadoGraphView {
    return {
      mikadoGraphId: this.id.toString(),
      goal: this.goal.toString(),
      done: this.done,
      prerequisites: this.prerequisites.toView(),
    };
  }

  toState(): MikadoGraphState {
    return {
      mikado_graph_id: this.id.toString(),
      goal: this.goal.toString(),
      done: this.done,
      prerequisite: this.prerequisites.toState(),
    };
  }

  identifyBy(id: string): boolean {
    return this.id.equals(new MikadoGraphId(id));
  }

  equals(mikadoGraph: MikadoGraph): boolean {
    return this.id.equals(mikadoGraph.id);
  }
}

export class UnknownMikadoGraph extends Error {
  static fromId(id: string) {
    return new UnknownMikadoGraph(`The mikado graph with the id ${id} does not exist`);
  }
}

export enum StatusState {
  TODO = 'todo',
  EXPERIMENTING = 'experimenting',
  DONE = 'done',
}

export type PrerequisiteState = {
  prerequisite_id: string,
  label: string,
  status: StatusState,
  started_at?: string,
  parent_id: string,
  all_children_done: boolean | null,
};

export type MikadoGraphState = {
  mikado_graph_id: string
  goal: string
  done: boolean
  prerequisite: PrerequisiteState[]
};

export interface MikadoGraphs {
  get(id: string): Promise<MikadoGraph>
  add(mikadoGraph: MikadoGraph): Promise<void>
}

// Read side: only those type are can be used in the frontend
export enum StatusView {
  TODO = 'todo',
  EXPERIMENTING = 'experimenting',
  DONE = 'done',
}

export type PrerequisiteView = {
  prerequisiteId: string,
  label: string,
  status: StatusView,
  startedAt?: string,
  parentId: string,
  canBeCommitted: boolean,
};

export type MikadoGraphView = {
  mikadoGraphId: string
  goal: string
  done: boolean
  prerequisites: PrerequisiteView[]
};
