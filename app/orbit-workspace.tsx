/* oxlint-disable react/react-compiler, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */
'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  Activity,
  Bell,
  Boxes,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronsLeft,
  CircleDot,
  Filter,
  Gauge,
  Inbox,
  Layers3,
  List,
  Menu,
  MessageSquare,
  Moon,
  MoreHorizontal,
  Plus,
  Rocket,
  Search,
  Settings,
  Sun,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { toast, Toaster } from '@/components/ui/toast';

type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
type Issue = {
  id: string;
  title: string;
  status: Status;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignee: string;
  project: string;
  labels: string[];
  estimate: number;
  updated: string;
};
type View = 'board' | 'list' | 'roadmap' | 'projects' | 'inbox';
const columns: Status[] = ['Backlog', 'Todo', 'In Progress', 'Review', 'Done'];
const colors: Record<string, string> = {
  AM: '#df7f56',
  VK: '#6f78e8',
  LS: '#42a888',
  NR: '#bd6ecf',
};
const seed: Issue[] = [
  {
    id: 'ORB-118',
    title: 'Map keyboard navigation across board',
    status: 'Backlog',
    priority: 'Medium',
    assignee: 'LS',
    project: 'Accessibility',
    labels: ['A11y'],
    estimate: 3,
    updated: '12m',
  },
  {
    id: 'ORB-121',
    title: 'Define notification grouping rules',
    status: 'Todo',
    priority: 'High',
    assignee: 'NR',
    project: 'Core experience',
    labels: ['Product'],
    estimate: 5,
    updated: '24m',
  },
  {
    id: 'ORB-124',
    title: 'Ship contextual command menu',
    status: 'Todo',
    priority: 'Urgent',
    assignee: 'VK',
    project: 'Velocity',
    labels: ['Frontend'],
    estimate: 5,
    updated: '1h',
  },
  {
    id: 'ORB-129',
    title: 'Realtime presence in issue details',
    status: 'In Progress',
    priority: 'High',
    assignee: 'AM',
    project: 'Collaboration',
    labels: ['Realtime'],
    estimate: 8,
    updated: '8m',
  },
  {
    id: 'ORB-132',
    title: 'Polish workspace switcher motion',
    status: 'In Progress',
    priority: 'Medium',
    assignee: 'VK',
    project: 'Core experience',
    labels: ['Motion'],
    estimate: 3,
    updated: '36m',
  },
  {
    id: 'ORB-136',
    title: 'Optimistic issue status updates',
    status: 'Review',
    priority: 'High',
    assignee: 'LS',
    project: 'Velocity',
    labels: ['Backend'],
    estimate: 5,
    updated: '5m',
  },
  {
    id: 'ORB-139',
    title: 'Release cycle health indicators',
    status: 'Done',
    priority: 'Medium',
    assignee: 'NR',
    project: 'Analytics',
    labels: ['Data'],
    estimate: 3,
    updated: '2h',
  },
  {
    id: 'ORB-141',
    title: 'Responsive board density pass',
    status: 'Done',
    priority: 'Low',
    assignee: 'AM',
    project: 'Mobile',
    labels: ['Design'],
    estimate: 2,
    updated: '3h',
  },
];
const nav: {
  label: string;
  icon: typeof Inbox;
  view?: View;
  badge?: string;
}[] = [
  { label: 'Inbox', icon: Inbox, view: 'inbox', badge: '4' },
  { label: 'My issues', icon: CircleDot, view: 'list' },
  { label: 'Projects', icon: Boxes, view: 'projects' },
  { label: 'Views', icon: Layers3, view: 'board' },
  { label: 'Roadmap', icon: Gauge, view: 'roadmap' },
  { label: 'Teams', icon: Users },
];

function Avatar({
  initials,
  small = false,
}: {
  initials: string;
  small?: boolean;
}) {
  return (
    <span
      className={`${small ? 'size-5 text-[8px]' : 'size-7 text-[10px]'} avatar`}
      style={{ background: colors[initials] }}
    >
      {initials}
    </span>
  );
}
function Priority({ value }: { value: Issue['priority'] }) {
  const bars = { Low: 1, Medium: 2, High: 3, Urgent: 4 }[value];
  return (
    <span
      className={`priority priority-${value.toLowerCase()}`}
      aria-label={`${value} priority`}
    >
      {[1, 2, 3, 4].map((n) => (
        <i key={n} className={n <= bars ? 'on' : ''} />
      ))}
    </span>
  );
}
function IssueCard({
  issue,
  onOpen,
}: {
  issue: Issue;
  onOpen: (i: Issue) => void;
}) {
  const d = useDraggable({ id: issue.id, data: { issue } });
  return (
    <article
      ref={d.setNodeRef}
      style={{
        transform: d.transform
          ? `translate3d(${d.transform.x}px,${d.transform.y}px,0)`
          : undefined,
      }}
      className={`issue-card ${d.isDragging ? 'dragging' : ''}`}
      onClick={() => !d.isDragging && onOpen(issue)}
      {...d.listeners}
      {...d.attributes}
    >
      <div className="issue-meta">
        <span>{issue.id}</span>
        <MoreHorizontal />
      </div>
      <h3>{issue.title}</h3>
      <div className="labels">
        {issue.labels.map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
      <div className="issue-footer">
        <div>
          <Priority value={issue.priority} />
          <span className="estimate">{issue.estimate}</span>
        </div>
        <Avatar initials={issue.assignee} small />
      </div>
    </article>
  );
}

function IssueCardPreview({ issue }: { issue: Issue }) {
  return (
    <article className="issue-card drag-preview" aria-hidden="true">
      <div className="issue-meta">
        <span>{issue.id}</span>
        <MoreHorizontal />
      </div>
      <h3>{issue.title}</h3>
      <div className="labels">
        {issue.labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="issue-footer">
        <div>
          <Priority value={issue.priority} />
          <span className="estimate">{issue.estimate}</span>
        </div>
        <Avatar initials={issue.assignee} small />
      </div>
    </article>
  );
}
function BoardColumn({
  status,
  issues,
  onOpen,
  onAdd,
}: {
  status: Status;
  issues: Issue[];
  onOpen: (i: Issue) => void;
  onAdd: () => void;
}) {
  const d = useDroppable({ id: status });
  return (
    <section
      ref={d.setNodeRef}
      className={`board-column ${d.isOver ? 'is-over' : ''}`}
    >
      <header>
        <div>
          <i
            className={`status-dot status-${status.replace(' ', '-').toLowerCase()}`}
          />
          <strong>{status}</strong>
          <span>{issues.length}</span>
        </div>
        <button onClick={onAdd} aria-label={`Add issue to ${status}`}>
          <Plus />
        </button>
      </header>
      <div className="cards">
        {issues.map((i) => (
          <IssueCard key={i.id} issue={i} onOpen={onOpen} />
        ))}
        {issues.length === 0 && (
          <button className="empty-column" onClick={onAdd}>
            <Plus />
            Add the first issue
          </button>
        )}
      </div>
    </section>
  );
}

export function OrbitWorkspace() {
  const [issues, setIssues] = useState(seed),
    [view, setView] = useState<View>('board'),
    [collapsed, setCollapsed] = useState(false),
    [mobile, setMobile] = useState(false),
    [dark, setDark] = useState(true),
    [commands, setCommands] = useState(false),
    [create, setCreate] = useState(false),
    [selected, setSelected] = useState<Issue | null>(null),
    [query, setQuery] = useState(''),
    [title, setTitle] = useState(''),
    [filterOpen, setFilterOpen] = useState(false),
    [statusFilter, setStatusFilter] = useState<Status | 'All'>('All'),
    [assigneeFilter, setAssigneeFilter] = useState('All');
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommands((v) => !v);
      }
      if (
        e.key.toLowerCase() === 'c' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        setCreate(true);
      }
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [dark]);
  const filtered = useMemo(
    () =>
      issues.filter((i) => {
        const matchesQuery =
          `${i.id} ${i.title} ${i.project} ${i.labels.join(' ')}`
            .toLowerCase()
            .includes(query.toLowerCase());
        return (
          matchesQuery &&
          (statusFilter === 'All' || i.status === statusFilter) &&
          (assigneeFilter === 'All' || i.assignee === assigneeFilter)
        );
      }),
    [issues, query, statusFilter, assigneeFilter],
  );
  const done = issues.filter((i) => i.status === 'Done').length,
    progress = Math.round((done / issues.length) * 100),
    points = issues.reduce((sum, issue) => sum + issue.estimate, 0),
    activeFilters =
      Number(statusFilter !== 'All') + Number(assigneeFilter !== 'All');
  const move = (e: DragEndEvent) => {
    const status = e.over?.id as Status | undefined,
      id = e.active.id as string;
    setActiveIssue(null);
    if (!status || !columns.includes(status)) return;
    setIssues((x) =>
      x.map((i) => (i.id === id ? { ...i, status, updated: 'now' } : i)),
    );
    toast.add({
      title: 'Issue updated',
      description: `${id} moved to ${status}.`,
      type: 'success',
    });
  };
  const make = () => {
    if (!title.trim()) return;
    const issue: Issue = {
      id: `ORB-${150 + issues.length}`,
      title: title.trim(),
      status: 'Todo',
      priority: 'Medium',
      assignee: 'VK',
      project: 'Core experience',
      labels: ['New'],
      estimate: 3,
      updated: 'now',
    };
    setIssues((x) => [issue, ...x]);
    setTitle('');
    setCreate(false);
    toast.add({
      title: 'Issue created',
      description: `${issue.id} is ready in Todo.`,
      type: 'success',
    });
  };
  const choose = (v: View) => {
    setView(v);
    setMobile(false);
  };
  const updateSelected = (change: Partial<Issue>) => {
    if (!selected) return;
    const next = { ...selected, ...change, updated: 'now' };
    setIssues((items) =>
      items.map((item) => (item.id === selected.id ? next : item)),
    );
    setSelected(next);
  };
  const duplicateSelected = () => {
    if (!selected) return;
    const copy = {
      ...selected,
      id: `ORB-${150 + issues.length}`,
      title: `${selected.title} (copy)`,
      updated: 'now',
    };
    setIssues((items) => [copy, ...items]);
    setSelected(copy);
    toast.add({
      title: 'Issue duplicated',
      description: `${copy.id} is ready to edit.`,
      type: 'success',
    });
  };
  const deleteSelected = () => {
    if (!selected) return;
    setIssues((items) => items.filter((item) => item.id !== selected.id));
    toast.add({
      title: 'Issue deleted',
      description: `${selected.id} was removed from this demo.`,
      type: 'success',
    });
    setSelected(null);
  };
  const demoNotice = (feature: string) =>
    toast.add({
      title: `${feature} preview`,
      description:
        'This portfolio demo keeps the experience local and reversible.',
      type: 'success',
    });
  const heading =
    view === 'board'
      ? 'Build the next orbit'
      : (
          {
            list: 'All issues',
            roadmap: 'Roadmap',
            projects: 'Projects',
            inbox: 'Inbox',
          } as Record<string, string>
        )[view];
  return (
    <Toaster>
      <div className="app-shell">
        <aside
          className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobile ? 'mobile-open' : ''}`}
        >
          <button
            className="workspace"
            onClick={() => demoNotice('Workspace switcher')}
            aria-label="Switch workspace"
          >
            <div className="orbit-mark">
              <i />
              <i />
              <span>O</span>
            </div>
            {!collapsed && (
              <div>
                <strong>Orbit Labs</strong>
                <span>Product workspace · Demo</span>
              </div>
            )}
            <ChevronDown className="chevron" />
          </button>
          <nav>
            {nav.map((n) => (
              <button
                key={n.label}
                className={n.view === view ? 'active' : ''}
                aria-current={n.view === view ? 'page' : undefined}
                onClick={() => (n.view ? choose(n.view) : demoNotice(n.label))}
              >
                <n.icon />
                <span>{n.label}</span>
                {n.badge && <b>{n.badge}</b>}
              </button>
            ))}
          </nav>
          <div className="nav-group">
            <p>Favorites</p>
            <button onClick={() => choose('board')}>
              <span className="project-glyph violet">V</span>
              <span>Velocity</span>
            </button>
            <button onClick={() => choose('projects')}>
              <span className="project-glyph coral">C</span>
              <span>Core experience</span>
            </button>
          </div>
          <div className="sidebar-foot">
            <button onClick={() => setDark((v) => !v)}>
              {dark ? <Sun /> : <Moon />}
              <span>{dark ? 'Light mode' : 'Dark mode'}</span>
            </button>
            <button onClick={() => demoNotice('Settings')}>
              <Settings />
              <span>Settings</span>
            </button>
          </div>
          <button
            className="sidebar-collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label="Collapse sidebar"
          >
            <ChevronsLeft />
          </button>
        </aside>
        {mobile && (
          <button
            className="mobile-scrim"
            onClick={() => setMobile(false)}
            aria-label="Close sidebar"
          />
        )}
        <main className="main-shell">
          <header className="topbar">
            <button
              className="mobile-menu"
              onClick={() => setMobile(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <div className="breadcrumbs">
              <span>Orbit Labs</span>
              <i>/</i>
              <strong>{view === 'board' ? 'Velocity' : heading}</strong>
            </div>
            <button
              className="search-trigger"
              onClick={() => setCommands(true)}
            >
              <Search />
              <span>Search or jump to…</span>
              <kbd>⌘ K</kbd>
            </button>
            <div className="top-actions">
              <button
                onClick={() => demoNotice('Activity')}
                aria-label="Open activity"
              >
                <Activity />
              </button>
              <button
                className="notification"
                onClick={() => choose('inbox')}
                aria-label="Open notifications"
              >
                <Bell />
                <i />
              </button>
              <Avatar initials="VK" />
            </div>
          </header>
          <section className="content">
            <div className="page-heading">
              <div>
                <div className="eyebrow">
                  <span className="project-glyph violet">V</span>Velocity ·
                  Engineering
                </div>
                <h1>{heading}</h1>
                <p>
                  {view === 'board'
                    ? 'A focused cycle for the interactions that make teams feel fast.'
                    : 'Everything your team needs, in one calm workspace.'}
                </p>
              </div>
              <div className="heading-actions">
                <Button variant="outline" onClick={() => setCommands(true)}>
                  <Search />
                  Search
                </Button>
                <Button onClick={() => setCreate(true)}>
                  <Plus />
                  New issue
                </Button>
              </div>
            </div>
            {view === 'board' && (
              <>
                <div className="cycle-strip">
                  <div className="cycle-orbit">
                    <span>{progress}%</span>
                  </div>
                  <div>
                    <span>Cycle 08</span>
                    <strong>Momentum</strong>
                    <small>
                      Sep 1 – Sep 14 · {done} of {issues.length} complete
                    </small>
                  </div>
                  <div className="cycle-metrics">
                    <div>
                      <b>{points}</b>
                      <span>points</span>
                    </div>
                    <div>
                      <b>4d</b>
                      <span>remaining</span>
                    </div>
                    <div className="members">
                      <Avatar initials="VK" small />
                      <Avatar initials="AM" small />
                      <Avatar initials="LS" small />
                      <Avatar initials="NR" small />
                    </div>
                  </div>
                </div>
                <div className="viewbar">
                  <div className="view-tabs">
                    <button className="active">
                      <Layers3 />
                      Board
                    </button>
                    <button onClick={() => setView('list')}>
                      <List />
                      List
                    </button>
                  </div>
                  <div className="view-tools">
                    <button
                      onClick={() => setFilterOpen((value) => !value)}
                      aria-expanded={filterOpen}
                    >
                      <Filter />
                      Filter {activeFilters > 0 && <b>{activeFilters}</b>}
                    </button>
                    <button
                      className={assigneeFilter !== 'All' ? 'is-active' : ''}
                      onClick={() => setFilterOpen(true)}
                    >
                      <Users />
                      Assignee
                    </button>
                    <button
                      onClick={() => demoNotice('Board options')}
                      aria-label="Board options"
                    >
                      <MoreHorizontal />
                    </button>
                  </div>
                </div>
                {filterOpen && (
                  <div className="filter-panel" aria-label="Issue filters">
                    <label>
                      Status
                      <select
                        value={statusFilter}
                        onChange={(e) =>
                          setStatusFilter(e.target.value as Status | 'All')
                        }
                      >
                        <option>All</option>
                        {columns.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Assignee
                      <select
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                      >
                        <option>All</option>
                        {Object.keys(colors).map((person) => (
                          <option key={person}>{person}</option>
                        ))}
                      </select>
                    </label>
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setAssigneeFilter('All');
                      }}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
                <DndContext
                  id="orbit-board"
                  sensors={sensors}
                  onDragStart={(event) =>
                    setActiveIssue(event.active.data.current?.issue ?? null)
                  }
                  onDragCancel={() => setActiveIssue(null)}
                  onDragEnd={move}
                >
                  <div className="board">
                    {columns.map((s) => (
                      <BoardColumn
                        key={s}
                        status={s}
                        issues={filtered.filter((i) => i.status === s)}
                        onOpen={setSelected}
                        onAdd={() => setCreate(true)}
                      />
                    ))}
                  </div>
                  <DragOverlay
                    dropAnimation={{
                      duration: 180,
                      easing: 'cubic-bezier(.2,.8,.2,1)',
                    }}
                  >
                    {activeIssue ? (
                      <IssueCardPreview issue={activeIssue} />
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </>
            )}
            {view === 'list' && (
              <ListView
                issues={filtered}
                query={query}
                setQuery={setQuery}
                onOpen={setSelected}
                onBoard={() => setView('board')}
              />
            )}{' '}
            {view === 'roadmap' && <Roadmap />}
            {view === 'projects' && <Projects />}
            {view === 'inbox' && <InboxView />}
          </section>
        </main>
        <CommandDialog
          open={commands}
          onOpenChange={setCommands}
          title="Orbit command menu"
        >
          <Command>
            <CommandInput placeholder="Search issues, projects, people…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigate">
                {nav
                  .filter((n) => n.view)
                  .map((n) => (
                    <CommandItem
                      key={n.label}
                      onSelect={() => {
                        choose(n.view!);
                        setCommands(false);
                      }}
                    >
                      <n.icon />
                      {n.label}
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Actions">
                <CommandItem
                  onSelect={() => {
                    setCommands(false);
                    setCreate(true);
                  }}
                >
                  <Plus />
                  Create issue<CommandShortcut>C</CommandShortcut>
                </CommandItem>
                <CommandItem onSelect={() => setDark((v) => !v)}>
                  {dark ? <Sun /> : <Moon />}Toggle theme
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    setCommands(false);
                    setView('list');
                  }}
                >
                  <Search />
                  Search all issues
                </CommandItem>
              </CommandGroup>
              <CommandGroup heading="Recent issues">
                {issues.slice(0, 5).map((issue) => (
                  <CommandItem
                    key={issue.id}
                    value={`${issue.id} ${issue.title}`}
                    onSelect={() => {
                      setCommands(false);
                      setSelected(issue);
                    }}
                  >
                    <CircleDot />
                    <span className="command-issue">
                      <strong>{issue.title}</strong>
                      <small>
                        {issue.id} · {issue.status}
                      </small>
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </CommandDialog>
        <Dialog open={create} onOpenChange={setCreate}>
          <DialogContent className="create-dialog">
            <DialogHeader>
              <DialogTitle>Create issue</DialogTitle>
              <DialogDescription>
                Capture the work now. Add details when the team is ready.
              </DialogDescription>
            </DialogHeader>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && make()}
              placeholder="Issue title"
            />
            <div className="quick-fields">
              <button onClick={() => demoNotice('Status picker')}>
                <CircleDot />
                Todo
                <ChevronDown />
              </button>
              <button onClick={() => demoNotice('Priority picker')}>
                <Zap />
                Medium
                <ChevronDown />
              </button>
              <button onClick={() => demoNotice('Assignee picker')}>
                <Avatar initials="VK" small />
                Victor
                <ChevronDown />
              </button>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setCreate(false)}>
                Cancel
              </Button>
              <Button onClick={make} disabled={!title.trim()}>
                Create issue <kbd>↵</kbd>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="issue-dialog" showCloseButton={false}>
            {selected && (
              <>
                <div className="issue-dialog-top">
                  <div className="issue-identity">
                    <span>{selected.id}</span>
                    <i
                      className={`status-dot status-${selected.status.replace(' ', '-').toLowerCase()}`}
                    />
                    <strong>{selected.status}</strong>
                  </div>
                  <div>
                    <button onClick={duplicateSelected}>Duplicate</button>
                    <button className="danger-action" onClick={deleteSelected}>
                      Delete
                    </button>
                    <button
                      onClick={() => setSelected(null)}
                      aria-label="Close issue"
                    >
                      <X />
                    </button>
                  </div>
                </div>
                <DialogHeader>
                  <DialogTitle>
                    <input
                      className="issue-title-input"
                      value={selected.title}
                      onChange={(e) =>
                        updateSelected({ title: e.target.value })
                      }
                      aria-label="Issue title"
                    />
                  </DialogTitle>
                  <DialogDescription>
                    {selected.project} · updated {selected.updated} ago
                  </DialogDescription>
                </DialogHeader>
                <div className="issue-detail-grid">
                  <div className="issue-description">
                    <p>
                      Improve this surface so the team can move through work
                      without losing context. Keep the interaction quick,
                      resilient, and accessible.
                    </p>
                    <h4>Subtasks</h4>
                    <label>
                      <input type="checkbox" defaultChecked /> Define
                      interaction states
                    </label>
                    <label>
                      <input type="checkbox" /> Verify keyboard flow
                    </label>
                    <h4>Activity</h4>
                    <div className="activity-row">
                      <Avatar initials="VK" small />
                      <p>
                        <strong>Victor</strong> moved this issue
                        <br />
                        <span>Todo → {selected.status}</span>
                      </p>
                      <small>12m</small>
                    </div>
                    <div className="activity-row muted-event">
                      <span className="timeline-dot" />
                      <p>
                        <strong>Orbit automation</strong> added{' '}
                        <span>{selected.labels[0]}</span>
                      </p>
                      <small>18m</small>
                    </div>
                    <div className="comment-box">
                      <MessageSquare />
                      <input placeholder="Leave a comment…" />
                    </div>
                  </div>
                  <aside>
                    <Property
                      icon={CircleDot}
                      label="Status"
                      value={selected.status}
                      onClick={() =>
                        updateSelected({
                          status:
                            columns[
                              (columns.indexOf(selected.status) + 1) %
                                columns.length
                            ],
                        })
                      }
                    />
                    <Property
                      icon={Zap}
                      label="Priority"
                      value={selected.priority}
                      onClick={() => {
                        const values: Issue['priority'][] = [
                          'Low',
                          'Medium',
                          'High',
                          'Urgent',
                        ];
                        updateSelected({
                          priority:
                            values[
                              (values.indexOf(selected.priority) + 1) %
                                values.length
                            ],
                        });
                      }}
                    />
                    <Property
                      icon={Users}
                      label="Assignee"
                      value={selected.assignee}
                      onClick={() => {
                        const values = Object.keys(colors);
                        updateSelected({
                          assignee:
                            values[
                              (values.indexOf(selected.assignee) + 1) %
                                values.length
                            ],
                        });
                      }}
                    />
                    <Property
                      icon={Rocket}
                      label="Project"
                      value={selected.project}
                    />
                    <Property
                      icon={CalendarDays}
                      label="Due date"
                      value="Sep 12"
                    />
                  </aside>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Toaster>
  );
}
function Property({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: typeof CircleDot;
  label: string;
  value: string;
  onClick?: () => void;
}) {
  return (
    <button className="property" onClick={onClick}>
      <span>
        <Icon />
        {label}
      </span>
      <strong>{value}</strong>
    </button>
  );
}
function ListView({
  issues,
  query,
  setQuery,
  onOpen,
  onBoard,
}: {
  issues: Issue[];
  query: string;
  setQuery: (v: string) => void;
  onOpen: (i: Issue) => void;
  onBoard: () => void;
}) {
  const [sort, setSort] = useState<'updated' | 'priority'>('updated');
  const priorities: Record<Issue['priority'], number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    Urgent: 4,
  };
  const rows = [...issues].sort((a, b) =>
    sort === 'priority'
      ? priorities[b.priority] - priorities[a.priority]
      : a.updated.localeCompare(b.updated),
  );
  return (
    <div className="list-panel">
      <div className="list-toolbar">
        <div className="view-tabs">
          <button onClick={onBoard}>
            <Layers3 />
            Board
          </button>
          <button className="active">
            <List />
            List
          </button>
        </div>
        <div className="input-search">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter issues…"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setSort(sort === 'updated' ? 'priority' : 'updated')}
        >
          <Filter />
          Sort: {sort}
        </Button>
      </div>
      <div className="issue-table">
        <div className="table-row table-head">
          <span>Issue</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Assignee</span>
          <span>Project</span>
          <span>Updated</span>
        </div>
        {rows.map((i) => (
          <button key={i.id} className="table-row" onClick={() => onOpen(i)}>
            <span>
              <input type="checkbox" onClick={(e) => e.stopPropagation()} />
              <em>{i.id}</em>
              <strong>{i.title}</strong>
            </span>
            <span>
              <i
                className={`status-dot status-${i.status.replace(' ', '-').toLowerCase()}`}
              />
              {i.status}
            </span>
            <span>
              <Priority value={i.priority} />
              {i.priority}
            </span>
            <span>
              <Avatar initials={i.assignee} small />
              {i.assignee}
            </span>
            <span>{i.project}</span>
            <span>{i.updated}</span>
          </button>
        ))}
        {rows.length === 0 && (
          <div className="empty-list">
            <Search />
            <strong>No issues found</strong>
            <span>Try clearing your search or filters.</span>
          </div>
        )}
      </div>
    </div>
  );
}
function Roadmap() {
  const ps = [
    ['Core experience', 'active', '74'],
    ['Realtime collaboration', 'active', '46'],
    ['Mobile orbit', 'planned', '12'],
    ['Analytics foundation', 'completed', '100'],
  ];
  return (
    <div className="roadmap">
      <div className="roadmap-scale">
        <span>SEP</span>
        <span>OCT</span>
        <span>NOV</span>
        <span>DEC</span>
      </div>
      {ps.map((p, n) => (
        <div className="roadmap-row" key={p[0]}>
          <div>
            <span className={`project-glyph ${n % 2 ? 'coral' : 'violet'}`}>
              {p[0][0]}
            </span>
            <strong>{p[0]}</strong>
            <small>{p[1]}</small>
          </div>
          <div className="timeline">
            <i className={`bar bar-${n}`}>
              <span>{p[2]}%</span>
            </i>
          </div>
        </div>
      ))}
    </div>
  );
}
function Projects() {
  return (
    <div className="project-grid">
      {[
        ['Velocity', 'Interactions that make teams feel fast.', '74', '12'],
        [
          'Core experience',
          'A calm, coherent workspace foundation.',
          '61',
          '18',
        ],
        ['Collaboration', 'Realtime presence and conversation.', '46', '9'],
        ['Mobile orbit', 'A focused experience for small screens.', '12', '7'],
      ].map((p, n) => (
        <article key={p[0]}>
          <div className="project-card-top">
            <span className={`project-glyph ${n % 2 ? 'coral' : 'violet'}`}>
              {p[0][0]}
            </span>
            <MoreHorizontal />
          </div>
          <h3>{p[0]}</h3>
          <p>{p[1]}</p>
          <div className="project-progress">
            <span>
              <i style={{ width: `${p[2]}%` }} />
            </span>
            <b>{p[2]}%</b>
          </div>
          <footer>
            <span>
              <CircleDot />
              {p[3]} issues
            </span>
            <div>
              <Avatar initials="VK" small />
              <Avatar initials="AM" small />
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}
function InboxView() {
  return (
    <div className="inbox-panel">
      <div className="inbox-tabs">
        <button className="active">
          All <b>4</b>
        </button>
        <button>Mentions</button>
        <button>Assigned</button>
        <Button variant="ghost">
          <Check />
          Mark all read
        </Button>
      </div>
      {[
        [
          'NR',
          'Nora assigned you to ORB-124',
          'Ship contextual command menu',
          '2m',
        ],
        [
          'AM',
          'Ana commented on ORB-129',
          '“The presence indicator is ready to review.”',
          '18m',
        ],
        [
          'LS',
          'Leo changed the due date',
          'Responsive board density pass · Sep 12',
          '1h',
        ],
        [
          'VK',
          'Cycle 08 is 74% complete',
          '5 issues remain before Momentum closes.',
          '3h',
        ],
      ].map((n, i) => (
        <button
          className={`notification-row ${i < 2 ? 'unread' : ''}`}
          key={n[1]}
        >
          <Avatar initials={n[0]} />
          <span>
            <strong>{n[1]}</strong>
            <p>{n[2]}</p>
          </span>
          <time>{n[3]}</time>
        </button>
      ))}
    </div>
  );
}
